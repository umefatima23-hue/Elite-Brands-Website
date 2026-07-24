import { type LucideIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  hint?: string;
}) {
  const positive = trend === "up";
  return (
    <Card className="relative overflow-hidden border-border/60 bg-card shadow-luxe">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-gold opacity-70" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </CardTitle>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-soft/40 ring-1 ring-gold/40">
          <Icon className="h-4 w-4 text-gold-deep" aria-hidden />
        </span>
      </CardHeader>
      <CardContent>
        <div className="font-serif text-3xl text-foreground">{value}</div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                positive
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {delta}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

type Status =
  | "paid"
  | "pending"
  | "refunded"
  | "cancelled"
  | "shipped"
  | "delivered"
  | "draft"
  | "published"
  | "active"
  | "expired"
  | "low";

const statusStyles: Record<Status, string> = {
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  shipped: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
  pending: "bg-gold-soft/40 text-gold-deep border-gold/40",
  draft: "bg-muted text-muted-foreground border-border",
  refunded: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  expired: "bg-destructive/10 text-destructive border-destructive/30",
  low: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        statusStyles[status],
      )}
    >
      {status}
    </Badge>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/60 bg-card shadow-luxe", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <CardTitle className="font-serif text-xl text-foreground">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gold-soft/30 ring-1 ring-gold/40">
        <Icon className="h-7 w-7 text-gold" aria-hidden />
      </div>
      <h3 className="mt-5 font-serif text-xl text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="grid items-center gap-4 border-b border-border px-4 py-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function ChartPlaceholder({ height = 260, label }: { height?: number; label?: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-secondary to-background"
      style={{ height }}
      aria-label={label ?? "Chart placeholder"}
      role="img"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="g-gold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,150 C40,120 60,140 90,110 C130,70 160,130 200,100 C240,70 280,90 320,60 C350,40 380,55 400,45 L400,200 L0,200 Z"
          fill="url(#g-gold)"
        />
        <path
          d="M0,150 C40,120 60,140 90,110 C130,70 160,130 200,100 C240,70 280,90 320,60 C350,40 380,55 400,45"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-between px-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
      </div>
    </div>
  );
}
