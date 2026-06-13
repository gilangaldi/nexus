CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION private.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(UUID, public.app_role) TO service_role;

DROP POLICY IF EXISTS "Admins can view all assets" ON public.assets;
DROP POLICY IF EXISTS "Sellers update own assets" ON public.assets;
DROP POLICY IF EXISTS "Sellers delete own assets" ON public.assets;
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;

CREATE POLICY "Admins can view all assets"
ON public.assets
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers update own assets"
ON public.assets
FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id OR private.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = seller_id OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers delete own assets"
ON public.assets
FOR DELETE
TO authenticated
USING (auth.uid() = seller_id OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR private.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated, service_role;