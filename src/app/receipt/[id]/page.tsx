'use client';

// This page is deprecated and has been replaced by /receipt?id=...
// The generateStaticParams function is added to prevent this dynamic route
// from requiring a server function, which is incompatible with the Firebase Spark plan.

export async function generateStaticParams() {
  // Return an empty array to ensure no pages are generated for this route at build time.
  return [];
}

// By returning null, Next.js will render a 404 page for any path that would match this dynamic segment.
// This effectively disables the route at build time, satisfying static export requirements.
export default function DeprecatedReceiptPage() {
  // The redirect logic has been removed as it was part of a client component.
  // This component now correctly works with generateStaticParams to produce no static pages.
  return null;
}
