'use client';

import EditBlogPostClient from './EditBlogPostClient';

// Renamed to BlogPageParams to avoid conflicts with Next.js internal types
export default function Page({ params }: { params: { id: string } }) {
  return <EditBlogPostClient id={params.id} />;
}

// Remove the generateMetadata function that's causing issues
// The metadata will be set by the client component 