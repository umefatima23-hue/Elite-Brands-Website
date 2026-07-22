import { Container } from "./container";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-12 md:py-16 text-center">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-4xl md:text-5xl text-foreground">{title}</h1>
        <span className="gold-rule mx-auto mt-5" />
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base text-muted-foreground">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
