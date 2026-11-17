// ==============================================================================
// REALISTIC MOCK DATA LAYER FOR JNV NADIA ALUMNI COMMUNITY
// Allows fully functional demonstration before Supabase project credentials are input.
// Changes persist to localStorage during preview.
// ==============================================================================

const STORAGE_KEYS = {
  ALUMNI: 'jnv_mock_alumni_data',
  STORIES: 'jnv_mock_stories_data',
  COMMENTS: 'jnv_mock_comments_data',
  LIKES: 'jnv_mock_likes_data',
  VIEWS: 'jnv_mock_views_data',
  FEEDBACK: 'jnv_mock_feedback_data',
};

const INITIAL_ALUMNI = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Nishan Bhakta',
    slug: 'nishan-bhakta',
    email: 'nishan.bhakta@example.com',
    contact_number: '+91 98765 43210',
    date_of_birth: '1998-05-14',
    passing_year: 2016,
    current_position: 'Lead Software Engineer & Cloud Architect',
    company_or_institution: 'Tech Innovation Labs',
    location: 'Bengaluru, India',
    bio: 'Alumnus of JNV Nadia (Batch 2016). Passionate about distributed systems, modern web platforms, and open-source civic technology.',
    profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-10T14:30:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    full_name: 'Dr. Arpita Sarkar',
    slug: 'arpita-sarkar',
    email: 'arpita.sarkar@example.com',
    contact_number: '+91 98321 00001',
    date_of_birth: '1996-09-22',
    passing_year: 2014,
    current_position: 'Senior Resident Doctor (Cardiology)',
    company_or_institution: 'AIIMS New Delhi',
    location: 'New Delhi, India',
    bio: 'Navodaya taught me resilience and empathy. Today I work on cardiovascular clinical research and rural patient care initiatives.',
    profile_image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: true,
    created_at: '2024-01-18T11:20:00Z',
    updated_at: '2024-01-20T16:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    full_name: 'Sourav Ganguly Roy',
    slug: 'sourav-roy',
    email: 'sourav.roy@example.com',
    contact_number: '+91 98321 00002',
    date_of_birth: '1997-03-11',
    passing_year: 2015,
    current_position: 'Assistant Commissioner (IRS)',
    company_or_institution: 'Ministry of Finance, Govt of India',
    location: 'Kolkata, West Bengal',
    bio: 'Proud alumnus of JNV Nadia. The multi-cultural Navodaya environment shaped my civil service journey and public leadership ethos.',
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: true,
    created_at: '2024-01-22T09:15:00Z',
    updated_at: '2024-01-25T12:00:00Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    full_name: 'Priyanka Majumder',
    slug: 'priyanka-majumder',
    email: 'priyanka.m@example.com',
    contact_number: '+91 98321 00003',
    date_of_birth: '2000-11-04',
    passing_year: 2018,
    current_position: 'AI & Machine Learning Research Scholar',
    company_or_institution: 'Indian Institute of Science (IISc)',
    location: 'Bengaluru, Karnataka',
    bio: 'Working on natural language understanding for Indic languages. Cherishing memories of early morning PT and library debates.',
    profile_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: false,
    created_at: '2024-02-01T14:45:00Z',
    updated_at: '2024-02-03T09:30:00Z',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    full_name: 'Subhankar Ghosh',
    slug: 'subhankar-ghosh',
    email: 'subhankar.g@example.com',
    contact_number: '+91 98321 00004',
    date_of_birth: '1998-08-19',
    passing_year: 2016,
    current_position: 'Agritech Co-Founder & Director',
    company_or_institution: 'Gramin Agro Innovations',
    location: 'Nadia, West Bengal',
    bio: 'Empowering local smallholders in Bengal with precision drip irrigation and soil testing. JNV instilled true connection to rural roots.',
    profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: true,
    created_at: '2024-02-05T16:00:00Z',
    updated_at: '2024-02-06T18:10:00Z',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    full_name: 'Ananya Sen',
    slug: 'ananya-sen',
    email: 'ananya.sen@example.com',
    contact_number: '+91 98321 00005',
    date_of_birth: '1999-04-12',
    passing_year: 2017,
    current_position: 'Product Designer & Visual Artist',
    company_or_institution: 'DesignCraft Studio',
    location: 'Mumbai, Maharashtra',
    bio: 'Designing humane interfaces and storytelling experiences. Forever grateful for the art room and annual day stage back at school.',
    profile_image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: false,
    created_at: '2024-02-12T08:30:00Z',
    updated_at: '2024-02-12T08:30:00Z',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    full_name: 'Debabrata Biswas',
    slug: 'debabrata-biswas',
    email: 'debabrata.b@example.com',
    contact_number: '+91 98321 00006',
    date_of_birth: '1994-01-25',
    passing_year: 2012,
    current_position: 'Assistant Professor of Physics',
    company_or_institution: 'Presidency University',
    location: 'Kolkata, West Bengal',
    bio: 'Condensed matter physics researcher. Still remember solving optics problems under streetlamps during campus power outages.',
    profile_image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: false,
    created_at: '2024-02-15T12:00:00Z',
    updated_at: '2024-02-15T12:00:00Z',
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    full_name: 'Megha Chakraborty',
    slug: 'megha-chakraborty',
    email: 'megha.c@example.com',
    contact_number: '+91 98321 00007',
    date_of_birth: '2002-07-30',
    passing_year: 2020,
    current_position: 'Frontend Engineer & Community Mentor',
    company_or_institution: 'OpenWeb Collective',
    location: 'Hyderabad, Telangana',
    bio: 'Batch of 2020. Navigating the tech world with the discipline and camaraderie built during our hostel life at JNV Nadia.',
    profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    is_featured: false,
    created_at: '2024-02-20T10:15:00Z',
    updated_at: '2024-02-20T10:15:00Z',
  }
];

