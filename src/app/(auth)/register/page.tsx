import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Register", noIndex: true });

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthShell mode="register" />
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
