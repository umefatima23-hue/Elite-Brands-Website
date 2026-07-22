import { X } from "lucide-react";
import { BRANDS, CATEGORIES } from "@/data/products";
import { Input } from "@/components/ui/input";

export interface ShopFilterState {
  q: string;
  brand: string;
  category: string;
  price: string; // "all" | "0-5000" | "5000-10000" | "10000+"
  sort: string; // "featured" | "price-asc" | "price-desc" | "discount"
}

export const DEFAULT_FILTERS: ShopFilterState = {
  q: "",
  brand: "all",
  category: "all",
  price: "all",
  sort: "featured",
};

const PRICES = [
  { value: "all", label: "All prices" },
  { value: "0-5000", label: "Under PKR 5,000" },
  { value: "5000-10000", label: "PKR 5,000 – 10,000" },
  { value: "10000+", label: "Over PKR 10,000" },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

interface Props {
  value: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  resultCount: number;
}

export function ShopFilters({ value, onChange, resultCount }: Props) {
  const set = <K extends keyof ShopFilterState>(k: K, v: ShopFilterState[K]) =>
    onChange({ ...value, [k]: v });

  const dirty =
    value.q || value.brand !== "all" || value.category !== "all" || value.price !== "all";

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-elite-sm">
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Search
        </label>
        <Input
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="Search products, brands…"
        />
      </div>

      <FilterSelect
        label="Brand"
        value={value.brand}
        onChange={(v) => set("brand", v)}
        options={[{ value: "all", label: "All brands" }, ...BRANDS.map((b) => ({ value: b.slug, label: b.name }))]}
      />

      <FilterSelect
        label="Category"
        value={value.category}
        onChange={(v) => set("category", v)}
        options={[{ value: "all", label: "All categories" }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))]}
      />

      <FilterSelect label="Price" value={value.price} onChange={(v) => set("price", v)} options={PRICES} />
      <FilterSelect label="Sort by" value={value.sort} onChange={(v) => set("sort", v)} options={SORTS} />

      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">{resultCount} product{resultCount === 1 ? "" : "s"}</p>
        {dirty && (
          <button
            type="button"
            onClick={() => onChange({ ...DEFAULT_FILTERS, sort: value.sort })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
