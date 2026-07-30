import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-zinc-900">404</h1>
      <p className="mt-4 text-lg text-zinc-600">Page not found</p>
      <Link href="/" className="mt-8 text-sm font-medium text-zinc-900 hover:underline">
        Go home
      </Link>
    </Container>
  );
}
