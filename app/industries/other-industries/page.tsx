import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Business Technology for Other Industries",
  description:
    "Explore practical technology, automation, AI, networking and custom software solutions for organizations across professional services, retail, logistics and other industries.",
  path: "/industries/other-industries",
});

const industries = [
  {
    title: "Professional Services",
    description:
      "Improve client enquiries, lead management, appointments, documents, approvals, reporting and internal workflows.",
    examples: [
      "Lead and enquiry management",
      "Client onboarding workflows",
      "Appointment and scheduling systems",
      "Document and approval workflows",
      "Automated follow-ups",
      "Management reporting",
    ],
  },
  {
    title: "Retail & E-commerce",
    description:
      "Connect customer interactions, orders, payments, inventory processes and reporting into more efficient workflows.",
    examples: [
      "Customer enquiry capture",
      "Order workflow automation",
      "Payment integrations",
      "Inventory-related workflows",
      "Customer communication",
      "Sales dashboards",
    ],
  },
  {
    title: "Real Estate",
    description:
      "Make property enquiries, lead follow-up, inspections, documentation and reporting easier to manage.",
    examples: [
      "Property enquiry management",
      "Lead capture and follow-up",
      "Inspection scheduling",
      "Client communication",
      "Document workflows",
      "Performance dashboards",
    ],
  },
  {
    title: "Logistics & Distribution",
    description:
      "Improve operational visibility across enquiries, dispatch, communication, tracking workflows and reporting.",
    examples: [
      "Order and dispatch workflows",
      "Customer notifications",
      "Operational dashboards",
      "Data consolidation",
      "Internal approvals",
      "Connectivity and device deployment",
    ],
  },
  {
    title: "Nonprofits & Associations",
    description:
      "Support membership, communication, events, administration, reporting and recurring organizational processes.",
    examples: [
      "Member databases",
      "Registration workflows",
      "Event management processes",
      "Communication automation",
      "Payment integrations",
      "Management reporting",
    ],
  },
  {
    title: "Technology Companies",
    description:
      "Strengthen internal operations, customer workflows, integrations, infrastructure and reporting as the organization grows.",
    examples: [
      "Internal workflow automation",
      "System integrations",
      "Customer operations",
      "Cloud and infrastructure",
      "Monitoring and support",
      "Custom software",
    ],
  },
  {
    title: "Manufacturing",
    description:
      "Improve visibility and coordination across administrative, operational, reporting and technology workflows.",
    examples: [
      "Operational data collection",
      "Approval workflows",
      "Reporting dashboards",
      "Inventory-related processes",
      "Internal communication",
      "Network and device infrastructure",
    ],
  },
  {
    title: "Other Organizations",
    description:
      "If your organization does not fit a standard industry category, we can start with the workflow rather than forcing you into a predefined solution.",
    examples: [
      "Technology assessments",
      "Process improvement",
      "Workflow automation",
      "AI opportunities",
      "System integration",
      "Infrastructure and connectivity",
    ],
  },
];

const opportunities = [
  "Replace repetitive manual processes with automated workflows",
  "Connect systems that currently require duplicate data entry",
  "Create better ways to capture and follow up on enquiries",
  "Centralize operational information for easier management",
  "Introduce dashboards for important business metrics",
  "Use AI for appropriate administrative and knowledge-work tasks",
  "Improve websites, applications and customer-facing digital experiences",
  "Deploy reliable LAN, Wi-Fi, connectivity and endpoint infrastructure",
  "Modernize technology without replacing everything at once",
  "Create custom technology where an off-the-shelf system is not enough",
];

const process = [
  {
    number: "01",
    title: "Understand the operation",
    description:
      "We start with how your organization actually works, including the people, processes, systems and technology involved.",
  },
  {
    number: "02",
    title: "Identify the opportunity",
    description:
      "We look for repetitive work, disconnected systems, bottlenecks, reporting gaps, infrastructure issues and practical opportunities for improvement.",
  },
  {
    number: "03",
    title: "Recommend the right approach",
    description:
      "The recommendation may involve configuration, integration, automation, AI, infrastructure, custom development or a combination of these.",
  },
  {
    number: "04",
    title: "Implement and improve",
    description:
      "We implement the agreed solution, test it with your team and identify further improvements as the business evolves.",
  },
];

