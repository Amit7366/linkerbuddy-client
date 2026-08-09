import { buildMetadata } from "@/lib/seo/metadata";
import { AccountShell } from "@/components/account/account-shell";
import { ToastProvider } from "@/components/ui/toast";

export const metadata = buildMetadata({ title: "Account", noIndex: true });

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AccountShell>{children}</AccountShell>
    </ToastProvider>
  );
}
