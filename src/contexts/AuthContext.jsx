import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { verifyAdminStatus } from '../services/adminService';
import { getUniqueSlug } from '../services/alumniService';
import { mockDb } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
            const adminStatus = await verifyAdminStatus(session.user);
            setIsAdmin(adminStatus);
          }
        } catch (e) {
          console.warn('Auth initialization error:', e);
        }
      } else {
        // Mock session restoration from localStorage
        const storedUser = localStorage.getItem('jnv_mock_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            const alumni = mockDb.getAlumni().find(a => a.email === parsed.email || a.id === parsed.id);
            setProfile(alumni || null);
            setIsAdmin(parsed.email?.toLowerCase().includes('admin') || localStorage.getItem('jnv_demo_admin_active') === 'true');
          } catch (e) {
            localStorage.removeItem('jnv_mock_user');
          }
        }
      }

      if (mounted) setLoading(false);
    }

    initializeAuth();

    // Listen to Supabase auth state changes
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          const adminStatus = await verifyAdminStatus(session.user);
          setIsAdmin(adminStatus);
        } else {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription?.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  async function fetchUserProfile(authUserId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('alumni')
          .select('*')
          .eq('auth_user_id', authUserId)
          .maybeSingle();

        if (!error && data) {
          setProfile(data);
          return data;
        }
      } catch (e) {
        console.warn('Failed to fetch user alumni profile:', e);
      }
    }
    return null;
  }

  /**
   * Register a new alumnus
   */
  async function register({
    fullName,
    email,
    password,
    dateOfBirth,
    contactNumber,
    passingYear,
    currentPosition,
    companyOrInstitution = '',
    location = '',
    bio = '',
    jnvStory = '',
    profileImageUrl = '',
    isEmailPublic = true,
    isPhonePublic = false,
  }) {
    if (isSupabaseConfigured()) {
      // 1. Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;

      const authUser = authData.user;
      if (!authUser) throw new Error('Sign up failed. Please try again.');

      // 2. Generate unique slug
      const slug = await getUniqueSlug(fullName);

      // 3. Create alumni profile record
      const { data: newProfile, error: profileError } = await supabase
        .from('alumni')
        .insert({
          auth_user_id: authUser.id,
          full_name: fullName.trim(),
          slug,
          email: email.trim().toLowerCase(),
          date_of_birth: dateOfBirth || null, // Stored safely, never publicly selected
          contact_number: contactNumber || null,
          is_email_public: Boolean(isEmailPublic),
          is_phone_public: Boolean(isPhonePublic),
          passing_year: parseInt(passingYear, 10),
          current_position: currentPosition || '',
          company_or_institution: companyOrInstitution || '',
          location: location || '',
          bio: bio || '',
          profile_image_url: profileImageUrl || null,
          is_active: true,
          is_featured: false,
        })
        .select()
        .single();

      if (profileError) {
        console.error('Failed to create alumni row:', profileError);
        throw profileError;
      }

      setUser(authUser);
      setProfile(newProfile);

      if (jnvStory.trim()) {
        const { error: storyError } = await supabase
          .from('story_sections')
          .insert({
            alumni_id: newProfile.id,
            heading: 'My JNV Life',
            content: jnvStory.trim(),
            display_order: 0,
          });

        if (storyError) {
          console.error('Failed to save registration story:', storyError);
          throw storyError;
        }
      }

      return { user: authUser, profile: newProfile };
    }

    // Mock registration for instant preview
    const slug = await getUniqueSlug(fullName);
    const mockUser = {
      id: `u-mock-${Date.now()}`,
      email: email.trim().toLowerCase(),
    };

    const newProfile = {
      id: `a-mock-${Date.now()}`,
      auth_user_id: mockUser.id,
      full_name: fullName.trim(),
      slug,
      email: email.trim().toLowerCase(),
      date_of_birth: dateOfBirth || null,
      contact_number: contactNumber || null,
      is_email_public: Boolean(isEmailPublic),
      is_phone_public: Boolean(isPhonePublic),
      passing_year: parseInt(passingYear, 10),
      current_position: currentPosition || '',
      company_or_institution: companyOrInstitution || '',
      location: location || '',
      bio: bio || '',
      profile_image_url: profileImageUrl || null,
      is_active: true,
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const alumni = mockDb.getAlumni();
    mockDb.setAlumni([newProfile, ...alumni]);

    localStorage.setItem('jnv_mock_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setProfile(newProfile);

    if (jnvStory.trim()) {
      const stories = mockDb.getStories();
      mockDb.setStories([
        {
          id: `s-mock-${Date.now()}`,
          alumni_id: newProfile.id,
          heading: 'My JNV Life',
          content: jnvStory.trim(),
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...stories,
      ]);
    }

    return { user: mockUser, profile: newProfile };
  }

  /**
   * Log in existing alumnus
   */
  async function login(email, password) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUser(data.user);
      const userProfile = await fetchUserProfile(data.user.id);
      const adminStatus = await verifyAdminStatus(data.user);
      setIsAdmin(adminStatus);
      return { user: data.user, profile: userProfile };
    }

    // Mock Login: check if user exists or log in as demo admin / demo alumnus
    const alumniList = mockDb.getAlumni();
    const existing = alumniList.find(a => a.email.toLowerCase() === email.trim().toLowerCase());

    const isDemoAdminLogin = email.toLowerCase().includes('admin');
    const mockUser = {
      id: existing ? existing.id : 'u-mock-admin',
      email: email.trim().toLowerCase(),
    };

    if (isDemoAdminLogin) {
      localStorage.setItem('jnv_demo_admin_active', 'true');
      setIsAdmin(true);
    } else {
      localStorage.removeItem('jnv_demo_admin_active');
      setIsAdmin(false);
    }

    localStorage.setItem('jnv_mock_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setProfile(existing || null);

    return { user: mockUser, profile: existing || null };
  }

  /**
   * Log out
   */
  async function logout() {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('jnv_mock_user');
    localStorage.removeItem('jnv_demo_admin_active');
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  }

  /**
   * Update Profile Details
   */
  async function updateProfile(updates) {
    if (!profile) throw new Error('No profile found to update.');

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('alumni')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    }

    const alumni = mockDb.getAlumni();
    const index = alumni.findIndex(a => a.id === profile.id);
    if (index >= 0) {
      const updated = {
        ...alumni[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      alumni[index] = updated;
      mockDb.setAlumni(alumni);
      setProfile(updated);
      return updated;
    }
  }

  /**
   * Change password via Supabase Auth
   */
  async function updatePassword(newPassword) {
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return true;
    }

    // Mock password update
    return true;
  }

  // Quick switch to demo Admin mode for review/testing
  function toggleDemoAdmin(enable = true) {
    if (enable) {
      localStorage.setItem('jnv_demo_admin_active', 'true');
      setIsAdmin(true);
    } else {
      localStorage.removeItem('jnv_demo_admin_active');
      setIsAdmin(false);
    }
  }

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    toggleDemoAdmin,
    refreshProfile: () => user && fetchUserProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
