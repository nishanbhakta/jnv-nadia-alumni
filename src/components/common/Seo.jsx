import { useEffect } from 'react';

export default function Seo({
  title = 'JNV Nadia Alumni | Connected by memories. United by journeys.',
  description = 'Official community portal for former students of Jawahar Navodaya Vidyalaya, Nadia, West Bengal. Reconnect, share memories, and discover alumni journeys.',
  image = '/logo.svg',
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);
  }, [title, description, image]);

  return null;
}
