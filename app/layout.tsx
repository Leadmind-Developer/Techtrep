import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://business.thetechtrep.com"),

  title: {
    default: "Techtrep Business Solutions | Technology, Automation & AI",
    template: "%s | Techtrep Business Solutions",
  },
  

  description:
    "Techtrep Business Solutions helps growing businesses digitize operations, automate repetitive work, connect systems and apply AI where it creates practical value.",
  
  alternates: {
    canonical: "https://business.thetechtrep.com",
  },

  category: "Business Technology",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },

  keywords: [
    "business automation",
    "AI solutions",
    "IT consulting",
    "digital transformation",
    "business technology",
    "software integration",
    "workflow automation",
    "business technology Nigeria",
    "technology consulting Nigeria",
  ],

  authors: [{ name: "Techtrep" }],
  creator: "Techtrep",
  publisher: "Techtrep",

  openGraph: {
    title: "Techtrep Business Solutions",
    description:
      "Technology, Automation & AI for Growing Businesses.",
    url: "https://business.thetechtrep.com",
    siteName: "Techtrep Business Solutions",
    type: "website",
    locale: "en_NG",
  },

  twitter: {
    card: "summary_large_image",
    title: "Techtrep Business Solutions",
    description:
      "Technology, Automation & AI for Growing Businesses.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const navLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Techtrep Business Solutions home"
        >
          <Image
            src="/icon.svg"
            alt="Techtrep"
            width={42}
            height={42}
            className="h-10 w-10 rounded-lg object-contain"
            priority
          />          

          <div>
            <div className="text-sm font-bold tracking-tight text-slate-950">
              TECHTREP
            </div>

            <div className="text-[10px] font-medium tracking-wide text-slate-500">
              BUSINESS SOLUTIONS
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/free-technology-audit"
          className="hidden rounded-lg bg-[#39358C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76] lg:inline-flex"
        >
          Free Technology Audit
        </Link>

        {/* Mobile navigation */}
        <MobileNav />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block"
              aria-label="Techtrep Business Solutions home"
            >
              <div className="text-lg font-bold">TECHTREP</div>

              <div className="mt-1 text-xs tracking-wide text-slate-400">
                BUSINESS SOLUTIONS
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              Technology, Automation & AI for Growing Businesses.
            </p>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Tell us what your staff are doing manually every day. We&apos;ll
              show you what can be automated.
            </p>

            <Link
              href="/free-technology-audit"
              className="mt-7 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
            >
              Start with a Free Audit
            </Link>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold">Solutions</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <Link
                className="block transition-colors hover:text-white"
                href="/solutions"
              >
                All Solutions
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/solutions/digital-foundation"
              >
                Digital Foundation
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/solutions/business-automation"
              >
                Business Automation
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/solutions/ai-business-solutions"
              >
                AI Business Solutions
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/solutions/dashboards-analytics"
              >
                Dashboards & Analytics
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/solutions/custom-technology"
              >
                Custom Technology
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/solutions/networking-infrastructure"
              >
                Networking & Infrastructure
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/solutions/managed-technology"
              >
                Managed Technology
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <Link
                className="block transition-colors hover:text-white"
                href="/industries"
              >
                Industries
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/how-we-work"
              >
                How We Work
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/case-studies"
              >
                Case Studies
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/about"
              >
                About Techtrep
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/contact"
              >
                Contact
              </Link>

              <Link
                className="block transition-colors hover:text-white"
                href="/free-technology-audit"
              >
                Free Technology Audit
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-14 flex flex-col justify-between gap-5 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <p>© {new Date().getFullYear()} Techtrep. All rights reserved.</p>

            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-slate-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-slate-300"
            >
              Terms
            </Link>
          </div>

          <p>Technology, Automation & AI for Growing Businesses.</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}