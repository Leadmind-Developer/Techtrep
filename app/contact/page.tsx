import Link from "next/link";

export const metadata = {
  title: "Contact Techtrep Business Solutions",
  description:
    "Contact Techtrep Business Solutions about business automation, AI, software, networking, infrastructure, digital transformation and managed technology.",
};

const topics = [
  "Digital transformation",
  "Business automation",
  "AI solutions",
  "Custom software",
  "Dashboards & analytics",
  "Networking & infrastructure",
  "Managed technology",
  "Technology audit",
];

export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Contact Techtrep
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Let&apos;s talk about what your business needs.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Whether you already know what needs to be built or you are still
              trying to understand the problem, tell us what you are working
              on and we can discuss the appropriate next step.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Start here
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Tell us what you are trying to solve.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                You do not need to know exactly which technology you need.
                Describe the business problem, the current process or the
                outcome you want, and we can help identify the technology
                requirements.
              </p>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-950">
                  Email
                </p>

                <a
                  href="mailto:email@thetechtrep.com"
                  className="mt-2 inline-block text-[#39358C] hover:underline"
                >
                  email@thetechtrep.com
                </a>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-950">
                  Free Technology Audit
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If you want to understand where technology could improve your
                  operations, start with our free 30–45 minute technology audit.
                </p>

                <Link
                  href="/free-technology-audit"
                  className="mt-4 inline-flex text-sm font-semibold text-[#39358C] hover:underline"
                >
                  Request the audit →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#39358C]">
                What can we help with?
              </p>

              <h2 className="mt-4 text-2xl font-bold text-slate-950">
                Choose a starting point.
              </h2>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {topics.map((topic) => (
                  <div
                    key={topic}
                    className="flex gap-3 rounded-xl border border-slate-200 p-4"
                  >
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#39358C]"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-slate-700">{topic}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 border-t border-slate-200 pt-7">
                <p className="text-sm leading-6 text-slate-600">
                  For the fastest route to a structured discussion, use the
                  Free Technology Audit. For a specific project or general
                  enquiry, email us directly.
                </p>

                <a
                  href="mailto:email@thetechtrep.com"
                  className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
                >
                  Email Techtrep
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/solutions"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <p className="text-sm font-semibold text-[#39358C]">
                Solutions
              </p>
              <h3 className="mt-2 font-bold text-slate-950">
                Explore our services
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                See the technology capabilities available to your organization.
              </p>
            </Link>

            <Link
              href="/industries"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <p className="text-sm font-semibold text-[#39358C]">
                Industries
              </p>
              <h3 className="mt-2 font-bold text-slate-950">
                See where we can help
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explore common technology needs across different industries.
              </p>
            </Link>

            <Link
              href="/how-we-work"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <p className="text-sm font-semibold text-[#39358C]">
                How We Work
              </p>
              <h3 className="mt-2 font-bold text-slate-950">
                Understand our approach
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                See how we move from business problem to working solution.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}