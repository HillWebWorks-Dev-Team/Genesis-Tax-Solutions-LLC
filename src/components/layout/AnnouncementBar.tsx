import { Container } from "@/components/ui/Container";

export function AnnouncementBar({ text }: { text: string }) {
  if (!text.trim()) return null;

  return (
    <div className="bg-brand-pink text-white">
      <Container className="py-2 text-center text-[0.72rem] font-medium tracking-[0.08em] sm:text-xs sm:tracking-[0.12em]">
        {text}
      </Container>
    </div>
  );
}
