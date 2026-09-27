import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboards & Analytics",
  description:
    "Turn business data into clear dashboards, reports and actionable insights. Techtrep helps growing businesses improve visibility across sales, finance, operations and performance.",
};

const useCases = [
  {
    title: "Sales & Lead Pipeline",
    description:
      "See where enquiries and opportunities are coming from, what stage they are in and where follow-up is being lost.",
  },
  {
    title: "Finance & Payments",
    description:
      "Bring payment, revenue, transaction and financial activity into clearer management views.",
  },
  {
    title: "Operations",
    description:
      "Track the activity that keeps your organization running, from service delivery and bookings to internal workflows.",
  },
  {
    title: "Customer & Service Activity",
    description:
      "Understand customer interactions, requests, response activity and service performance.",
  },
  {
    title: "Staff Performance",
    description:
      "Create practical views of workloads, completed activities, response times and other operational indicators.",
  },
  {
    title: "Management Reporting",
    description:
      "Replace scattered spreadsheets and manual reporting with consistent dashboards and scheduled reports.",
  },
];

const dashboardAreas = [
  "KPI and management dashboards",
  "Sales and lead reporting",
  "Revenue and payment visibility",
  "Operations and workflow reporting",
  "Customer activity dashboards",
  "Staff and team performance views",
  "Automated management reports",
  "Data consolidation from existing systems",
];

const principles = [
  {
    title: "Start with business questions",
    description:
      "A useful dashboard begins with what management needs to know—not with a collection of charts.",
  },
  {
    title: "Use the data you already have",
    description:
      "We look at your existing systems, spreadsheets and databases before recommending new infrastructure.",
  },
  {
    title: "Make information easy to understand",
    description:
      "Dashboards should help people see what matters quickly and understand what requires attention.",
  },
  {
    title: "Build for decisions",
    description:
      "The goal is not more data. It is better visibility that helps your team act with greater confidence.",
  },
];

const faqs = [
  {
    question: "What is a business dashboard?",
    answer:
      "A business dashboard brings important operational information into one visual view. Instead of checking several spreadsheets, systems or reports, management can see selected KPIs and trends in one place.",
  },
  {
    question: "Can you build a dashboard from our existing systems?",
    answer:
      "Yes. Depending on the systems involved, we can work with databases, spreadsheets, APIs and other business applications to consolidate relevant information into a more useful reporting view.",
  },
  {
    question: "Do we need a large amount of data?",
    answer:
      "No. A dashboard can be valuable even for a smaller organization if it answers an important business question. We focus on useful information rather than building complexity for its own sake.",
  },
  {
    question: "Can reports be automated?",
    answer:
      "Yes. Where the underlying systems support it, reports can be generated or updated automatically so your team spends less time compiling information manually.",
  },
  {
    question: "Can you connect multiple systems?",
    answer:
      "Yes. We can assess opportunities to bring information together from different systems. The exact approach depends on the systems, available APIs, data quality and reporting requirements.",
  },
  {
    question: "How much does a dashboard project cost?",
    answer:
      "Dashboard and analytics projects typically start from ₦250,000 and can range to ₦600,000 or more depending on the number of data sources, dashboards, integrations and reporting requirements.",
  },
];

