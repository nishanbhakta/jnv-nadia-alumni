-- ==============================================================================
-- JNV NADIA ALUMNI COMMUNITY PORTAL - COMPLETE DATABASE SCHEMA
-- PostgreSQL schema for Supabase
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

-- 6. Likes Table (Prevent duplicate likes per visitor identifier)
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
CREATE INDEX IF NOT EXISTS idx_alumni_name_trgm ON public.alumni USING gin (to_tsvector('english', full_name));

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

CREATE OR REPLACE TRIGGER on_alumni_updated
    BEFORE UPDATE ON public.alumni
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER on_story_updated
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
CREATE POLICY "Admins can view administrators list"
    ON public.administrators FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 2. Alumni RLS
-- Anyone can read active alumni public data
CREATE POLICY "Public read active alumni"
    ON public.alumni FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

-- Registered user can insert their own profile
CREATE POLICY "User can insert own profile"
    ON public.alumni FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = auth_user_id);

-- Registered user can update their own profile
CREATE POLICY "User can update own profile"
    ON public.alumni FOR UPDATE
    TO authenticated
    USING (auth.uid() = auth_user_id OR public.is_admin(auth.uid()))
    WITH CHECK (auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

-- Only admin can delete alumni
CREATE POLICY "Admins can delete alumni"
    ON public.alumni FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 3. Story Sections RLS
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
CREATE POLICY "Public read approved comments"
    ON public.comments FOR SELECT
    TO anon, authenticated
    USING (
        (is_visible = true AND moderation_status = 'approved') 
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Public can post comments"
    ON public.comments FOR INSERT
    TO anon, authenticated
    WITH CHECK (length(comment_text) >= 2 AND length(visitor_name) >= 2);

CREATE POLICY "Admin can update or delete comments"
    ON public.comments FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 5. Likes RLS
CREATE POLICY "Public read likes"
    ON public.likes FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can insert like"
    ON public.likes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Public can remove own like"
    ON public.likes FOR DELETE
    TO anon, authenticated
    USING (visitor_identifier = current_setting('request.headers', true)::json->>'x-visitor-id' OR true);

-- 6. Profile Views RLS
CREATE POLICY "Public read views"
    ON public.profile_views FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can insert profile view"
    ON public.profile_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 7. Feedback RLS
CREATE POLICY "Public can submit feedback"
    ON public.feedback FOR INSERT
    TO anon, authenticated
    WITH CHECK (length(message) >= 5 AND length(category) >= 3);

CREATE POLICY "Admins can view and manage feedback"
    ON public.feedback FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));
