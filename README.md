# JNV Nadia Alumni Community Portal

> **"Connected by memories. United by journeys."**  
> An official community platform for former students of **Jawahar Navodaya Vidyalaya, Nadia, West Bengal, India**.

![JNV Nadia Alumni Banner](/public/logo.svg)

---

## 🌟 Overview & Mission

**JNV Nadia Alumni** is a dedicated digital sanctuary for Navodayans who spent their formative years at Jawahar Navodaya Vidyalaya, Nadia. Unlike algorithmic social media platforms, this portal is an editorial-first community platform designed to:

- **Reconnect former students** across all graduating classes (from 1993 to the present).
- **Preserve residential school memories** — from dorm life in Aravali, Nilgiri, Shivalik, and Udaygiri houses to morning PT, dining hall banter, and the Class 9 migration experience.
- **Share career journeys** through an unlimited multi-chapter story editor.
- **Provide a searchable directory** of alumni across industries, research institutes, public services, and arts.

---

## 🎨 Design & Brand Identity

Inspired by the Indian national flag, the portal employs a minimal, sophisticated editorial aesthetic:
- **Saffron** (`#FF9933`): Warmth, community energy, and morning sun.
- **White** (`#FFFFFF`): Generous whitespace and clarity.
- **Green** (`#138808`): Growth, the lush Nadia campus landscape, and Navodaya roots.
- **Navy Accent** (`#0B2545`): Ashoka Chakra depth, editorial authority, and contrast.
- **Light Surface** (`#F8F9FA`): Eye-friendly background with subtle shadows.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18+ with Vite |
| **Language** | Modern JavaScript (ES Modules, JSX) |
| **Styling** | Tailwind CSS with custom typography & flag palette |
| **Backend & Database** | Supabase (PostgreSQL with Row Level Security) |
| **Authentication** | Supabase Auth (Email & Password, Argon2/Bcrypt hash) |
| **Media Storage** | Supabase Storage (`profile-photos` bucket) |
| **Icons** | Lucide React |
| **Client Routing** | React Router v6 |
| **Deployment** | Vercel (Configured with `vercel.json` SPA rewrites) |

---

## 📐 Homepage Structure (Sections 1 to 8)

The homepage follows the exact structured layout specified:

1. **Header**: Emblem logo, "JNV Nadia Alumni", tagline *"Connected by memories. United by journeys."*, navigation links (*Home, Alumni, Share Your Story, About*), and collapsible mobile menu.
2. **Recent Stories**: 4–6 latest alumni story cards sorted chronologically with profile pictures, passing batch, current position, and preview.
3. **Recent Batch Stories**: Stories grouped by passing-out year (e.g. Batch of 2014, 2015, 2016, 2018) displaying total registered alumni in that batch and links to browse the batch.
4. **Discover Our Alumni**: Weighted random spotlight algorithm combining completeness, views, likes, story availability, recency, and randomness — preventing session repetition and spamming.
5. **Our Alumni Preview**: Compact card preview of registered alumni with a prominent "See All Alumni" button linking to `/alumni`.
6. **Share Your Story**: Call-to-action inviting alumni to create their profile and share their journey.
7. **Feedback Form**: Category-based suggestion and bug report form (`Website suggestion`, `Technical issue`, `Content correction`, `General feedback`) with honeypot spam protection.
8. **Footer**: Quick navigation links, feedback shortcut, copyright, and clickable credit:
   `Designed and developed by Nishan Bhakta` linking dynamically to `/alumni/nishan-bhakta`.

---

## 📂 Project Directory Structure

