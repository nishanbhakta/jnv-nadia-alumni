import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validate image file format and size
 */
export function validateImageFile(file) {
  if (!file) {
    throw new Error('Please select an image file.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error('Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds the 5MB limit. Please choose a smaller image.');
  }

  return true;
}

/**
 * Resize and compress image using HTML5 Canvas
 * Output: JPEG Blob optimized to max width/height of 800px
 */
export function compressImage(file, maxWidth = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas image compression failed.'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for compression.'));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
  });
}

/**
 * Upload profile photograph to Supabase Storage or generate data URL
 */
export async function uploadProfilePhoto(file, userId = 'guest') {
  validateImageFile(file);

  const compressedBlob = await compressImage(file);
  const fileExt = 'jpg';
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, compressedBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (e) {
      console.warn('Supabase storage upload failed, falling back to data URL:', e);
    }
  }

  // Fallback: convert compressed blob to data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(compressedBlob);
  });
}
