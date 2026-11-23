import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Setup",
  robots: { index: false, follow: false },
};

/** Setup is folded into access-code login. */
export default function AdminSetupPage() {
  redirect("/admin/login/");
}
