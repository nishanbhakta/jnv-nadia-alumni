-- ==============================================================================
-- JNV NADIA ALUMNI COMMUNITY PORTAL - ALL-IN-ONE SETUP SCRIPT
-- Paste and run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ugkowicfqstqyyiycqxz/sql/new
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Administrators Table
CREATE TABLE IF NOT EXISTS public.administrators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'moderator')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Alumni Table
CREATE TABLE IF NOT EXISTS public.alumni (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    contact_number TEXT,
    email TEXT NOT NULL,
    is_email_public BOOLEAN NOT NULL DEFAULT true,
    is_phone_public BOOLEAN NOT NULL DEFAULT false,
    date_of_birth DATE, -- PRIVATE: Never exposed in public directory queries
    passing_year INTEGER NOT NULL CHECK (passing_year BETWEEN 1980 AND 2050),
    current_position TEXT,
    company_or_institution TEXT,
    location TEXT,
    bio TEXT,
    profile_image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Story Sections Table (Flexible multi-section journeys)
CREATE TABLE IF NOT EXISTS public.story_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumni_id UUID NOT NULL REFERENCES public.alumni(id) ON DELETE CASCADE,
    heading TEXT NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumni_id UUID NOT NULL REFERENCES public.alumni(id) ON DELETE CASCADE,
    visitor_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    visitor_identifier TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'pending', 'rejected', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Likes Table (Unique like per visitor identifier)
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumni_id UUID NOT NULL REFERENCES public.alumni(id) ON DELETE CASCADE,
    visitor_identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_alumni_visitor_like UNIQUE (alumni_id, visitor_identifier)
);

-- 7. Profile Views Table (With spam/refresh throttling)
CREATE TABLE IF NOT EXISTS public.profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumni_id UUID NOT NULL REFERENCES public.alumni(id) ON DELETE CASCADE,
    visitor_identifier TEXT NOT NULL,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Feedback Form Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    category TEXT NOT NULL CHECK (category IN ('Website suggestion', 'Technical issue', 'Content correction', 'General feedback')),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'spam')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_alumni_slug ON public.alumni (slug);
CREATE INDEX IF NOT EXISTS idx_alumni_passing_year ON public.alumni (passing_year);
CREATE INDEX IF NOT EXISTS idx_alumni_active ON public.alumni (is_active);
CREATE INDEX IF NOT EXISTS idx_alumni_featured ON public.alumni (is_featured);
CREATE INDEX IF NOT EXISTS idx_alumni_auth_user ON public.alumni (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_story_sections_alumni ON public.story_sections (alumni_id, display_order);
CREATE INDEX IF NOT EXISTS idx_comments_alumni ON public.comments (alumni_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_alumni ON public.likes (alumni_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_alumni ON public.profile_views (alumni_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_throttle ON public.profile_views (alumni_id, visitor_identifier, viewed_at DESC);

-- ==============================================================================
-- HELPER FUNCTIONS & SECURE VIEWS
-- ==============================================================================

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.administrators
        WHERE auth_user_id = p_user_id
    );
$$;

-- Secure Public Alumni View (Respects user privacy settings for email and phone number)
CREATE OR REPLACE VIEW public.public_alumni AS
SELECT 
    id,
    full_name,
    slug,
    passing_year,
    current_position,
    company_or_institution,
    location,
    bio,
    profile_image_url,
    CASE WHEN is_email_public THEN email ELSE NULL END AS email,
    CASE WHEN is_phone_public THEN contact_number ELSE NULL END AS contact_number,
    is_email_public,
    is_phone_public,
    is_active,
    is_featured,
    created_at,
    updated_at
FROM public.alumni
WHERE is_active = true;

-- Function to record a throttled profile view (prevents repeated refreshes within 1 hour)
CREATE OR REPLACE FUNCTION public.record_profile_view(p_alumni_id UUID, p_visitor_identifier TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recent_view_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profile_views
        WHERE alumni_id = p_alumni_id
          AND visitor_identifier = p_visitor_identifier
          AND viewed_at > (timezone('utc'::text, now()) - INTERVAL '1 hour')
    ) INTO recent_view_exists;

    IF NOT recent_view_exists THEN
        INSERT INTO public.profile_views (alumni_id, visitor_identifier, viewed_at)
        VALUES (p_alumni_id, p_visitor_identifier, timezone('utc'::text, now()));
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_alumni_updated ON public.alumni;
CREATE TRIGGER on_alumni_updated
    BEFORE UPDATE ON public.alumni
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_story_updated ON public.story_sections;
CREATE TRIGGER on_story_updated
    BEFORE UPDATE ON public.story_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 1. Administrators RLS
DROP POLICY IF EXISTS "Admins can view administrators list" ON public.administrators;
CREATE POLICY "Admins can view administrators list"
    ON public.administrators FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 2. Alumni RLS
DROP POLICY IF EXISTS "Public read active alumni" ON public.alumni;
CREATE POLICY "Public read active alumni"
    ON public.alumni FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "User can insert own profile" ON public.alumni;
CREATE POLICY "User can insert own profile"
    ON public.alumni FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "User can update own profile" ON public.alumni;
CREATE POLICY "User can update own profile"
    ON public.alumni FOR UPDATE
    TO authenticated
    USING (auth.uid() = auth_user_id OR public.is_admin(auth.uid()))
    WITH CHECK (auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete alumni" ON public.alumni;
CREATE POLICY "Admins can delete alumni"
    ON public.alumni FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 3. Story Sections RLS
DROP POLICY IF EXISTS "Public read stories of active alumni" ON public.story_sections;
CREATE POLICY "Public read stories of active alumni"
    ON public.story_sections FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.alumni
            WHERE alumni.id = story_sections.alumni_id
              AND (alumni.is_active = true OR alumni.auth_user_id = auth.uid() OR public.is_admin(auth.uid()))
        )
    );

DROP POLICY IF EXISTS "Alumni can manage own story sections" ON public.story_sections;
CREATE POLICY "Alumni can manage own story sections"
    ON public.story_sections FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.alumni
            WHERE alumni.id = story_sections.alumni_id
              AND (alumni.auth_user_id = auth.uid() OR public.is_admin(auth.uid()))
        )
    );

