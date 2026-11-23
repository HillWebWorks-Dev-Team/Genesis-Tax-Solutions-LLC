import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-4 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-pink">
        404
      </p>
      <h1 className="font-display text-4xl text-brand-navy">Page not found</h1>
      <p className="max-w-lg text-brand-slate">
        The page you requested is unavailable. Return home or contact the
        office from the main navigation.
      </p>
      <Button href="/">Back to Home</Button>
    </Container>
  );
}