export default function DashboardsAnalyticsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Dashboards &amp; Analytics
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Turn business data into information you can actually use.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Bring your important business information together into clear
              dashboards, reports and operational views that help management
              understand what is happening and where attention is needed.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Explore Your Reporting Needs
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Discuss a Dashboard Project
              </Link>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">
              Dashboard projects from ₦250,000
            </p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                The problem
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your business already has data. The problem is seeing what it
                means.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                Many organizations have useful information spread across
                spreadsheets, accounting systems, payment platforms, CRMs,
                databases and other business applications.
              </p>

              <p>
                The information exists, but getting a clear picture often
                requires someone to collect it, clean it, combine it and
                prepare another report.
              </p>

              <p>
                That makes reporting slow and can make it difficult for
                management to spot changes early.
              </p>

              <p className="font-medium text-slate-900">
                We help turn scattered operational data into clearer,
                decision-ready information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we solve */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we solve
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Dashboards should answer business questions—not just display
              charts.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We design reporting around the information your management team
              and staff actually need to monitor. That might be revenue,
              enquiries, operations, customer activity, staff workloads or
              another business-specific KPI.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-slate-950">
                  {principle.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Typical use cases
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              See the parts of your business that matter most.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We can design dashboards around a specific department, workflow
              or management requirement—or bring several areas together into a
              broader business view.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-2xl border border-slate-200 p-7 transition-colors hover:border-slate-300"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {useCase.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                What we build
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Reporting designed around the way your business works.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                We can build reporting solutions around your existing
                processes, systems and data sources. The objective is a
                reporting experience that is useful to the people who actually
                need the information.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {dashboardAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39358C] text-xs font-bold text-white"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <span className="text-sm font-medium leading-6 text-slate-800">
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Who it&apos;s for
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                For organizations that need clearer visibility.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Dashboards can be useful for growing organizations where
                management increasingly depends on information from multiple
                people, departments or systems.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Management spends too much time preparing reports.",
                "Important information is spread across several spreadsheets or systems.",
                "Different departments maintain different versions of the same numbers.",
                "Management wants a clearer view of KPIs and operational activity.",
                "Reports are prepared manually every week or month.",
                "The business has data but struggles to turn it into useful insight.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-xl border border-slate-200 p-5"
                >
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#39358C]"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How we implement
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From scattered information to a usable reporting system.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                number: "01",
                title: "Understand",
                text: "Identify the decisions, KPIs and reports that matter.",
              },
              {
                number: "02",
                title: "Assess",
                text: "Review your existing systems, data sources and reporting process.",
              },
              {
                number: "03",
                title: "Design",
                text: "Create the dashboard structure and information hierarchy.",
              },
              {
                number: "04",
                title: "Build",
                text: "Connect the relevant data and develop the reporting views.",
              },
              {
                number: "05",
                title: "Improve",
                text: "Refine the dashboard as your reporting requirements evolve.",
              },
            ].map((step) => (
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

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-7">
            <h3 className="text-lg font-semibold text-slate-950">
              Existing systems can remain part of the solution.
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              You do not necessarily need to replace the software your
              organization already uses. Where practical, we look at how
              existing systems can provide the data needed for better
              reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Pricing
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Start with the reporting problem—not unnecessary complexity.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Dashboard and analytics projects typically start from
                <strong className="font-semibold text-slate-900">
                  {" "}
                  ₦250,000
                </strong>{" "}
                and can range to ₦600,000 or more depending on the scope.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                Pricing depends on factors such as the number of data sources,
                dashboards, integrations, reporting requirements and level of
                automation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <p className="text-sm font-semibold text-slate-500">
                Typical project scope
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "Reporting requirements discovery",
                  "Data-source assessment",
                  "Dashboard design",
                  "Data integration",
                  "KPI and reporting views",
                  "Implementation and handover",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 text-sm font-bold text-[#39358C]"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-10 max-w-3xl text-sm leading-6 text-slate-500">
            Third-party software, hosting, data services or other usage-based
            costs are separate where applicable and will be identified during
            project planning.
          </p>
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
              Questions about dashboards &amp; analytics
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

      {/* Related solutions */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Related solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Dashboards become more useful when your systems work together.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Reporting is often connected to automation, AI and the systems
              generating the underlying information. Explore the related
              solutions below.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link
              href="/solutions/business-automation"
              className="group rounded-2xl border border-slate-200 p-7 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-[#39358C]">
                Business Automation
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Automate repetitive processes and reduce manual work.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore Automation →
              </span>
            </Link>

            <Link
              href="/solutions/ai-business-solutions"
              className="group rounded-2xl border border-slate-200 p-7 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-[#39358C]">
                AI Business Solutions
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Apply AI to customer service, knowledge, documents and
                operations.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore AI Solutions →
              </span>
            </Link>

            <Link
              href="/solutions/custom-technology"
              className="group rounded-2xl border border-slate-200 p-7 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-[#39358C]">
                Custom Technology
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Build software and technology around a business requirement
                that off-the-shelf tools cannot solve.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore Custom Technology →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Get started
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What information does your management team struggle to see?
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Tell us what you currently track, where the information lives and
              what you wish you could see more clearly. We&apos;ll help identify
              a practical reporting approach.
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