const INITIAL_STORIES = [
  {
    id: 's-1',
    alumni_id: '11111111-1111-1111-1111-111111111111',
    heading: 'Life at JNV Nadia Campus',
    content: 'Walking through the gates of JNV Nadia in Class 6 was one of the defining moments of my childhood. Living together in the dorms, the early morning physical training whistle, sharing afternoon meals in the mess hall, and the evening study prep created bonds that feel as strong today as they were a decade ago. We were not just classmates; we were family.',
    display_order: 1,
    created_at: '2024-01-16T10:00:00Z',
  },
  {
    id: 's-2',
    alumni_id: '11111111-1111-1111-1111-111111111111',
    heading: 'The Spark for Technology',
    content: 'Our computer lab with those CRT monitors and dial-up connectivity was my sanctuary. I remember writing my first HTML tags and QBasic programs during extra lab hours. The teachers always encouraged curiosity, regardless of how limited the resources were at the time.',
    display_order: 2,
    created_at: '2024-01-16T11:00:00Z',
  },
  {
    id: 's-3',
    alumni_id: '11111111-1111-1111-1111-111111111111',
    heading: 'From Nadia to Building Production Systems',
    content: 'After school, I pursued Computer Science and stepped into software engineering. Today, as a lead engineer designing distributed architectures and web applications, the problem-solving grit and adaptability I rely on daily were forged right here in our residential school environment.',
    display_order: 3,
    created_at: '2024-01-16T12:00:00Z',
  },
  {
    id: 's-4',
    alumni_id: '11111111-1111-1111-1111-111111111111',
    heading: 'Why This Alumni Portal Matters',
    content: 'This community website was built to make sure no JNV Nadia alumnus ever feels disconnected. Whether you graduated in 1995 or 2024, our shared identity is a lifelong superpower. Let us keep our stories alive!',
    display_order: 4,
    created_at: '2024-01-16T13:00:00Z',
  },
  {
    id: 's-5',
    alumni_id: '22222222-2222-2222-2222-222222222222',
    heading: 'Dormitory Nights and Biology Classes',
    content: 'I still remember staying up during late night prep exams in the study hall. Our biology teacher Mr. Mukherjee taught us that medicine is not just science, it is service. That lesson stayed in my heart throughout MBBS and MD at AIIMS.',
    display_order: 1,
    created_at: '2024-01-19T10:00:00Z',
  },
  {
    id: 's-6',
    alumni_id: '22222222-2222-2222-2222-222222222222',
    heading: 'Message to Current Students',
    content: 'To every young Navodayan currently studying in Nadia: dream without fear. Your humble background is your greatest strength, not a limitation.',
    display_order: 2,
    created_at: '2024-01-19T11:00:00Z',
  },
  {
    id: 's-7',
    alumni_id: '33333333-3333-3333-3333-333333333333',
    heading: 'The Navodaya Ethos and Civil Services',
    content: 'JNV is a microcosm of India. Living with batchmates from different backgrounds instilled in me a deep appreciation for public duty. Preparing for UPSC was tough, but the mental endurance developed during Navodaya hostel days gave me the quiet strength to keep going.',
    display_order: 1,
    created_at: '2024-01-23T15:00:00Z',
  },
  {
    id: 's-8',
    alumni_id: '55555555-5555-5555-5555-555555555555',
    heading: 'Rooted in Agriculture',
    content: 'Coming from a farming family in Nadia district, my time at Navodaya opened global windows while grounding me in local realities. Now our agritech venture helps over 5,000 farmers in Bengal optimize their yield.',
    display_order: 1,
    created_at: '2024-02-06T10:00:00Z',
  },
  {
    id: 's-9',
    alumni_id: '44444444-4444-4444-4444-444444444444',
    heading: 'From Mathematics Competitions to IISc',
    content: 'Our inter-house math quizzes during morning assembly ignited my love for research. Navodaya teaches you to think on your feet. Today at IISc, I build neural architectures that understand rural Indian languages.',
    display_order: 1,
    created_at: '2024-02-02T16:00:00Z',
  },
  {
    id: 's-10',
    alumni_id: '66666666-6666-6666-6666-666666666666',
    heading: 'The Power of Creativity at School',
    content: 'People often think Navodaya is only about academics and sports, but the art room under Mr. Sen was a sanctuary. Today as a designer, those colors and stories still guide my aesthetic philosophy.',
    display_order: 1,
    created_at: '2024-02-12T11:00:00Z',
  }
];

