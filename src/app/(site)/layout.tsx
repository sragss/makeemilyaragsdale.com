import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHaptics } from "@/components/site-haptics";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <SiteHaptics>
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </SiteHaptics>
    </SmoothScrollProvider>
  );
}
