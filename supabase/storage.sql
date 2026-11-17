-- ==============================================================================
-- SUPABASE STORAGE CONFIGURATION FOR JNV NADIA ALUMNI
-- ==============================================================================

-- 1. Create Storage Bucket for Profile Photos
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

-- 2. Storage Policies for 'profile-photos'
-- Public read access to all profile photos
CREATE POLICY "Public profile photos read"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'profile-photos');

-- Authenticated users can upload their own profile pictures
CREATE POLICY "Authenticated users can upload profile photo"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'profile-photos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can update/replace their own profile pictures
CREATE POLICY "Users can update own profile photo"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'profile-photos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can delete their own profile pictures
CREATE POLICY "Users can delete own profile photo"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'profile-photos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
