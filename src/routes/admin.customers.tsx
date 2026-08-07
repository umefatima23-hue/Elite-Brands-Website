import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { formatPrice } from "@/lib/format";
import {
  listCustomersAdmin,
  getCustomerStats,
  deleteCustomer,
  restoreCustomer,
  CUSTOMER_STATUSES,
  type AdminCustomerListItem,
  type CustomerStats,
  type CustomerStatus,
} from "@/lib/admin-customers";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomersPage,
});

const PAGE_SIZE = 20;
const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  blocked: "Blocked",
  archived: "Archived",
};

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: AdminCustomerListItem[]; total: number };

type StatsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: CustomerStats };

function AdminCustomersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [stats, setStats] = useState<StatsState>({ status: "loading" });
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    getCustomerStats().then((result) => {
      if (cancelled) return;
      setStats(
        result.success
          ? { status: "ready", data: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    listCustomersAdmin({
      search,
      status,
      includeDeleted: showDeleted,
      page,
      pageSize: PAGE_SIZE,
    }).then((result) => {
      if (cancelled) return;
      setState(
        result.success
          ? { status: "ready", items: result.data.items, total: result.data.total }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [search, status, showDeleted, page, refreshToken]);

  const refresh = () => setRefreshToken((n) => n + 1);

  const onDelete = async (customer: AdminCustomerListItem) => {
    const result = await deleteCustomer(customer.id);
    if (!result.success) return toast.error(result.error.message);
    toast.success(`"${customer.fullName}" deleted.`);
    refresh();
  };

  const onRestore = async (customer: AdminCustomerListItem) => {
    const result = await restoreCustomer(customer.id);
    if (!result.success) return toast.error(result.error.message);
    toast.success(`"${customer.fullName}" restored.`);
    refresh();
  };

  const total = state.status === "ready" ? state.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-foreground">Customers</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Customers"
          state={stats}
          render={(d) => d.totalCustomers.toLocaleString()}
        />
        <StatCard label="Active" state={stats} render={(d) => d.activeCustomers.toLocaleString()} />
        <StatCard
          label="New This Month"
          state={stats}
          render={(d) => d.newThisMonth.toLocaleString()}
        />
        <StatCard
          label="Lifetime Spend"
          state={stats}
          render={(d) => formatPrice(d.totalLifetimeSpend)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name, email, or phone…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as CustomerStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {CUSTOMER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => {
              setShowDeleted(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 rounded border-input"
          />
          Show deleted
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-elite-sm">
        {state.status === "loading" && (
          <div className="space-y-3 p-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <p className="p-6 text-sm text-muted-foreground">{state.message}</p>
        )}

        {state.status === "ready" && state.items.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No customers match these filters.</p>
        )}

        {state.status === "ready" && state.items.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Lifetime Spend</th>
                <th className="px-4 py-3 font-medium">Last Order</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{customer.fullName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <p>{customer.email ?? "—"}</p>
                    <p className="text-xs">{customer.phone ?? ""}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {STATUS_LABELS[customer.status]}
                      </Badge>
                      {customer.deletedAt && <Badge variant="destructive">Deleted</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {customer.lifetimeOrdersCount}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {formatPrice(customer.lifetimeSpend)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {customer.lastOrderAt
                      ? new Date(customer.lastOrderAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {customer.deletedAt ? (
                        <Button variant="outline" size="sm" onClick={() => onRestore(customer)}>
                          Restore
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline" size="sm">
                            <Link to="/admin/customers/$id" params={{ id: customer.id }}>
                              View
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete "{customer.fullName}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This hides the customer from active lists. You can restore them
                                  later from "Show deleted". Their order history is unaffected.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(customer)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {state.status === "ready" && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Page {page} of {totalPages} · {total} customer{total === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  state,
  render,
}: {
  label: string;
  state: StatsState;
  render: (data: CustomerStats) => string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-elite-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-medium text-foreground">
        {state.status === "loading" && (
          <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted align-middle" />
        )}
        {state.status === "error" && (
          <span className="text-sm font-normal text-destructive">Unavailable</span>
        )}
        {state.status === "ready" && render(state.data)}
      </p>
    </div>
  );
}
