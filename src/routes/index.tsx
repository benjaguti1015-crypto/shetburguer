import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, Search, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandHeader } from "@/components/brand-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOYALTY_CONFIG } from "@/lib/loyalty-config";
import logo from "@/assets/shet-burger-logo.jpeg.asset.json";
import { normalizeHandle } from "@/lib/handle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHET BURGER | Tarjeta de fidelidad digital" },
      {
        name: "description",
        content:
          "Buscá tu tarjeta con tu usuario de Instagram, sumá sellos en SHET BURGER y ganá premios.",
      },
      { property: "og:title", content: "SHET BURGER | Tarjeta de fidelidad digital" },
      {
        property: "og:description",
        content: "Sumá sellos en cada compra y ganá premios en SHET BURGER.",
      },
    ],
  }),
  component: Index,
});

export function useStoreSettings() {
  return useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("stamps_enabled, paused_message")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    refetchInterval: 20000,
  });
}

export function PausedBanner() {
  const { data } = useStoreSettings();
  if (!data || data.stamps_enabled) return null;
  return (
    <div className="flex items-start gap-3 rounded-3xl border-2 border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <p>{data.paused_message}</p>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeHandle(handle);
    if (!clean) {
      setError("Escribí tu usuario de Instagram");
      return;
    }
    setLoading(true);
    setError(null);
    const { data } = await supabase
      .from("customers")
      .select("instagram")
      .eq("instagram", clean)
      .maybeSingle();
    setLoading(false);
    if (!data) {
      setError("No encontramos esa tarjeta. ¿Querés registrarte?");
      return;
    }
    navigate({ to: "/t/$handle", params: { handle: clean } });
  };

  return (
    <div className="min-h-screen">
      <BrandHeader />
      <main className="mx-auto max-w-md space-y-6 px-4 pt-8 pb-16">
        <div className="text-center">
          <img
            src={logo.url}
            alt="Logo de SHET BURGER"
            className="mx-auto h-36 w-36 rounded-[2rem] object-cover shadow-[var(--shadow-pop)]"
          />
          <h1 className="mt-5 text-3xl font-extrabold text-primary">
            Tu tarjeta de fidelidad
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sumá {LOYALTY_CONFIG.goal} sellos y ganate {LOYALTY_CONFIG.finalRewardText}.
            En el sello {LOYALTY_CONFIG.midRewardAt}: {LOYALTY_CONFIG.midRewardText}.
          </p>
        </div>

        <PausedBanner />

        <form
          onSubmit={buscar}
          className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-pop)]"
        >
          <label htmlFor="handle" className="font-display text-base font-bold">
            Buscar mi tarjeta
          </label>
          <Input
            id="handle"
            value={handle}
            onChange={(e) => {
              setHandle(e.target.value);
              setError(null);
            }}
            placeholder="@tuusuario"
            autoCapitalize="none"
            className="h-12 rounded-2xl text-base"
          />
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl text-base font-bold"
          >
            <Search className="mr-2 h-5 w-5" />
            {loading ? "Buscando..." : "Ver mis sellos"}
          </Button>
        </form>

        <div className="rounded-3xl border-2 border-dashed border-primary/40 bg-card/70 p-5 text-center">
          <p className="text-sm text-muted-foreground">¿Es tu primera vez?</p>
          <Button
            asChild
            variant="secondary"
            className="mt-3 h-12 w-full rounded-2xl text-base font-bold"
          >
            <Link to="/registro">
              <Sparkles className="mr-2 h-5 w-5" />
              Crear mi tarjeta
            </Link>
          </Button>
        </div>

        <div className="pt-4 text-center">
          <Link
            to="/admin"
            className="text-xs font-semibold text-muted-foreground underline underline-offset-4"
          >
            Panel del local
          </Link>
        </div>
      </main>
    </div>
  );
}
