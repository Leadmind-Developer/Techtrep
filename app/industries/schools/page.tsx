import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Technology Solutions for Schools",
  description:
    "Technology solutions for schools including digital platforms, workflow automation, communication, reporting, networking, infrastructure and custom systems.",
  path: "/industries/schools",
});

const challenges = [
  {
    title: "Admissions & Enquiries",
    description:
      "Capture prospective-parent enquiries, organize follow-ups and reduce the amount of admissions work handled manually.",
  },
  {
    title: "Parent Communication",
    description:
      "Improve how important information moves between the school, parents and other stakeholders.",
  },
  {
    title: "Administrative Workflows",
    description:
      "Reduce repetitive administrative tasks involving forms, approvals, records, documents and internal communication.",
  },
  {
    title: "Payments & Fees",
    description:
      "Improve visibility around payment activity and connect relevant payment information with other business processes.",
  },
  {
    title: "Reporting & Management",
    description:
      "Give school management clearer visibility into operational activity, enquiries, payments and other important indicators.",
  },
  {
    title: "Technology Integration",
    description:
      "Connect existing systems where possible so staff spend less time moving information between disconnected tools.",
  },
];

const opportunities = [
  "Automated admissions enquiry capture and follow-up",
  "Parent communication workflows",
  "Online forms and application processes",
  "Fee and payment reporting",
  "Management dashboards",
  "Staff approval and internal workflows",
  "Document and information management",
  "School website improvements",
  "AI-assisted administrative tasks",
  "Integration between existing systems",
];

const signs = [
  "Staff spend too much time answering the same admissions questions.",
  "Enquiries arrive through different channels and are difficult to track.",
  "Important information is copied manually between systems.",
  "Management reports take too long to prepare.",
  "Parents or prospective parents experience delays getting information.",
  "Staff rely heavily on spreadsheets for recurring administrative processes.",
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We learn how your school currently handles admissions, communication, administration and reporting.",
  },
  {
    number: "02",
    title: "Identify",
    text: "We identify technology gaps, repetitive work, integration opportunities and areas where better visibility would help.",
  },
  {
    number: "03",
    title: "Prioritize",
    text: "We separate quick wins from larger opportunities and focus first on changes that can create practical value.",
  },
  {
    number: "04",
    title: "Implement",
    text: "We implement the appropriate technology, automation, integration or custom solution.",
  },
  {
    number: "05",
    title: "Improve",
    text: "We review what is working and identify additional improvements as the school's needs evolve.",
  },
];

const faqs = [
  {
    question: "Can Techtrep work with our existing school software?",
    answer:
      "Yes. We can assess the systems your school already uses and determine whether they can be improved, integrated or extended rather than automatically replacing them.",
  },
  {
    question: "Can you help automate admissions enquiries?",
    answer:
      "Yes. Admissions is a strong area for automation. Depending on your current process, we can help capture enquiries, organize them, trigger appropriate follow-ups and improve visibility for admissions staff.",
  },
  {
    question: "Can you build a school website?",
    answer:
      "Yes. Website projects can be part of a broader digital foundation or custom technology engagement, particularly where the website needs to connect with other business processes.",
  },
  {
    question: "Can AI be useful for schools?",
    answer:
      "AI can support selected administrative and communication tasks when implemented appropriately. We focus on practical use cases and keep appropriate human oversight around important decisions and sensitive information.",
  },
  {
    question: "Can you build a custom school portal?",
    answer:
      "Yes. Where an existing platform does not adequately address a defined requirement, we can assess the feasibility of building a custom portal or supporting application.",
  },
  {
    question: "How do we know where to start?",
    answer:
      "The Free Technology Audit is designed for exactly this situation. We can review your current technology environment and identify practical opportunities before you commit to a larger project.",
  },
];

export default function SchoolsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Schools &amp; Education
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology that makes running a school easier.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Help your school reduce repetitive administrative work, improve
              communication, understand its operations and get more value from
              the technology it already uses.
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
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Discuss Your School
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                The challenge
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Schools have plenty of technology. The challenge is making it
                work together.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                A modern school may rely on a website, messaging platforms,
                payment systems, spreadsheets, student-management software,
                accounting tools and other applications.
              </p>

              <p>
                Each system may solve a particular problem, but staff can
                still end up moving information manually between them.
              </p>

              <p>
                Admissions teams may track enquiries separately. Administrators
                may prepare reports manually. Parents may contact different
                members of staff for information that could be handled more
                efficiently.
              </p>

              <p className="font-medium text-slate-900">
                Techtrep helps schools identify where technology can simplify
                these processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Where we can help
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Practical technology improvements across school operations.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Every school is different. We start with your existing processes
              and identify where technology can remove friction or improve
              visibility.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.title}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {challenge.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {challenge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Technology opportunities
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Small improvements can remove a surprising amount of manual
                work.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                We look for opportunities where better systems, automation,
                integration, analytics or AI can improve an existing process.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-4"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39358C] text-xs font-bold text-white"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <span className="text-sm font-medium leading-6 text-slate-800">
                    {opportunity}
                  </span>
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
              From improving existing technology to building what is missing.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Digital Foundation",
                description:
                  "Websites, digital infrastructure and essential business technology for a stronger digital foundation.",
                href: "/solutions/digital-foundation",
              },
              {
                title: "Business Automation",
                description:
                  "Automate repetitive admissions, communication and administrative workflows.",
                href: "/solutions/business-automation",
              },
              {
                title: "AI Business Solutions",
                description:
                  "Apply AI to practical communication, knowledge and administrative use cases.",
                href: "/solutions/ai-business-solutions",
              },
              {
                title: "Dashboards & Analytics",
                description:
                  "Create clearer visibility into admissions, payments, operations and management KPIs.",
                href: "/solutions/dashboards-analytics",
              },
              {
                title: "Custom Technology",
                description:
                  "Build portals, applications or integrations around a requirement existing software cannot handle.",
                href: "/solutions/custom-technology",
              },
              {
                title: "Managed Technology",
                description:
                  "Keep your school's technology supported, maintained and improving after implementation.",
                href: "/solutions/managed-technology",
              },
            ].map((solution) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-colors hover:border-[#39358C]"
              >
                <h3 className="text-xl font-semibold text-slate-950 group-hover:text-[#39358C]">
                  {solution.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {solution.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                  Explore Solution →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Signs */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Is this familiar?
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your school may have an opportunity to improve if...
              </h2>
            </div>

            <div className="space-y-4">
              {signs.map((sign) => (
                <div
                  key={sign}
                  className="flex gap-4 rounded-xl border border-slate-200 p-5"
                >
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#39358C]"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-700">{sign}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How we work with schools
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with how your school operates—not with a technology
              product.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We first understand the current process and then recommend the
              technology approach that best fits the requirement.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {process.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="text-sm font-bold text-[#39358C]">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-semibold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-slate-950 px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  Start with a technology audit
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Not sure where your school should start?
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  Tell us how your school currently works, where staff spend
                  too much time manually and which systems are causing
                  difficulty. We&apos;ll identify practical technology
                  opportunities.
                </p>
              </div>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
              >
                Start a Free Audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              FAQ
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Questions from schools
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-7">
                <h3 className="text-base font-semibold text-slate-950">
                  {faq.question}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Schools &amp; Education
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make technology work harder for your school.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Whether you need to improve admissions, automate administration,
              connect systems, build better reporting or explore AI, we can
              start by understanding how your school works today.
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