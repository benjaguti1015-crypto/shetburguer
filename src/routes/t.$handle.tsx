import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ArrowLeft, Check, Gift, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandHeader } from "@/components/brand-header";
import { StampGrid } from "@/components/stamp-grid";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LOYALTY_CONFIG, TERMS_TEXT } from "@/lib/loyalty-config";
import { PausedBanner } from "./index";

export const Route = createFileRoute("/t/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `Tarjeta de @${params.handle} | SHET BURGER` },
      {
        name: "description",
        content: "Mirá tus sellos acumulados y tu código QR de SHET BURGER.",
      },
      { property: "og:title", content: `Tarjeta de @${params.handle} | SHET BURGER` },
      {
        property: "og:description",
        content: "Tarjeta de fidelidad digital de SHET BURGER.",
      },
    ],
  }),
  component: Tarjeta,
});

function Tarjeta() {
  const { handle } = Route.useParams();
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("instagram", handle)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (!customer?.code) return;
    QRCode.toDataURL(`SHET:${customer.code}`, {
      width: 480,
      margin: 1,
      color: { dark: "#9d174d", light: "#ffffff" },
    }).then(setQr);
  }, [customer?.code]);

  const compartir = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mi tarjeta SHET BURGER", url });
        return;
      } catch {
        /* cancelado */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <BrandHeader subtitle="Cargando tarjeta..." />
        <p className="p-8 text-center text-sm text-muted-foreground">Un segundito...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen">
        <BrandHeader />
        <main className="mx-auto max-w-md space-y-4 px-4 py-10 text-center">
          <h1 className="text-2xl font-extrabold text-primary">Tarjeta no encontrada</h1>
          <p className="text-sm text-muted-foreground">
            No existe una tarjeta con el usuario @{handle}.
          </p>
          <Button asChild className="h-12 w-full rounded-2xl font-bold">
            <Link to="/registro">Crear mi tarjeta</Link>
          </Button>
        </main>
      </div>
    );
  }

  const faltan = Math.max(0, LOYALTY_CONFIG.goal - customer.stamps);
  const completa = customer.stamps >= LOYALTY_CONFIG.goal;

  return (
    <div className="min-h-screen">
      <BrandHeader subtitle={`@${customer.instagram}`} />
      <main className="mx-auto max-w-md space-y-5 px-4 pt-6 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Inicio
        </Link>

        <PausedBanner />

        <section className="space-y-4 rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-pop)]">
          <div className="text-center">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Tarjeta de fidelidad
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-primary">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-sm text-muted-foreground">@{customer.instagram}</p>
          </div>

          <StampGrid stamps={customer.stamps} />

          <div className="rounded-2xl bg-secondary p-4 text-center text-sm font-semibold text-secondary-foreground">
            {completa ? (
              <span className="inline-flex items-center gap-2">
                <Gift className="h-5 w-5" /> ¡Tarjeta completa! Canjeá{" "}
                {LOYALTY_CONFIG.finalRewardText}
              </span>
            ) : (
              <>
                Tenés <b>{customer.stamps}</b> sellos. Te faltan <b>{faltan}</b> para{" "}
                {LOYALTY_CONFIG.finalRewardText}.
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-accent/50 bg-accent/15 p-3 text-center font-semibold">
              Sello {LOYALTY_CONFIG.midRewardAt}
              <br />
              {LOYALTY_CONFIG.midRewardText}
            </div>
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3 text-center font-semibold">
              Sello {LOYALTY_CONFIG.goal}
              <br />
              {LOYALTY_CONFIG.finalRewardText}
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-[2rem] border border-border bg-card p-5 text-center shadow-[var(--shadow-pop)]">
          <h2 className="text-lg font-extrabold text-primary">Tu código QR</h2>
          <p className="text-xs text-muted-foreground">
            Mostralo en la caja para sumar tu sello.
          </p>
          {qr && (
            <img
              src={qr}
              alt="Código QR de la tarjeta"
              className="mx-auto h-56 w-56 rounded-2xl border border-border bg-white p-2"
            />
          )}
          <Button
            onClick={compartir}
            variant="secondary"
            className="h-12 w-full rounded-2xl font-bold"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-5 w-5" /> ¡Enlace copiado!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" /> Compartir o guardar mi tarjeta
              </>
            )}
          </Button>
        </section>

        <Accordion
          type="single"
          collapsible
          className="rounded-[2rem] border border-border bg-card px-5 shadow-[var(--shadow-pop)]"
        >
          <AccordionItem value="tyc" className="border-none">
            <AccordionTrigger className="font-display font-bold">
              Términos y condiciones
            </AccordionTrigger>
            <AccordionContent className="text-xs whitespace-pre-line text-muted-foreground">
              {TERMS_TEXT}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
