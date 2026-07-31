"use client";

import { FloatingContact } from "@/components/layout/floating-contact";

export function FloatingDock() {
  return (
    <div className="pointer-events-none fixed right-4 bottom-5 z-[70] tablet:right-6 tablet:bottom-6">
      <FloatingContact />
    </div>
  );
}
