-- Jalankan query ini di Supabase SQL Editor untuk melihat struktur tabel portfolio
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'portfolio'
ORDER BY ordinal_position;
