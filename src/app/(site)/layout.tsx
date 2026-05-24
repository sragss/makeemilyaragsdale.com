import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </SmoothScrollProvider>
  );
}
