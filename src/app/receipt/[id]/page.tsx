import * as React from 'react';
import { ReceiptPageContent } from '@/components/receipt-page-content';

// This configuration ensures this dynamic route does not require a server
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

// This is a Server Component that renders the client-side content.
export default function ReceiptPage({ params }: { params: { id: string } }) {
  return <ReceiptPageContent id={params.id} />;
}
