import { Container } from "@/components/ui/Container";

export function AnnouncementBar({ text }: { text: string }) {
  if (!text.trim()) return null;

  return (
    <div className="bg-brand-pink text-white">
      <Container className="px-3 py-2 text-center text-[0.68rem] font-medium leading-snug tracking-[0.04em] sm:text-xs sm:tracking-[0.12em]">
        {text}
      </Container>
    </div>
  );
}
