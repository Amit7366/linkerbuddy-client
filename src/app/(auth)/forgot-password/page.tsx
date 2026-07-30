import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Forgot password", noIndex: true });

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Forgot password</h1>
      <p className="mt-4 text-sm text-zinc-600">
        Password reset will be available in a future update. Please contact support.
      </p>
    </>
  );
}
