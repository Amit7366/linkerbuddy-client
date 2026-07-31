"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa6";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const CONTACT = {
  email: "linkerbuddy@gmail.com",
  phoneDisplay: "01709751603",
  phoneE164: "+8801709751603",
  whatsappE164: "8801709751603",
  telegram: "https://t.me/linkerbuddy",
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
    id: "telegram",
    labelKey: "contact.telegram",
    href: CONTACT.telegram,
    icon: FaTelegram,
    className: "bg-[#229ED9] text-white hover:bg-[#1c8bbb]",
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
    <div ref={rootRef} className="pointer-events-none flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {open ? (
          <motion.ul
            id={menuId}
            role="menu"
            aria-label={t("contact.menu")}
            className="pointer-events-auto m-0 flex list-none flex-col items-end gap-2 p-0"
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
                      "group inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 no-underline shadow-[0_12px_30px_#071b3d33] backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:shadow-[0_12px_30px_#00000066]",
                      "bg-navy text-white ring-1 ring-white/15 dark:bg-[#121a2b] dark:ring-white/10",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-[11px] font-bold whitespace-nowrap text-white">
                      {t(action.labelKey)}
                    </span>
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full transition-colors",
                        action.className,
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      <ScrollToTop />

      <motion.button
        type="button"
        aria-label={open ? t("contact.close") : t("contact.open")}
        aria-expanded={open}
        aria-controls={menuId}
        className={cn(
          "pointer-events-auto grid size-11 place-items-center rounded-full border-0 text-white shadow-[0_12px_28px_#1268f355] transition-colors",
          open ? "bg-navy dark:bg-[#1a2740]" : "bg-brand hover:bg-brand-hover",
        )}
        onClick={() => setOpen((prev) => !prev)}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        animate={
          reduce || open
            ? undefined
            : {
                boxShadow: [
                  "0 12px 28px #1268f355",
                  "0 12px 34px #1268f380",
                  "0 12px 28px #1268f355",
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
              <X className="size-5" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={reduce ? false : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduce ? undefined : { rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="size-5" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
