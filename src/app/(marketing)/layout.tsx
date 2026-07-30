import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";
import { ShortlistProvider } from "@/providers/shortlist-provider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ShortlistProvider>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </ShortlistProvider>
    </ToastProvider>
  );
}
