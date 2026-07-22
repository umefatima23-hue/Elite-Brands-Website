import { cn } from "@/lib/utils";

/**
 * Placeholder product image — elegant gradient tile keyed to the product hue.
 * Swap for real <img> tags backed by the storage CDN when Cloud is enabled.
 */
export function ProductImage({
  hue,
  label,
  className,
  aspect = "aspect-[3/4]",
}: {
  hue: number;
  label: string;
  className?: string;
  aspect?: string;
}) {
  const bg = `linear-gradient(135deg, oklch(0.9 0.06 ${hue}) 0%, oklch(0.75 0.09 ${hue + 20}) 55%, oklch(0.55 0.11 ${hue + 40}) 100%)`;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        aspect,
        className,
      )}
      style={{ backgroundImage: bg }}
      aria-label={label}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">
        {label}
      </div>
    </div>
  );
}
