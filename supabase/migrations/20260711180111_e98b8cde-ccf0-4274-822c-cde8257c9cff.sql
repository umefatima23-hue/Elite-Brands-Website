
-- Fix: SECURITY DEFINER view -> use security_invoker
DROP VIEW IF EXISTS public.v_low_stock;
CREATE VIEW public.v_low_stock
WITH (security_invoker = true) AS
SELECT
  i.id            AS inventory_id,
  i.variant_id,
  i.warehouse_id,
  pv.sku,
  pv.name         AS variant_name,
  p.id            AS product_id,
  p.name          AS product_name,
  i.on_hand_qty,
  i.reserved_qty,
  i.available_qty,
  i.reorder_point,
  i.low_stock_threshold,
  CASE
    WHEN i.available_qty <= 0 THEN 'out_of_stock'
    WHEN i.available_qty <= i.low_stock_threshold THEN 'low'
    WHEN i.available_qty <= i.reorder_point THEN 'reorder'
    ELSE 'healthy'
  END AS stock_state,
  i.last_movement_at
FROM public.inventory i
JOIN public.product_variants pv ON pv.id = i.variant_id
JOIN public.products p ON p.id = pv.product_id;

GRANT SELECT ON public.v_low_stock TO authenticated;
GRANT SELECT ON public.v_low_stock TO service_role;

-- Fix: lock down trigger-only SECURITY DEFINER function
REVOKE ALL ON FUNCTION public.inventory_ledger_immutable() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.inventory_ledger_immutable() FROM authenticated;
REVOKE ALL ON FUNCTION public.inventory_ledger_immutable() FROM anon;
