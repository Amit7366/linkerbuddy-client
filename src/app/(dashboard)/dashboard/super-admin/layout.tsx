import { buildMetadata } from "@/lib/seo/metadata";
import { SuperAdminShell } from "@/components/dashboard/super-admin-shell";
import { SuperAdminSidebar } from "@/components/dashboard/super-admin-sidebar";

export const metadata = buildMetadata({
  title: "Super Admin",
  noIndex: true,
});

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminShell>
      <SuperAdminSidebar>{children}</SuperAdminSidebar>
    </SuperAdminShell>
  );
}
