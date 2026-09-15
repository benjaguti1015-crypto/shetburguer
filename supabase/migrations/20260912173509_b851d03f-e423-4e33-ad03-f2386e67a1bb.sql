CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  instagram TEXT NOT NULL UNIQUE,
  stamps INTEGER NOT NULL DEFAULT 0,
  mid_reward_claimed BOOLEAN NOT NULL DEFAULT false,
  final_rewards_claimed INTEGER NOT NULL DEFAULT 0,
  code TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.customers TO anon;
GRANT SELECT, INSERT ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Anyone can register" ON public.customers FOR INSERT WITH CHECK (true);

CREATE TABLE public.store_settings (
  id INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
  stamps_enabled BOOLEAN NOT NULL DEFAULT true,
  paused_message TEXT NOT NULL DEFAULT 'Por el momento la acumulación de sellos está pausada por falta de stock. ¡Volvemos pronto!',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT store_settings_single_row CHECK (id = 1)
);

GRANT SELECT ON public.store_settings TO anon;
GRANT SELECT ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view store settings" ON public.store_settings FOR SELECT USING (true);

INSERT INTO public.store_settings (id) VALUES (1);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER store_settings_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();