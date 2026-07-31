import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { Logo } from "@/components/ui/logo";

export const metadata = buildMetadata({ title: "Forgot password", noIndex: true });

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <Logo className="mb-8 self-start" />
      <h1 className="text-2xl font-bold tracking-[-0.8px] text-ink">Forgot password</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Password reset will be available in a future update. Please contact support.
      </p>
      <Link
        href="/login"
        className="mt-8 text-sm font-semibold text-brand no-underline hover:text-brand-hover"
      >
        Back to sign in
      </Link>
    </div>
  );
}
