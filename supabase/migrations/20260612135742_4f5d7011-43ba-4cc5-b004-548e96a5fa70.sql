GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

DROP POLICY IF EXISTS "Approved assets are public" ON public.assets;
DROP POLICY IF EXISTS "Sellers update own assets" ON public.assets;
DROP POLICY IF EXISTS "Sellers delete own assets" ON public.assets;
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;

CREATE POLICY "Approved assets are public"
ON public.assets
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Sellers can view own assets"
ON public.assets
FOR SELECT
TO authenticated
USING (seller_id = auth.uid());

CREATE POLICY "Admins can view all assets"
ON public.assets
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers update own assets"
ON public.assets
FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers delete own assets"
ON public.assets
FOR DELETE
TO authenticated
USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));