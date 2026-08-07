import { Badge, type BadgeProps } from "@/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatusValue, PaymentStatusValue } from "@/lib/admin-orders";

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  draft: "Draft",
  pending: "Pending",
  confirmed: "Confirmed",
  packing: "Packing",
  ready_to_dispatch: "Ready to Dispatch",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatusValue, string> = {
  unpaid: "Unpaid",
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  cod_pending: "COD Pending",
  partially_paid: "Partially Paid",
};

const ORDER_STATUS_CLASSES: Record<OrderStatusValue, string> = {
  draft: "border-border bg-muted text-muted-foreground",
  pending: "border-gold/40 bg-gold-soft/40 text-gold-deep",
  confirmed: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  packing: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  ready_to_dispatch: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  dispatched: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  delivered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
  returned: "border-destructive/30 bg-destructive/10 text-destructive",
  refunded: "border-border bg-muted text-muted-foreground",
};

const PAYMENT_STATUS_CLASSES: Record<PaymentStatusValue, string> = {
  unpaid: "border-destructive/30 bg-destructive/10 text-destructive",
  pending: "border-gold/40 bg-gold-soft/40 text-gold-deep",
  paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  failed: "border-destructive/30 bg-destructive/10 text-destructive",
  refunded: "border-border bg-muted text-muted-foreground",
  cod_pending: "border-gold/40 bg-gold-soft/40 text-gold-deep",
  partially_paid: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export function OrderStatusBadge({
  status,
  className,
  ...props
}: { status: OrderStatusValue } & Omit<BadgeProps, "variant">) {
  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap", ORDER_STATUS_CLASSES[status], className)}
      {...props}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
  className,
  ...props
}: { status: PaymentStatusValue } & Omit<BadgeProps, "variant">) {
  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap", PAYMENT_STATUS_CLASSES[status], className)}
      {...props}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
