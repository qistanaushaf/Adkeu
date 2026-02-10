
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

export const getSupabase = () => {
  const url = localStorage.getItem('himahi_db_url');
  const key = localStorage.getItem('himahi_db_key');

  if (!url || !key) return null;

  try {
    return createClient(url, key);
  } catch (e) {
    console.error("Gagal inisialisasi Supabase:", e);
    return null;
  }
};

export const isServerConfigured = () => {
  return !!(localStorage.getItem('himahi_db_url') && localStorage.getItem('himahi_db_key'));
};