-- 4. Comments RLS
DROP POLICY IF EXISTS "Public read approved comments" ON public.comments;
CREATE POLICY "Public read approved comments"
    ON public.comments FOR SELECT
    TO anon, authenticated
    USING (
        (is_visible = true AND moderation_status = 'approved') 
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Public can post comments" ON public.comments;
CREATE POLICY "Public can post comments"
    ON public.comments FOR INSERT
    TO anon, authenticated
    WITH CHECK (length(comment_text) >= 2 AND length(visitor_name) >= 2);

DROP POLICY IF EXISTS "Admin can update or delete comments" ON public.comments;
CREATE POLICY "Admin can update or delete comments"
    ON public.comments FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 5. Likes RLS
DROP POLICY IF EXISTS "Public read likes" ON public.likes;
CREATE POLICY "Public read likes"
    ON public.likes FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can insert like" ON public.likes;
CREATE POLICY "Public can insert like"
    ON public.likes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can remove own like" ON public.likes;
CREATE POLICY "Public can remove own like"
    ON public.likes FOR DELETE
    TO anon, authenticated
    USING (true);

-- 6. Profile Views RLS
DROP POLICY IF EXISTS "Public read views" ON public.profile_views;
CREATE POLICY "Public read views"
    ON public.profile_views FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can insert profile view" ON public.profile_views;
CREATE POLICY "Public can insert profile view"
    ON public.profile_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 7. Feedback RLS
DROP POLICY IF EXISTS "Public can submit feedback" ON public.feedback;
CREATE POLICY "Public can submit feedback"
    ON public.feedback FOR INSERT
    TO anon, authenticated
    WITH CHECK (length(message) >= 5 AND length(category) >= 3);

DROP POLICY IF EXISTS "Admins can view and manage feedback" ON public.feedback;
CREATE POLICY "Admins can view and manage feedback"
    ON public.feedback FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- STORAGE BUCKET FOR PROFILE PHOTOS
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-photos',
    'profile-photos',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Public profile photos read" ON storage.objects;
CREATE POLICY "Public profile photos read"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'profile-photos');

DROP POLICY IF EXISTS "Authenticated users can upload profile photo" ON storage.objects;
CREATE POLICY "Authenticated users can upload profile photo"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'profile-photos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can update own profile photo" ON storage.objects;
CREATE POLICY "Users can update own profile photo"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'profile-photos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can delete own profile photo" ON storage.objects;
CREATE POLICY "Users can delete own profile photo"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'profile-photos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ==============================================================================
-- SAMPLE SEED DATA
-- ==============================================================================

