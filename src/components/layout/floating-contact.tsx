"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const CONTACT = {
  email: "omit9090@gmail.com",
  phoneDisplay: "01740793454",
  phoneE164: "+8801740793454",
  whatsappE164: "8801740793454",
} as const;

const ACTIONS = [
  {
    id: "email",
    labelKey: "contact.email",
    href: `mailto:${CONTACT.email}`,
    icon: Mail,
    className: "bg-[#1268f3] text-white hover:bg-[#075be2]",
  },
  {
    id: "whatsapp",
    labelKey: "contact.whatsapp",
    href: `https://wa.me/${CONTACT.whatsappE164}`,
    icon: FaWhatsapp,
    className: "bg-[#25D366] text-white hover:bg-[#1ebe57]",
    external: true,
  },
  {
    id: "phone",
    labelKey: "contact.phone",
    href: `tel:${CONTACT.phoneE164}`,
    icon: Phone,
    className: "bg-[#0a9d70] text-white hover:bg-[#088a62]",
  },
] as const;

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const t = useTranslations();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed right-4 bottom-5 z-[70] flex flex-col items-end gap-3 tablet:right-6 tablet:bottom-6"
    >
      <AnimatePresence>
        {open ? (
          <motion.ul
            id={menuId}
            role="menu"
            aria-label={t("contact.menu")}
            className="pointer-events-auto m-0 flex list-none flex-col items-end gap-2.5 p-0"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.li
                  key={action.id}
                  initial={reduce ? false : { opacity: 0, y: 16, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: 10, scale: 0.9 }}
                  transition={{
                    duration: 0.22,
                    delay: reduce ? 0 : index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <a
                    href={action.href}
                    role="menuitem"
                    target={"external" in action && action.external ? "_blank" : undefined}
                    rel={"external" in action && action.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "group inline-flex items-center gap-2.5 rounded-full py-2 pr-2 pl-3.5 no-underline shadow-[0_12px_30px_#071b3d33] backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:shadow-[0_12px_30px_#00000066]",
                      "bg-card/95 text-ink ring-1 ring-line dark:bg-[#121a2b]/95 dark:ring-white/10",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-[12px] font-bold whitespace-nowrap">
                      {t(action.labelKey)}
                    </span>
                    <span
                      className={cn(
                        "grid size-10 place-items-center rounded-full transition-colors",
                        action.className,
                      )}
                    >
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? t("contact.close") : t("contact.open")}
        aria-expanded={open}
        aria-controls={menuId}
        className={cn(
          "pointer-events-auto grid size-14 place-items-center rounded-full border-0 text-white shadow-[0_14px_36px_#1268f355] transition-colors",
          open ? "bg-navy dark:bg-[#1a2740]" : "bg-brand hover:bg-brand-hover",
        )}
        onClick={() => setOpen((prev) => !prev)}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        animate={
          reduce || open
            ? undefined
            : {
                boxShadow: [
                  "0 14px 36px #1268f355",
                  "0 14px 42px #1268f380",
                  "0 14px 36px #1268f355",
                ],
              }
        }
        transition={
          reduce || open
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={reduce ? false : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduce ? undefined : { rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="size-6" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={reduce ? false : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduce ? undefined : { rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="size-6" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
