-- ==============================================================================
-- JNV NADIA ALUMNI COMMUNITY PORTAL - SAMPLE SEED DATA
-- Realistic demo alumni, stories, likes, and comments
-- ==============================================================================

-- 1. Insert Sample Alumni
INSERT INTO public.alumni (
    id, full_name, slug, email, contact_number, passing_year, current_position, company_or_institution, location, bio, profile_image_url, is_active, is_featured
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Nishan Bhakta',
    'nishan-bhakta',
    'nishan.bhakta@example.com',
    '+91 98765 43210',
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
    2017,
    'Product Designer',
    'DesignCraft Studio',
    'Mumbai, Maharashtra',
    'Designing humane interfaces and storytelling experiences. Forever grateful for the art room and annual day stage back at school.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    true,
    false
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Story Sections for Nishan Bhakta
INSERT INTO public.story_sections (alumni_id, heading, content, display_order) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Life at JNV Nadia Campus',
    'Walking through the gates of JNV Nadia in Class 6 was one of the defining moments of my childhood. Living together in the dorms, the early morning physical training whistle, sharing afternoon meals in the mess hall, and the evening study prep created bonds that feel as strong today as they were a decade ago. We were not just classmates; we were family.',
    1
),
(
    '11111111-1111-1111-1111-111111111111',
    'The Spark for Technology',
    'Our computer lab with those CRT monitors and dial-up connectivity was my sanctuary. I remember writing my first HTML tags and QBasic programs during extra lab hours. The teachers always encouraged curiosity, regardless of how limited the resources were at the time.',
    2
),
(
    '11111111-1111-1111-1111-111111111111',
    'From Nadia to Building Production Systems',
    'After school, I pursued Computer Science and stepped into software engineering. Today, as a lead engineer designing distributed architectures and web applications, the problem-solving grit and adaptability I rely on daily were forged right here in our residential school environment.',
    3
),
(
    '11111111-1111-1111-1111-111111111111',
    'Why This Alumni Portal Matters',
    'This community website was built to make sure no JNV Nadia alumnus ever feels disconnected. Whether you graduated in 1995 or 2024, our shared identity is a lifelong superpower. Let us keep our stories alive!',
    4
);

-- Story Sections for Dr. Arpita Sarkar
INSERT INTO public.story_sections (alumni_id, heading, content, display_order) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    'Dormitory Nights and Biology Classes',
    'I still remember staying up during late night prep exams in the study hall. Our biology teacher Mr. Mukherjee taught us that medicine is not just science, it is service. That lesson stayed in my heart throughout MBBS and MD at AIIMS.',
    1
),
(
    '22222222-2222-2222-2222-222222222222',
    'Message to Current Students',
    'To every young Navodayan currently studying in Nadia: dream without fear. Your humble background is your greatest strength, not a limitation.',
    2
);

-- Story Sections for Subhankar Ghosh
INSERT INTO public.story_sections (alumni_id, heading, content, display_order) VALUES
(
    '55555555-5555-5555-5555-555555555555',
    'Rooted in Agriculture',
    'Coming from a farming family in Nadia district, my time at Navodaya opened global windows while grounding me in local realities. Now our agritech venture helps over 5,000 farmers in Bengal optimize their yield.',
    1
);

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
('55555555-5555-5555-5555-555555555555', 'demo-visitor-1')
ON CONFLICT DO NOTHING;
