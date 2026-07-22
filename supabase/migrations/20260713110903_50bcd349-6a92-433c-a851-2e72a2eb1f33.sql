
CREATE OR REPLACE FUNCTION public.cms_in_window(_start TIMESTAMPTZ, _end TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
SET search_path = public
AS $$
  SELECT (_start IS NULL OR _start <= now())
     AND (_end   IS NULL OR _end   >= now())
$$;
