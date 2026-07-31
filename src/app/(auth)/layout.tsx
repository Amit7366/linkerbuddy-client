import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Authentication",
  noIndex: true,
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