```text
jnv-nadia-alumni/
├── index.html                   # HTML entry point with metadata & Google Fonts
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Saffron, Green, & Navy palette extensions
├── vite.config.js               # Vite compilation configuration
├── vercel.json                  # Production SPA redirect rules & caching headers
├── .env.example                 # Template for Supabase credentials
├── supabase/
│   ├── schema.sql               # PostgreSQL tables, indexes, triggers, and RLS policies
│   ├── seed.sql                 # Sample alumni, stories, likes, and comments
│   └── storage.sql              # Supabase storage bucket policies for profile-photos
├── public/
│   ├── favicon.svg              # Navodaya lamp & flame vector favicon
│   ├── logo.svg                 # JNV Nadia Alumni insignia badge
│   ├── robots.txt               # SEO indexing directives
│   └── sitemap.xml              # SEO search engine sitemap
└── src/
    ├── main.jsx                 # React root DOM rendering
    ├── App.jsx                  # Main router and layout wrapper
    ├── index.css                # Base Tailwind directives and custom scrollbars
    ├── lib/
    │   ├── supabase.js          # Supabase client singleton & configuration check
    │   └── visitor.js           # Anonymous visitor UUID & session tracking
    ├── contexts/
    │   └── AuthContext.jsx      # Authentication state, session handling, user profile
    ├── services/
    │   ├── alumniService.js     # Directory queries, search, weighted selection, slug resolution
    │   ├── storyService.js      # Custom story section CRUD & reordering
    │   ├── socialService.js     # Likes, comments moderation, and view throttling
    │   ├── feedbackService.js   # User feedback submission & validation
    │   ├── adminService.js      # Admin metrics, alumni moderation, comment approval
    │   ├── storageService.js    # Client-side image compression & photo upload
    │   └── mockData.js          # Graceful interactive local layer before DB connection
    ├── components/
    │   ├── common/              # Navbar, Footer, Logo, Seo, Alert, SupabaseSetupBanner
    │   ├── home/                # HeroBanner, RecentStories, BatchStories, FeaturedAlumni, etc.
    │   ├── profile/             # ProfileHeader, LikeButton, CommentSection
    │   └── admin/               # Admin metrics, moderation tables
    └── pages/
        ├── HomePage.jsx             # / (8 homepage sections)
        ├── AlumniDirectoryPage.jsx  # /alumni (Searchable table, filters, pagination)
        ├── AlumniProfilePage.jsx    # /alumni/:slug (Story chapters, likes, comments)
        ├── RegisterPage.jsx         # /register (Private DOB, profile creation)
        ├── LoginPage.jsx            # /login (Email & password with demo shortcuts)
        ├── ProfileEditPage.jsx      # /profile/edit (Multi-section story editor)
        ├── AccountSettingsPage.jsx  # /settings (Password change & security)
        ├── AdminDashboardPage.jsx   # /admin (Protected moderation suite)
        ├── AboutPage.jsx            # /about (History, Houses, Migration scheme)
        └── NotFoundPage.jsx         # 404 handler
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm**

### 2. Installation
```bash
git clone https://github.com/your-username/jnv-nadia-alumni.git
cd jnv-nadia-alumni
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> **💡 Zero-Friction Preview:** If you have not created your Supabase project yet, the portal will launch in **Interactive Local Preview Mode** with persistent realistic sample data (featuring alumni like **Nishan Bhakta**, **Dr. Arpita Sarkar**, **Sourav Ganguly Roy**, and more). You can test liking, commenting, reordering story sections, searching, and admin moderation immediately!

---

## 🗄️ Supabase Backend Setup

When you are ready to connect your production PostgreSQL database:

### 1. Create a Project on Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **Anon / Public Key** from `Project Settings -> API`.

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
VITE_DEVELOPER_SLUG=nishan-bhakta
```

### 3. Run Database Migrations
In the Supabase SQL Editor, run the following scripts in order:
1. `supabase/schema.sql` (Creates tables, triggers, indexes, and Row Level Security policies).
2. `supabase/storage.sql` (Creates the `profile-photos` storage bucket and access rules).
3. `supabase/seed.sql` (Optional: Populates initial sample alumni and story chapters).

### 4. Create the First Administrator Account
To ensure strong security, normal registration cannot grant admin privileges:
1. Register an account on the website via `/register` (e.g. `admin@jnvnadia.org`).
2. In Supabase Dashboard -> **Authentication** -> **Users**, copy the `User UID`.
3. In Supabase **SQL Editor**, execute:
   ```sql
   INSERT INTO public.administrators (auth_user_id, role)
   VALUES ('<COPIED_USER_UID>', 'admin');
   ```
4. Log into `/admin` to access the full moderation suite!

---

## 🛡️ Security & Privacy Architecture

- **Private Date of Birth**: The `date_of_birth` column is private and excluded from the `public_alumni` view. It is accessible only by the alumnus themselves or verified administrators.
- **Row Level Security (RLS)**: Enforced across all tables. Anonymous visitors can only read active alumni and approved comments.
- **Spam Traps**: Hidden honeypot inputs and URL-flooding heuristics filter out automated bot submissions on comment and feedback forms.
- **View Deduplication**: Profile views are throttled to prevent spamming via repeated page refreshes.
- **Client-Side Image Optimization**: Photographs are resized and compressed via HTML5 Canvas before uploading to conserve bandwidth and guarantee instant page loading.

---

## ☁️ Deployment on Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your GitHub repository.
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_DEVELOPER_SLUG` (`nishan-bhakta`)
4. Click **Deploy**. The included `vercel.json` handles Single Page App rewrites seamlessly.

---

## 📜 Credits & License

- **Developer & Architect**: Nishan Bhakta ([View Profile](/alumni/nishan-bhakta))
- **Dedicated To**: The teachers, staff, and alumni family of Jawahar Navodaya Vidyalaya, Nadia, West Bengal.
- **License**: MIT
