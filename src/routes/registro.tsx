import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandHeader } from "@/components/brand-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeHandle } from "@/lib/handle";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Crear mi tarjeta | SHET BURGER" },
      {
        name: "description",
        content:
          "Registrate con tu nombre y usuario de Instagram para empezar a sumar sellos en SHET BURGER.",
      },
      { property: "og:title", content: "Crear mi tarjeta | SHET BURGER" },
      {
        property: "og:description",
        content: "Registro rápido: nombre, apellido y usuario de Instagram.",
      },
    ],
  }),
  component: Registro,
});

function Registro() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeHandle(handle);
    if (!firstName.trim() || !lastName.trim() || !clean) {
      setError("Completá los tres datos para crear tu tarjeta");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: insertError } = await supabase.from("customers").insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      instagram: clean,
    });
    setLoading(false);
    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "Ese usuario ya tiene tarjeta. Buscala desde el inicio."
          : "No pudimos crear la tarjeta. Probá de nuevo.",
      );
      return;
    }
    navigate({ to: "/t/$handle", params: { handle: clean } });
  };

  return (
    <div className="min-h-screen">
      <BrandHeader subtitle="Registro" />
      <main className="mx-auto max-w-md space-y-5 px-4 pt-6 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>

        <div>
          <h1 className="text-2xl font-extrabold text-primary">Creá tu tarjeta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Solo necesitamos tres datos. Sin teléfono, sin vueltas.
          </p>
        </div>

        <form
          onSubmit={registrar}
          className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-pop)]"
        >
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="text-sm font-bold">
              Nombre
            </label>
            <Input
              id="nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12 rounded-2xl text-base"
              placeholder="Camila"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="apellido" className="text-sm font-bold">
              Apellido
            </label>
            <Input
              id="apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12 rounded-2xl text-base"
              placeholder="Gómez"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ig" className="text-sm font-bold">
              Usuario de Instagram
            </label>
            <Input
              id="ig"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              autoCapitalize="none"
              className="h-12 rounded-2xl text-base"
              placeholder="@camigomez"
            />
          </div>
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl text-base font-bold"
          >
            <PartyPopper className="mr-2 h-5 w-5" />
            {loading ? "Creando..." : "Crear mi tarjeta"}
          </Button>
        </form>
      </main>
    </div>
  );
}
