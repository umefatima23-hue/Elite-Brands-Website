/** Placeholder — wire to Supabase / ESP in Sprint 02. */
export function Newsletter() {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Newsletter signup"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@example.com"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        className="h-10 rounded-md bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.16em] hover:bg-primary/90"
      >
        Subscribe
      </button>
    </form>
  );
}
