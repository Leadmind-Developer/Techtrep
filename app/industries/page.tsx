import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Techtrep helps schools, hotels, clinics, churches, media organizations and businesses across other industries improve operations with technology, automation, AI, analytics and infrastructure solutions.",
};

const industries = [
  {
    title: "Schools & Education",
    href: "/industries/schools",
    description:
      "Improve admissions, enquiries, communication, payments, reporting and administrative workflows.",
    opportunities: [
      "Admissions and enquiry workflows",
      "Parent and student communication",
      "Administrative automation",
      "Payments and digital processes",
      "Management reporting",
    ],
  },
  {
    title: "Hotels & Hospitality",
    href: "/industries/hotels",
    description:
      "Improve guest enquiries, bookings, communication, operations, payments and management visibility.",
    opportunities: [
      "Booking and enquiry workflows",
      "Guest communication",
      "Operational automation",
      "Payment integrations",
      "Management dashboards",
    ],
  },
  {
    title: "Clinics & Healthcare",
    href: "/industries/clinics",
    description:
      "Support administrative and operational workflows with practical technology while working around existing healthcare systems.",
    opportunities: [
      "Appointment workflows",
      "Patient communication processes",
      "Administrative automation",
      "Payment and billing workflows",
      "Operational reporting",
    ],
  },
  {
    title: "Churches & Faith Organizations",
    href: "/industries/churches",
    description:
      "Help faith organizations manage communication, events, administration, member-related workflows and technology infrastructure.",
    opportunities: [
      "Registration workflows",
      "Communication",
      "Event management",
      "Administrative automation",
      "Reporting and dashboards",
    ],
  },
  {
    title: "Media & Entertainment",
    href: "/industries/media-entertainment",
    description:
      "Improve content operations, audience engagement, advertising, events, digital revenue, reporting and infrastructure.",
    opportunities: [
      "Content workflows",
      "Audience management",
      "Advertising and sponsorship",
      "Events and registration",
      "Digital revenue workflows",
    ],
  },
  {
    title: "Other Industries",
    href: "/industries/other-industries",
    description:
      "Technology support for professional services, retail, real estate, logistics, nonprofits, technology companies, manufacturing and other organizations.",
    opportunities: [
      "Workflow automation",
      "System integration",
      "AI opportunities",
      "Dashboards and reporting",
      "Networking and infrastructure",
    ],
  },
];

const capabilities = [
  {
    title: "Digital Foundation",
    description:
      "Websites, digital platforms and the technology foundations organizations need to operate and grow.",
    href: "/solutions/digital-foundation",
  },
  {
    title: "Business Automation",
    description:
      "Reduce repetitive work by automating processes and connecting the systems your team already uses.",
    href: "/solutions/business-automation",
  },
  {
    title: "AI Business Solutions",
    description:
      "Identify practical ways to apply AI to customer service, knowledge work, administration and operations.",
    href: "/solutions/ai-business-solutions",
  },
  {
    title: "Dashboards & Analytics",
    description:
      "Turn operational information into clearer management reporting and actionable visibility.",
    href: "/solutions/dashboards-analytics",
  },
  {
    title: "Custom Technology",
    description:
      "Build software around a specific business process when existing tools cannot adequately solve the problem.",
    href: "/solutions/custom-technology",
  },
  {
    title: "Managed Technology",
    description:
      "Ongoing support, maintenance, monitoring and improvement for business technology.",
    href: "/solutions/managed-technology",
  },
  {
    title: "Networking & Infrastructure",
    description:
      "ISP, last-mile connectivity, LAN, Wi-Fi, cabling, devices, endpoints and related infrastructure.",
    href: "/solutions/networking-infrastructure",
  },
];

const reasons = [
  {
    title: "Industry context",
    description:
      "We consider the workflows, customers, staff and technology environment specific to your organization.",
  },
  {
    title: "Practical solutions",
    description:
      "We focus on technology that solves a real operational problem rather than adding complexity for its own sake.",
  },
  {
    title: "Existing systems first",
    description:
      "Where your current tools work, we look at integration, configuration and automation before recommending replacement.",
  },
  {
    title: "Scalable approach",
    description:
      "Projects can start with a focused improvement and expand as your organization's requirements become clearer.",
  },
];

export default function IndustriesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Industries We Serve
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology solutions built around how your industry operates.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Different industries have different workflows, customers,
              operational pressures and technology requirements. Techtrep
              combines industry understanding with practical technology,
              automation, AI, analytics and infrastructure services.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Start a Free Technology Audit
              </Link>

              <Link
                href="/solutions"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industry directory */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Find your industry
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with the environment you operate in.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Explore how technology, automation and infrastructure can
              address common operational challenges across different types of
              organizations.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {industries.map((industry) => (
              <Link
                key={industry.href}
                href={industry.href}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-5">
                  <h3 className="text-xl font-bold text-slate-950">
                    {industry.title}
                  </h3>

                  <span
                    className="shrink-0 text-xl text-[#39358C] transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {industry.description}
                </p>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Common opportunities
                  </p>

                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {industry.opportunities.map((opportunity) => (
                      <li
                        key={opportunity}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                          aria-hidden="true"
                        />
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <span className="mt-7 inline-block text-sm font-semibold text-[#39358C]">
                  View industry solutions →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Problem-first approach */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Our approach
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                We start with your operation, not a technology sales pitch.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Industry knowledge matters, but every organization has its own
                processes and constraints. We look at what your team actually
                does and where technology can make the biggest practical
                difference.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-lg font-bold text-slate-950">
                    {reason.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Our capabilities
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              One industry may need several technology capabilities.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              A school may need connectivity and automation. A hotel may need
              integrations and dashboards. A media organization may need
              audience workflows and infrastructure. We combine capabilities
              around the actual requirement.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <Link
                key={capability.href}
                href={capability.href}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:bg-white hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {capability.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {capability.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-industry examples */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Cross-industry opportunities
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Some technology problems exist everywhere.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Regardless of industry, organizations often lose time to
                repetitive tasks, disconnected systems, manual reporting,
                communication gaps and unreliable technology infrastructure.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Manual data entry",
                "Repeated follow-ups",
                "Disconnected systems",
                "Slow internal approvals",
                "Poor management visibility",
                "Manual reporting",
                "Unstructured information",
                "Connectivity problems",
              ].map((problem) => (
                <div
                  key={problem}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audit */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                  Not sure where to start?
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Start with a Free Technology Audit.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-600">
                  We&apos;ll look at your current technology, workflows and
                  operational challenges and identify practical opportunities
                  for improvement. You&apos;ll receive a Technology Opportunity
                  Report with no obligation to proceed.
                </p>
              </div>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Start Free Audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Technology for your organization
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tell us what your organization needs to do better.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Whether you need automation, AI, system integration, analytics,
              custom software, networking or ongoing technology support, we
              can start by understanding the problem.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Talk to Techtrep
              </Link>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Start a Free Technology Audit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}