-- 1. Insert Sample Alumni
INSERT INTO public.alumni (
    id, full_name, slug, email, contact_number, is_email_public, is_phone_public, passing_year, current_position, company_or_institution, location, bio, profile_image_url, is_active, is_featured
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Nishan Bhakta',
    'nishan-bhakta',
    'nishan.bhakta@example.com',
    '+91 98765 43210',
    true,
    true,
    2016,
    'Lead Software Engineer & Architect',
    'Tech Innovation Labs',
    'Bengaluru, India',
    'Alumnus of JNV Nadia (Batch 2016). Passionate about distributed systems, modern web platforms, and open-source civic technology.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    true,
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'Dr. Arpita Sarkar',
    'arpita-sarkar',
    'arpita.sarkar@example.com',
    '+91 98321 00001',
    true,
    false,
    2014,
    'Senior Resident Doctor (Cardiology)',
    'AIIMS New Delhi',
    'New Delhi, India',
    'Navodaya taught me resilience and empathy. Today I work on cardiovascular clinical research and rural patient care initiatives.',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    true,
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'Sourav Ganguly Roy',
    'sourav-roy',
    'sourav.roy@example.com',
    '+91 98321 00002',
    true,
    true,
    2015,
    'Assistant Commissioner (IRS)',
    'Government of India',
    'Kolkata, West Bengal',
    'Proud alumnus of JNV Nadia. The multi-cultural Navodaya environment shaped my civil service journey and public leadership ethos.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    true,
    true
),
(
    '44444444-4444-4444-4444-444444444444',
    'Priyanka Majumder',
    'priyanka-majumder',
    'priyanka.m@example.com',
    '+91 98321 00003',
    false,
    false,
    2018,
    'AI Research Scholar',
    'Indian Institute of Science (IISc)',
    'Bengaluru, Karnataka',
    'Working on natural language understanding for Indic languages. Cherishing memories of early morning PT and library debates.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    true,
    false
),
(
    '55555555-5555-5555-5555-555555555555',
    'Subhankar Ghosh',
    'subhankar-ghosh',
    'subhankar.g@example.com',
    '+91 98321 00004',
    true,
    true,
    2016,
    'Agritech Founder & Director',
    'Gramin Agro Innovations',
    'Nadia, West Bengal',
    'Empowering local smallholders in Bengal with precision drip irrigation and soil testing. JNV instilled true connection to rural roots.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    true,
    true
),
(
    '66666666-6666-6666-6666-666666666666',
    'Ananya Sen',
    'ananya-sen',
    'ananya.sen@example.com',
    '+91 98321 00005',
    true,
    false,
    2017,
    'Product Designer',
    'DesignCraft Studio',
    'Mumbai, Maharashtra',
    'Designing humane interfaces and storytelling experiences. Forever grateful for the art room and annual day stage back at school.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    true,
    false
),
(
    '77777777-7777-7777-7777-777777777777',
    'Debabrata Biswas',
    'debabrata-biswas',
    'debabrata.b@example.com',
    '+91 98321 00006',
    true,
    false,
    2012,
    'Assistant Professor of Physics',
    'Jadavpur University',
    'Kolkata, West Bengal',
    'Researcher in condensed matter physics. Still remember the physics experiments and stargazing nights in the school field.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    true,
    false
),
(
    '88888888-8888-8888-8888-888888888888',
    'Megha Chakraborty',
    'megha-chakraborty',
    'megha.c@example.com',
    '+91 98321 00007',
    true,
    true,
    2020,
    'Frontend Engineer & Community Mentor',
    'OpenWeb Collective',
    'Hyderabad, Telangana',
    'Batch of 2020. Navigating the tech world with the discipline and camaraderie built during our hostel life at JNV Nadia.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    true,
    false
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    slug = EXCLUDED.slug,
    email = EXCLUDED.email,
    contact_number = EXCLUDED.contact_number,
    is_email_public = EXCLUDED.is_email_public,
    is_phone_public = EXCLUDED.is_phone_public,
    passing_year = EXCLUDED.passing_year,
    current_position = EXCLUDED.current_position,
    company_or_institution = EXCLUDED.company_or_institution,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    profile_image_url = EXCLUDED.profile_image_url,
    is_active = EXCLUDED.is_active,
    is_featured = EXCLUDED.is_featured;

-- 2. Insert Story Sections
INSERT INTO public.story_sections (id, alumni_id, heading, content, display_order) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Life at JNV Nadia Campus',
    'Walking through the gates of JNV Nadia in Class 6 was one of the defining moments of my childhood. Living together in the dorms, the early morning physical training whistle, sharing afternoon meals in the mess hall, and the evening study prep created bonds that feel as strong today as they were a decade ago. We were not just classmates; we were family.',
    1
),
(
    'a1111111-1111-1111-1111-111111111112',
    '11111111-1111-1111-1111-111111111111',
    'The Spark for Technology',
    'Our computer lab with those CRT monitors and dial-up connectivity was my sanctuary. I remember writing my first HTML tags and QBasic programs during extra lab hours. The teachers always encouraged curiosity, regardless of how limited the resources were at the time.',
    2
),
(
    'a1111111-1111-1111-1111-111111111113',
    '11111111-1111-1111-1111-111111111111',
    'From Nadia to Building Production Systems',
    'After school, I pursued Computer Science and stepped into software engineering. Today, as a lead engineer designing distributed architectures and web applications, the problem-solving grit and adaptability I rely on daily were forged right here in our residential school environment.',
    3
),
(
    'a1111111-1111-1111-1111-111111111114',
    '11111111-1111-1111-1111-111111111111',
    'Why This Alumni Portal Matters',
    'This community website was built to make sure no JNV Nadia alumnus ever feels disconnected. Whether you graduated in 1995 or 2024, our shared identity is a lifelong superpower. Let us keep our stories alive!',
    4
),
(
    'a2222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'Dormitory Nights and Biology Classes',
    'I still remember staying up during late night prep exams in the study hall. Our biology teacher Mr. Mukherjee taught us that medicine is not just science, it is service. That lesson stayed in my heart throughout MBBS and MD at AIIMS.',
    1
),
(
    'a2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Message to Current Students',
    'To every young Navodayan currently studying in Nadia: dream without fear. Your humble background is your greatest strength, not a limitation.',
    2
),
(
    'a5555555-5555-5555-5555-555555555551',
    '55555555-5555-5555-5555-555555555555',
    'Rooted in Agriculture',
    'Coming from a farming family in Nadia district, my time at Navodaya opened global windows while grounding me in local realities. Now our agritech venture helps over 5,000 farmers in Bengal optimize their yield.',
    1
),
(
    'a8888888-8888-8888-8888-888888888881',
    '88888888-8888-8888-8888-888888888888',
    'Navigating New Horizons as the Class of 2020',
    'Passing out in 2020 right amidst global transitions taught our batch adaptability like nothing else. Navodaya prepared us for every curveball. Today as a frontend engineer in Hyderabad, the lessons of self-reliance, camaraderie, and evening prep discipline continue to guide my work every day.',
    1
),
(
    'a8888888-8888-8888-8888-888888888882',
    '88888888-8888-8888-8888-888888888888',
    'Hostel Evenings & Cultural Festivals',
    'From inter-house debate trophies to football tournaments on the campus field, our 2020 batch made lifelong memories under the evening sky of Nadia. Navodaya was truly a second home that shaped our character.',
    2
)
ON CONFLICT (id) DO UPDATE SET
    heading = EXCLUDED.heading,
    content = EXCLUDED.content,
    display_order = EXCLUDED.display_order;

