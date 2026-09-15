import { Gift, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOYALTY_CONFIG } from "@/lib/loyalty-config";

export function StampGrid({ stamps }: { stamps: number }) {
  const slots = Array.from({ length: LOYALTY_CONFIG.goal }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-3">
      {slots.map((n) => {
        const filled = n <= stamps;
        const isReward = n === LOYALTY_CONFIG.midRewardAt || n === LOYALTY_CONFIG.goal;
        return (
          <div
            key={n}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-border text-sm font-bold",
              isReward && !filled && "border-accent bg-accent/15",
              filled &&
                "stamp-pop border-solid border-primary bg-primary text-primary-foreground shadow-[var(--shadow-pop)]",
            )}
          >
            {filled ? (
              isReward ? (
                <Gift className="h-6 w-6" />
              ) : (
                <Star className="h-6 w-6 fill-current" />
              )
            ) : isReward ? (
              <Gift className="h-5 w-5 text-accent-foreground/70" />
            ) : (
              <span className="text-muted-foreground">{n}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
