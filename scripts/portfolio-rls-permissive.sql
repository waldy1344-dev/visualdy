-- Versi policy yang lebih longgar untuk tabel portfolio
-- Jalankan di Supabase SQL Editor

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio_allow_all_select" ON public.portfolio;
CREATE POLICY "portfolio_allow_all_select"
  ON public.portfolio
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "portfolio_allow_all_insert" ON public.portfolio;
CREATE POLICY "portfolio_allow_all_insert"
  ON public.portfolio
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_allow_all_update" ON public.portfolio;
CREATE POLICY "portfolio_allow_all_update"
  ON public.portfolio
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_allow_all_delete" ON public.portfolio;
CREATE POLICY "portfolio_allow_all_delete"
  ON public.portfolio
  FOR DELETE
  USING (true);