-- 3. Sample Comments
INSERT INTO public.comments (alumni_id, visitor_name, comment_text, moderation_status, is_visible) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Rahul Das (Batch 2016)',
    'Proud of you Nishan! This platform looks so clean and nostalgic. Brings back all the hostel memories.',
    'approved',
    true
),
(
    '11111111-1111-1111-1111-111111111111',
    'Debabrata Biswas (Batch 2012)',
    'Brilliant initiative for JNV Nadia. We needed a dedicated home for our community instead of scattered WhatsApp groups.',
    'approved',
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'Sneha Paul (Batch 2015)',
    'So inspiring Arpita Di! Wishing you the best in your cardiology research.',
    'approved',
    true
);

-- 4. Sample Likes
INSERT INTO public.likes (alumni_id, visitor_identifier) VALUES
('11111111-1111-1111-1111-111111111111', 'demo-visitor-1'),
('11111111-1111-1111-1111-111111111111', 'demo-visitor-2'),
('11111111-1111-1111-1111-111111111111', 'demo-visitor-3'),
('22222222-2222-2222-2222-222222222222', 'demo-visitor-1'),
('33333333-3333-3333-3333-333333333333', 'demo-visitor-2'),
('55555555-5555-5555-5555-555555555555', 'demo-visitor-1'),
('88888888-8888-8888-8888-888888888888', 'demo-visitor-1')
ON CONFLICT DO NOTHING;
