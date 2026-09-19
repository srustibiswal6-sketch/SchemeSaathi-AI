import { useState, useEffect, useCallback } from 'react';
import { getSchemes } from '../services/api';

export function useSchemes(profile) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSchemes(profile);
      setSchemes(data || []);
    } catch (err) {
      setError('Unable to load schemes. Please try again.');
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSchemes(profile)
      .then((data) => { if (!cancelled) { setSchemes(data || []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setLoading(false); setError('Unable to load schemes.'); } });
    return () => { cancelled = true; };
  }, [profile]);

  return { schemes, loading, error, refetch: fetchSchemes };
}
