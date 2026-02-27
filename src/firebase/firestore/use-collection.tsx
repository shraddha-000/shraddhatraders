'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData, Timestamp } from 'firebase/firestore';

export interface Document extends DocumentData {
  id: string;
}

export function useCollection<T extends Document>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (query === null) {
      setData([]);
      setLoading(false);
      return;
    };
    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const docs: T[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          // Convert Firestore Timestamps to JS Dates for client-side use
          Object.keys(docData).forEach(key => {
            if (docData[key] instanceof Timestamp) {
              docData[key] = docData[key].toDate();
            }
          });
          docs.push({ id: doc.id, ...docData } as T);
        });
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { data, loading, error };
}
