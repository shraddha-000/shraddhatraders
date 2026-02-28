'use client';

// This page is deprecated and has been replaced by /receipt?id=...
// This file is intentionally left blank to prevent deployment errors on the Spark plan.
export default function DeprecatedReceiptPage() {
  if (typeof window !== 'undefined') {
    const params = window.location.pathname.split('/');
    const id = params[params.length - 1];
    window.location.replace(`/receipt?id=${id}`);
  }
  return null;
}
