import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-zinc-50 to-white py-24">
      <Container className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Phase 1 — Landing
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl">
          Grow from landing page to full business platform
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
          Start with a SEO-optimized marketing site. Scale to e-commerce and CRM without
          rebuilding your foundation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Contact sales
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center rounded-lg border border-zinc-300 px-8 text-sm font-medium hover:bg-zinc-50"
          >
            View pricing
          </Link>
        </div>
      </Container>
    </section>
  );
}
