import { Container } from "./container";

/** Visual placeholder used by foundation routes before business logic lands. */
export function PlaceholderSection({ title, note }: { title: string; note?: string }) {
  return (
    <Container className="py-20">
      <div className="rounded-lg border border-dashed border-border bg-surface/60 p-10 text-center">
        <p className="eyebrow">Coming soon</p>
        <h2 className="mt-3 text-2xl text-foreground">{title}</h2>
        {note && <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{note}</p>}
      </div>
    </Container>
  );
}
