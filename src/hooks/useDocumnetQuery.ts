import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

let cache: { [key: string]: any } = {};

export const useDocumentQuery = (
  key: string,
  document: DocumentReference<DocumentData>
) => {
  const [data, setData] = useState<DocumentSnapshot<DocumentData> | null>(
    cache[key] || null
  );

  const [loading, setLoading] = useState(!Boolean(data));
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      document,
      (snapshot) => {
        setData(snapshot);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setData(null);
        setLoading(false);
        setError(true);
      }
    );

    return () => {
      unsubcribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { loading, error, data };
};