const faqs = [
  {
    question: "What if my industry is not listed?",
    answer:
      "That is exactly what this category is for. Techtrep can work with organizations across different sectors. We focus on the operational problem, existing technology and desired outcome rather than limiting the engagement to a predefined industry.",
  },
  {
    question: "Do you provide technology solutions for small businesses?",
    answer:
      "Yes. Solutions can be scaled according to the size, needs and budget of the organization. The goal is to solve meaningful operational problems without introducing unnecessary complexity.",
  },
  {
    question: "Can you work with our existing software?",
    answer:
      "Yes. Where practical, we can work with existing websites, applications, cloud services and business software. Integration or automation may be more appropriate than replacing a system that already works.",
  },
  {
    question: "Can you build a custom system?",
    answer:
      "Yes. Custom technology can be considered when existing tools cannot adequately support the required workflow. We first determine whether configuration or integration can solve the problem before recommending custom development.",
  },
  {
    question: "Do you also handle networking and infrastructure?",
    answer:
      "Yes. Techtrep provides networking and infrastructure services covering ISP connectivity, last-mile connectivity, LAN and Wi-Fi deployment, structured cabling, security-camera cabling, solar cabling, device installation and endpoint connectivity.",
  },
  {
    question: "Can we start with an assessment before committing to a project?",
    answer:
      "Yes. Our Free Technology Audit is designed to identify practical technology and automation opportunities before you decide whether to proceed with an implementation.",
  },
];

export default function OtherIndustriesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Other Industries
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology that adapts to how your organization works.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Not every organization fits neatly into a single industry
              category. Techtrep helps businesses, nonprofits and other
              organizations improve operations with practical technology,
              automation, AI, analytics and infrastructure solutions.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Start a Free Technology Audit
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Talk to Techtrep
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Beyond industry labels
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Start with the problem, not the industry.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                Every organization has different processes, people, systems
                and constraints. Two companies in completely different
                industries can have the same technology problem—such as
                manually following up leads, entering the same information
                into multiple systems or struggling to produce reliable
                management reports.
              </p>

              <p>
                That is why our approach begins with understanding the
                operation. We identify where technology can reduce repetitive
                work, improve visibility, connect existing systems or make
                everyday work easier.
              </p>

              <p>
                The result may be a relatively simple automation, a system
                integration, an infrastructure upgrade, an AI-enabled
                workflow or a larger custom technology project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Organizations we can support
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Practical technology across different sectors.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              These are examples rather than limits. If your organization
              operates outside these categories, the same problem-first
              approach applies.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {industries.map((industry) => (
              <article
                key={industry.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {industry.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {industry.description}
                </p>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Potential opportunities
                  </p>

                  <ul className="mt-4 space-y-3">
                    {industry.examples.map((example) => (
                      <li
                        key={example}
                        className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                          aria-hidden="true"
                        />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Where we can help
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Find the work that should be easier.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Technology does not have to mean replacing everything you
                already use. Often, the biggest opportunity is improving the
                way existing tools, people and processes work together.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39358C] text-xs font-bold text-white"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <p className="text-sm font-medium leading-6 text-slate-800">
                      {opportunity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Techtrep solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              The right solution depends on the problem.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We combine different capabilities when necessary rather than
              forcing every organization into a single technology package.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/solutions/digital-foundation"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Digital Foundation
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Websites, digital systems and the technology foundation your
                organization needs.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/business-automation"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Business Automation
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Automate repetitive work and connect the steps that slow your
                team down.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/ai-business-solutions"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                AI Business Solutions
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Apply AI to practical business workflows where it can create
                measurable value.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/dashboards-analytics"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Dashboards & Analytics
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Turn operational data into clearer management information and
                reporting.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/custom-technology"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Custom Technology
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Build software around a workflow when existing tools are not
                enough.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/managed-technology"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Managed Technology
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ongoing support, maintenance, monitoring and technology
                improvement.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/networking-infrastructure"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Networking & Infrastructure
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                ISP, last-mile, LAN, Wi-Fi, cabling, device installation and
                endpoint connectivity.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How we approach it
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From operational problem to practical solution.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <p className="text-sm font-bold text-[#39358C]">
                  {step.number}
                </p>

                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Frequently asked questions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Questions about working with Techtrep
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-slate-950">
                  <span>{faq.question}</span>
                  <span
                    className="shrink-0 text-xl font-normal text-[#39358C] transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>

                <p className="mt-4 max-w-3xl pr-8 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Start with your operation
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tell us what is taking too much time.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              We can help you identify where technology, automation, AI or
              infrastructure improvements could make your organization easier
              to run.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Start a Free Technology Audit
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact Techtrep
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}