import { LoginForm } from "@/components/forms/auth-forms";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Log in", noIndex: true });

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-zinc-600">Sign in to your account</p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </>
  );
}
