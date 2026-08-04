import { buildMetadata } from "@/lib/seo/metadata";
import { AccountShell } from "@/components/account/account-shell";

export const metadata = buildMetadata({ title: "Account", noIndex: true });

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
