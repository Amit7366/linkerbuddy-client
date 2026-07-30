import { RegisterForm } from "@/components/forms/auth-forms";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Register", noIndex: true });

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Create an account</h1>
      <p className="mt-2 text-sm text-zinc-600">Get started for free</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </>
  );
}
