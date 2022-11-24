import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../Firebase';

let cache: { [key: string]: any } = {};

export const useUserInfo = (userIds: string[]) => {
  const [data, setData] = useState<DocumentSnapshot<DocumentData>[] | null>(
    userIds.every((id) => cache[id]) ? userIds.map((id) => cache[id]) : null
  );
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        const response = await Promise.all(
          userIds.map(async (id) => {
            if (cache[id]) return cache[id];
            const res = await getDoc(doc(db, 'users', id));
            cache[id] = res;
            return res;
          })
        );

        setData(response);
        setLoading(false);
        setError(false);
      })();
    } catch (error) {
      console.log(error);
      setData(null);
      setLoading(false);
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userIds)]);

  return { data, loading, error };
};
