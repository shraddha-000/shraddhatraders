'use client';

// This page is deprecated and has been replaced by /receipt?id=...
// The generateStaticParams function is added to prevent this dynamic route
// from requiring a server function, which is incompatible with the Firebase Spark plan.

export async function generateStaticParams() {
  // Return an empty array to ensure no pages are generated for this route at build time.
  return [];
}

export default function DeprecatedReceiptPage() {
  if (typeof window !== 'undefined') {
    const params = window.location.pathname.split('/');
    const id = params[params.length - 1];
    window.location.replace(`/receipt?id=${id}`);
  }
  return null;
}
