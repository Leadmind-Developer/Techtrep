"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="lg:hidden">
      {/* Mobile controls */}
      <div className="flex items-center gap-2">
        <Link
          href="/free-technology-audit"
          className="rounded-lg bg-[#39358C] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2f2b76]"
          onClick={closeMenu}
        >
          Free Audit
        </Link>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-900 transition-colors hover:bg-slate-50"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span className="sr-only">
            {open ? "Close menu" : "Open menu"}
          </span>

          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-[72px] z-40 border-b border-slate-200 bg-white shadow-lg"
        >
          <nav
            className="mx-auto max-w-7xl px-6 py-5"
            aria-label="Mobile navigation"
          >
            <div className="divide-y divide-slate-100">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between py-4 text-base font-medium text-slate-800 transition-colors hover:text-[#39358C]"
                >
                  <span>{link.label}</span>

                  <span
                    className="text-slate-400"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <Link
                href="/free-technology-audit"
                onClick={closeMenu}
                className="flex w-full items-center justify-center rounded-lg bg-[#39358C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Start a Free Technology Audit
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}