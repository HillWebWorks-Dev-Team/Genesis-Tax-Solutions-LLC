import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SignupPopup } from "@/components/signup/SignupPopup";
import { getPublicContent } from "@/lib/content/public-content";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const content = await getPublicContent();

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        <AnnouncementBar text={content.announcement} />
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <Footer content={content} />
      <SignupPopup />
    </>
  );
}
