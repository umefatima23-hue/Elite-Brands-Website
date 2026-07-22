-- Pin search_path on all new functions
ALTER FUNCTION public.products_reserve_sku_trg()          SET search_path = public;
ALTER FUNCTION public.product_variants_reserve_sku_trg()  SET search_path = public;
ALTER FUNCTION public.enforce_sku_immutable()             SET search_path = public;

-- Trigger-only functions: no user should ever call them directly.
REVOKE ALL ON FUNCTION public.products_reserve_sku_trg()          FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.product_variants_reserve_sku_trg()  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_sku_immutable()             FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.orphan_sku_on_delete()              FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.products_reserve_sku_trg()          TO service_role;
GRANT EXECUTE ON FUNCTION public.product_variants_reserve_sku_trg()  TO service_role;
GRANT EXECUTE ON FUNCTION public.enforce_sku_immutable()             TO service_role;
GRANT EXECUTE ON FUNCTION public.orphan_sku_on_delete()              TO service_role;

-- reserve_sku() is called by triggers running as the invoker; authenticated must retain EXECUTE.
-- (Already set in the prior migration; explicit no-op here for auditability.)