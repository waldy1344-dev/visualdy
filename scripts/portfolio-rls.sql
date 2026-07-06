-- Jalankan skrip ini di SQL Editor Supabase untuk mengatasi error RLS saat menyimpan portfolio

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio_public_select" ON public.portfolio;
CREATE POLICY "portfolio_public_select"
  ON public.portfolio
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "portfolio_authenticated_insert" ON public.portfolio;
CREATE POLICY "portfolio_authenticated_insert"
  ON public.portfolio
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_authenticated_update" ON public.portfolio;
CREATE POLICY "portfolio_authenticated_update"
  ON public.portfolio
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_authenticated_delete" ON public.portfolio;
CREATE POLICY "portfolio_authenticated_delete"
  ON public.portfolio
  FOR DELETE
  TO authenticated
  USING (true);
