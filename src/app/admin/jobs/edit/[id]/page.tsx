'use client';

import EditJobClient from './EditJobClient';

// Renamed to Page to follow Next.js App Router conventions
export default function Page({ params }: { params: { id: string } }) {
  return <EditJobClient id={params.id} />;
} 

// Remove the generateMetadata function that's causing issues
// The metadata will be set by the client component 