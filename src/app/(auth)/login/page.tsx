import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Log in", noIndex: true });

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthShell mode="login" />
    </Suspense>
  );
}

function AuthPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  );
}