const INITIAL_COMMENTS = [
  {
    id: 'c-1',
    alumni_id: '11111111-1111-1111-1111-111111111111',
    visitor_name: 'Rahul Das (Batch 2016)',
    comment_text: 'Proud of you Nishan! This platform looks so clean and nostalgic. Brings back all the hostel memories.',
    is_visible: true,
    moderation_status: 'approved',
    created_at: '2024-02-11T12:00:00Z',
  },
  {
    id: 'c-2',
    alumni_id: '11111111-1111-1111-1111-111111111111',
    visitor_name: 'Debabrata Biswas (Batch 2012)',
    comment_text: 'Brilliant initiative for JNV Nadia. We needed a dedicated home for our community instead of scattered WhatsApp groups.',
    is_visible: true,
    moderation_status: 'approved',
    created_at: '2024-02-12T14:30:00Z',
  },
  {
    id: 'c-3',
    alumni_id: '22222222-2222-2222-2222-222222222222',
    visitor_name: 'Sneha Paul (Batch 2015)',
    comment_text: 'So inspiring Arpita Di! Wishing you the best in your cardiology research.',
    is_visible: true,
    moderation_status: 'approved',
    created_at: '2024-01-25T10:15:00Z',
  }
];

const INITIAL_LIKES = [
  { id: 'l-1', alumni_id: '11111111-1111-1111-1111-111111111111', visitor_identifier: 'init-1', created_at: '2024-02-01T10:00:00Z' },
  { id: 'l-2', alumni_id: '11111111-1111-1111-1111-111111111111', visitor_identifier: 'init-2', created_at: '2024-02-02T11:00:00Z' },
  { id: 'l-3', alumni_id: '11111111-1111-1111-1111-111111111111', visitor_identifier: 'init-3', created_at: '2024-02-03T12:00:00Z' },
  { id: 'l-4', alumni_id: '22222222-2222-2222-2222-222222222222', visitor_identifier: 'init-1', created_at: '2024-02-04T10:00:00Z' },
  { id: 'l-5', alumni_id: '33333333-3333-3333-3333-333333333333', visitor_identifier: 'init-2', created_at: '2024-02-05T14:00:00Z' },
  { id: 'l-6', alumni_id: '55555555-5555-5555-5555-555555555555', visitor_identifier: 'init-3', created_at: '2024-02-06T15:00:00Z' }
];

const INITIAL_VIEWS = [
  { id: 'v-1', alumni_id: '11111111-1111-1111-1111-111111111111', visitor_identifier: 'init-1', viewed_at: '2024-02-01T10:00:00Z' },
  { id: 'v-2', alumni_id: '11111111-1111-1111-1111-111111111111', visitor_identifier: 'init-2', viewed_at: '2024-02-02T11:00:00Z' },
  { id: 'v-3', alumni_id: '22222222-2222-2222-2222-222222222222', visitor_identifier: 'init-1', viewed_at: '2024-02-03T12:00:00Z' }
];

const INITIAL_FEEDBACK = [
  {
    id: 'f-1',
    name: 'Amitava Roy',
    email: 'amitava.roy@example.com',
    category: 'Website suggestion',
    message: 'Love the portal! It would be wonderful if we could also organize an annual reunion date poll here in the future.',
    status: 'new',
    created_at: '2024-02-18T10:00:00Z',
  }
];

// Helper functions for reading/writing persistent mock collections
function getCollection(key, initial) {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return initial;
  }
}

function setCollection(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save mock data for ${key}`, e);
  }
}

export const mockDb = {
  getAlumni: () => getCollection(STORAGE_KEYS.ALUMNI, INITIAL_ALUMNI),
  setAlumni: (data) => setCollection(STORAGE_KEYS.ALUMNI, data),

  getStories: () => getCollection(STORAGE_KEYS.STORIES, INITIAL_STORIES),
  setStories: (data) => setCollection(STORAGE_KEYS.STORIES, data),

  getComments: () => getCollection(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS),
  setComments: (data) => setCollection(STORAGE_KEYS.COMMENTS, data),

  getLikes: () => getCollection(STORAGE_KEYS.LIKES, INITIAL_LIKES),
  setLikes: (data) => setCollection(STORAGE_KEYS.LIKES, data),

  getViews: () => getCollection(STORAGE_KEYS.VIEWS, INITIAL_VIEWS),
  setViews: (data) => setCollection(STORAGE_KEYS.VIEWS, data),

  getFeedback: () => getCollection(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK),
  setFeedback: (data) => setCollection(STORAGE_KEYS.FEEDBACK, data),

  resetToDefault: () => {
    localStorage.removeItem(STORAGE_KEYS.ALUMNI);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.LIKES);
    localStorage.removeItem(STORAGE_KEYS.VIEWS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
  }
};
