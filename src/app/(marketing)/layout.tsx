import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingDock } from "@/components/layout/floating-dock";
import { ToastProvider } from "@/components/ui/toast";
import { CartChrome } from "@/components/marketing/cart-chrome";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingDock />
      <CartChrome />
    </ToastProvider>
  );
}
