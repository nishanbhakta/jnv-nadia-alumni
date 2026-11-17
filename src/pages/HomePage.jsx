import React from 'react';
import Seo from '../components/common/Seo';
import HeroBanner from '../components/home/HeroBanner';
import RecentStories from '../components/home/RecentStories';
import BatchStories from '../components/home/BatchStories';
import FeaturedAlumni from '../components/home/FeaturedAlumni';
import AlumniPreview from '../components/home/AlumniPreview';
import ShareStoryCta from '../components/home/ShareStoryCta';
import FeedbackForm from '../components/home/FeedbackForm';

export default function HomePage() {
  return (
    <>
      <Seo
        title="JNV Nadia Alumni | Connected by memories. United by journeys."
        description="Official alumni portal of Jawahar Navodaya Vidyalaya, Nadia, West Bengal. Discover recent stories, reconnect with batchmates, and share your personal journey."
      />

      {/* SECTION 1: HEADER & HERO BANNER */}
      <HeroBanner />

      {/* SECTION 2: RECENT STORIES */}
      <RecentStories />

      {/* SECTION 3: RECENT BATCH STORIES */}
      <BatchStories />

      {/* SECTION 4: FEATURED ALUMNI */}
      <FeaturedAlumni />

      {/* SECTION 5: ALUMNI DIRECTORY PREVIEW */}
      <AlumniPreview />

      {/* SECTION 6: SHARE YOUR STORY */}
      <ShareStoryCta />

      {/* SECTION 7: FEEDBACK FORM */}
      <FeedbackForm />

      {/* SECTION 8 (FOOTER) is rendered in main App layout */}
    </>
  );
}
