
DROP POLICY IF EXISTS "el_authenticated_insert" ON public.error_logs;
CREATE POLICY "el_authenticated_insert" ON public.error_logs FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid() OR public.is_staff(auth.uid()));
