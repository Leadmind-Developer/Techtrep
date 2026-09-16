import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://business.thetechtrep.com"),
  title: {
    default: "Techtrep Business Solutions | Technology, Automation & AI",
    template: "%s | Techtrep Business Solutions",
  },
  description:
    "Techtrep Business Solutions helps growing businesses digitize operations, automate repetitive work, connect systems and apply AI where it creates practical value.",
  keywords: [
    "business automation",
    "AI solutions",
    "IT consulting",
    "digital transformation",
    "business technology",
    "software integration",
    "workflow automation",
    "Nigeria",
  ],
  openGraph: {
    title: "Techtrep Business Solutions",
    description:
      "Technology, Automation & AI for Growing Businesses.",
    url: "https://business.thetechtrep.com",
    siteName: "Techtrep Business Solutions",
    type: "website",
  },
};

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#39358C] text-sm font-bold text-white">
            T
          </div>

          <div>
            <div className="text-sm font-bold tracking-tight text-slate-950">
              TECHTREP
            </div>

            <div className="text-[10px] font-medium tracking-wide text-slate-500">
              BUSINESS SOLUTIONS
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/solutions"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Solutions
          </Link>

          <Link
            href="/industries"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Industries
          </Link>

          <Link
            href="/how-we-work"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            How We Work
          </Link>

          <Link
            href="/case-studies"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Case Studies
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            About
          </Link>
        </nav>

        <Link
          href="/free-technology-audit"
          className="hidden rounded-lg bg-[#39358C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2b76] sm:inline-flex"
        >
          Free Technology Audit
        </Link>

        <Link
          href="/free-technology-audit"
          className="inline-flex rounded-lg bg-[#39358C] px-3 py-2 text-xs font-semibold text-white sm:hidden"
        >
          Free Audit
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="text-lg font-bold">TECHTREP</div>

            <div className="mt-1 text-xs tracking-wide text-slate-400">
              BUSINESS SOLUTIONS
            </div>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              Technology, Automation & AI for Growing Businesses.
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Tell us what your staff are doing manually every day. We'll show
              you what can be automated.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Solutions</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <Link className="block hover:text-white" href="/solutions/digital-foundation">
                Digital Foundation
              </Link>

              <Link className="block hover:text-white" href="/solutions/business-automation">
                Business Automation
              </Link>

              <Link className="block hover:text-white" href="/solutions/ai-business-solutions">
                AI Business Solutions
              </Link>

              <Link className="block hover:text-white" href="/solutions/custom-technology">
                Custom Technology
              </Link>

              <Link className="block hover:text-white" href="/solutions/managed-technology">
                Managed Technology
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <Link className="block hover:text-white" href="/industries">
                Industries
              </Link>

              <Link className="block hover:text-white" href="/how-we-work">
                How We Work
              </Link>

              <Link className="block hover:text-white" href="/case-studies">
                Case Studies
              </Link>

              <Link className="block hover:text-white" href="/about">
                About Techtrep
              </Link>

              <Link className="block hover:text-white" href="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Techtrep. All rights reserved.</p>

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
