import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Gift,
  Lock,
  Minus,
  PartyPopper,
  Plus,
  Trash2,
} from "lucide-react";
import { BrandHeader } from "@/components/brand-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LOYALTY_CONFIG } from "@/lib/loyalty-config";
import {
  adjustStamps,
  adminLogin,
  deleteCustomer,
  listCustomers,
  redeemFinal,
  setStock,
} from "@/lib/loyalty.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel del local | SHET BURGER" },
      {
        name: "description",
        content: "Panel de control de sellos, stock y clientes de SHET BURGER.",
      },
      { property: "og:title", content: "Panel del local | SHET BURGER" },
      {
        property: "og:description",
        content: "Control de sellos, stock y clientes de SHET BURGER.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  instagram: string;
  stamps: number;
  code: string;
  final_rewards_claimed: number;
};

const STORAGE_KEY = "shet-admin-pass";

function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stockOn, setStockOn] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const login = useServerFn(adminLogin);
  const load = useServerFn(listCustomers);
  const adjust = useServerFn(adjustStamps);
  const redeem = useServerFn(redeemFinal);
  const remove = useServerFn(deleteCustomer);
  const toggleStock = useServerFn(setStock);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = async (pass: string) => {
    const rows = (await load({ data: { password: pass } })) as Customer[];
    setCustomers(rows);
    const { data } = await supabase
      .from("store_settings")
      .select("stamps_enabled")
      .eq("id", 1)
      .maybeSingle();
    setStockOn(data?.stamps_enabled ?? true);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    login({ data: { password: saved } }).then((r) => {
      if (r.ok) {
        setPassword(saved);
        setAuthed(true);
        refresh(saved);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await login({ data: { password } });
    if (!r.ok) {
      setLoginError("Clave incorrecta");
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, password);
    setAuthed(true);
    setLoginError(null);
    await refresh(password);
  };

  const changeStamps = async (customerId: string, delta: number) => {
    try {
      const updated = (await adjust({
        data: { password, customerId, delta },
      })) as Customer;
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      if (delta > 0) {
        flash(
          updated.stamps >= LOYALTY_CONFIG.goal
            ? `🎉 ¡${updated.first_name} completó la tarjeta!`
            : updated.stamps === LOYALTY_CONFIG.midRewardAt
              ? `🎁 ¡${updated.first_name} ganó ${LOYALTY_CONFIG.midRewardText}!`
              : `✨ Sello sumado a @${updated.instagram} (${updated.stamps}/${LOYALTY_CONFIG.goal})`,
        );
      }
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
  };

  const scanCode = async (raw: string) => {
    const code = raw.replace(/^SHET:/, "").trim();
    try {
      const updated = (await adjust({ data: { password, code, delta: 1 } })) as Customer;
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      flash(
        `🍔 ¡Sello para ${updated.first_name}! ${updated.stamps}/${LOYALTY_CONFIG.goal}` +
          (updated.stamps >= LOYALTY_CONFIG.goal ? " — ¡Tarjeta completa!" : ""),
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "QR no válido");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen">
        <BrandHeader subtitle="Panel del local" />
        <main className="mx-auto max-w-md space-y-5 px-4 pt-10">
          <form
            onSubmit={handleLogin}
            className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-pop)]"
          >
            <h1 className="flex items-center gap-2 text-xl font-extrabold text-primary">
              <Lock className="h-5 w-5" /> Acceso al panel
            </h1>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clave"
              className="h-12 rounded-2xl text-base"
            />
            {loginError && (
              <p className="text-sm font-semibold text-destructive">{loginError}</p>
            )}
            <Button type="submit" className="h-12 w-full rounded-2xl font-bold">
              Entrar
            </Button>
          </form>
          <div className="text-center">
            <Link to="/" className="text-sm font-semibold text-muted-foreground">
              Volver al inicio
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const filtered = customers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.instagram}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <BrandHeader subtitle="Panel del local" />
      <main className="mx-auto max-w-md space-y-5 px-4 pt-6 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Inicio
        </Link>

        <section className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-pop)]">
          <div>
            <p className="font-display text-base font-bold">Acumulación de sellos</p>
            <p className="text-xs text-muted-foreground">
              {stockOn
                ? "Encendida: se pueden sumar sellos"
                : "Pausada: los clientes ven el aviso"}
            </p>
          </div>
          <Switch
            checked={stockOn}
            onCheckedChange={async (v) => {
              setStockOn(v);
              try {
                await toggleStock({ data: { password, enabled: v } });
                flash(v ? "Sellos habilitados" : "Sellos pausados por falta de stock");
              } catch {
                setStockOn(!v);
                flash("No se pudo cambiar el estado");
              }
            }}
          />
        </section>

        <section className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-pop)]">
          <div className="flex items-center justify-between">
            <p className="font-display text-base font-bold">Escanear QR del cliente</p>
            <Button
              size="sm"
              variant={scanning ? "secondary" : "default"}
              className="rounded-xl font-bold"
              onClick={() => setScanning((s) => !s)}
            >
              {scanning ? (
                <>
                  <CameraOff className="mr-1 h-4 w-4" /> Cerrar
                </>
              ) : (
                <>
                  <Camera className="mr-1 h-4 w-4" /> Abrir cámara
                </>
              )}
            </Button>
          </div>
          {scanning && <QrScanner onScan={scanCode} />}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-primary">
              Clientes ({customers.length})
            </h2>
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o Instagram"
            className="h-11 rounded-2xl"
          />
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-pop)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{c.instagram} · {c.final_rewards_claimed} premios canjeados
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full"
                    onClick={() => changeStamps(c.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-display text-lg font-extrabold text-primary">
                    {c.stamps}/{LOYALTY_CONFIG.goal}
                  </span>
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => changeStamps(c.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {c.stamps >= LOYALTY_CONFIG.goal && (
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl font-bold"
                    onClick={async () => {
                      const updated = (await redeem({
                        data: { password, customerId: c.id },
                      })) as Customer;
                      setCustomers((prev) =>
                        prev.map((x) => (x.id === updated.id ? updated : x)),
                      );
                      flash(`🎉 Premio entregado a ${updated.first_name}`);
                    }}
                  >
                    <Gift className="mr-1 h-4 w-4" /> Canjear premio y reiniciar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl text-destructive"
                  onClick={async () => {
                    if (!confirm(`¿Borrar la tarjeta de @${c.instagram}?`)) return;
                    await remove({ data: { password, customerId: c.id } });
                    setCustomers((prev) => prev.filter((x) => x.id !== c.id));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Todavía no hay clientes registrados.
            </p>
          )}
        </section>
      </main>

      {toast && (
        <div className="fixed inset-x-0 bottom-5 z-50 mx-auto flex max-w-md items-center gap-2 rounded-3xl bg-primary px-5 py-4 text-center font-display font-bold text-primary-foreground shadow-[var(--shadow-pop)]">
          <PartyPopper className="h-5 w-5 shrink-0" />
          <span className="flex-1">{toast}</span>
        </div>
      )}
    </div>
  );
}

function QrScanner({ onScan }: { onScan: (text: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const lastRef = useRef<{ text: string; at: number }>({ text: "", at: 0 });

  useEffect(() => {
    let scanner: { stop: () => Promise<void>; clear: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const instance = new Html5Qrcode("qr-reader");
        scanner = instance as unknown as typeof scanner;
        await instance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (text: string) => {
            const now = Date.now();
            if (lastRef.current.text === text && now - lastRef.current.at < 4000) return;
            lastRef.current = { text, at: now };
            onScan(text);
          },
          () => {},
        );
        if (cancelled) await instance.stop();
      } catch {
        setError("No pudimos abrir la cámara. Revisá los permisos del navegador.");
      }
    })();

    return () => {
      cancelled = true;
      scanner?.stop().then(() => scanner?.clear()).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div id="qr-reader" className="overflow-hidden rounded-2xl border border-border" />
      {error && <p className="mt-2 text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}
