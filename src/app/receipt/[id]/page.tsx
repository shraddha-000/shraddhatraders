// This page is deprecated and has been replaced by /receipt?id=...
// The configuration below ensures this dynamic route does not require a server
// function, which is incompatible with the Firebase Spark plan.

// By returning an empty array, we tell Next.js not to pre-render any pages
// for this dynamic route at build time.
export async function generateStaticParams() {
  return [];
}

// By setting dynamicParams to false, we tell Next.js to return a 404 page
// for any path that was not generated at build time. This prevents on-demand
// server-side rendering (the "fallback") and the need for a Cloud Function.
export const dynamicParams = false;

// The component itself returns null, as it should never be rendered.
export default function DeprecatedReceiptPage() {
  return null;
}
