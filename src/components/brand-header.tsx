import { Link } from "@tanstack/react-router";
import logo from "@/assets/shet-burger-logo.jpeg.asset.json";

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <Link to="/" className="shrink-0">
          <img
            src={logo.url}
            alt="Logo de SHET BURGER"
            className="h-11 w-11 rounded-2xl object-cover shadow-[var(--shadow-pop)]"
          />
        </Link>
        <div className="min-w-0">
          <p className="font-display text-lg leading-tight font-extrabold text-primary">
            SHET BURGER
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {subtitle ?? "Tarjeta de fidelidad"}
          </p>
        </div>
      </div>
    </header>
  );
}
