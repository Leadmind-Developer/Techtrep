import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Managed Technology",
  description:
    "Keep your business technology supported, maintained and improving. Techtrep provides ongoing technology support, monitoring, maintenance, security guidance and improvements for growing businesses.",
};

const supportAreas = [
  {
    title: "Technology Support",
    description:
      "Get help with technology issues affecting your business, users, systems and day-to-day operations.",
  },
  {
    title: "Website & Application Maintenance",
    description:
      "Keep business websites and applications updated, monitored and maintained after launch.",
  },
  {
    title: "Cloud & Infrastructure",
    description:
      "Monitor and maintain relevant cloud services, hosting environments, deployments and infrastructure.",
  },
  {
    title: "System Monitoring",
    description:
      "Identify availability, performance or operational issues before they become larger business problems.",
  },
  {
    title: "Security & Technology Reviews",
    description:
      "Review technology practices, access controls and security considerations as your systems evolve.",
  },
  {
    title: "Continuous Improvement",
    description:
      "Make practical improvements to your technology instead of allowing systems to become outdated or neglected.",
  },
];

const signs = [
  "Your business depends on technology but does not have a dedicated technology team.",
  "Small technology problems repeatedly interrupt your staff.",
  "Your website, applications or cloud systems need regular maintenance.",
  "You have several technology providers but no one coordinating the bigger picture.",
  "Technology issues are handled only when something breaks.",
  "You need someone who understands both the technology and the business behind it.",
];

const plans = [
  {
    name: "Techtrep Care",
    price: "₦50,000",
    description:
      "For smaller businesses that need dependable access to technology support and routine maintenance.",
    features: [
      "Technology support",
      "Routine website/application maintenance",
      "Basic technology review",
      "Issue troubleshooting",
      "Monthly technology check-in",
    ],
  },
  {
    name: "Techtrep Growth",
    price: "₦100,000",
    description:
      "For growing organizations with more systems and a greater need for proactive technology management.",
    features: [
      "Everything in Techtrep Care",
      "Proactive system review",
      "Cloud and infrastructure oversight",
      "Security and access review",
      "Technology improvement planning",
      "Priority support",
    ],
  },
  {
    name: "Techtrep Business",
    price: "₦200,000",
    description:
      "For organizations that depend heavily on technology and need a more involved technology partner.",
    features: [
      "Everything in Techtrep Growth",
      "Broader technology oversight",
      "Application and integration support",
      "Regular management reporting",
      "Technology roadmap support",
      "Higher-touch ongoing engagement",
    ],
  },
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "Review your technology environment, business priorities and recurring issues.",
  },
  {
    number: "02",
    title: "Stabilize",
    text: "Address important issues and establish a clearer baseline for your systems.",
  },
  {
    number: "03",
    title: "Monitor",
    text: "Keep an eye on relevant systems, services and operational technology.",
  },
  {
    number: "04",
    title: "Maintain",
    text: "Handle routine updates, fixes, reviews and technology housekeeping.",
  },
  {
    number: "05",
    title: "Improve",
    text: "Identify practical improvements as your organization and technology needs change.",
  },
];

const faqs = [
  {
    question: "What is Managed Technology?",
    answer:
      "Managed Technology is an ongoing technology partnership where Techtrep helps support, maintain, monitor and improve the technology your business relies on.",
  },
  {
    question: "Is this the same as traditional IT support?",
    answer:
      "Not necessarily. Traditional IT support often focuses on fixing individual problems. Managed Technology takes a broader view by combining support with maintenance, monitoring, technology reviews and continuous improvement.",
  },
  {
    question: "Do I need a dedicated IT department to use this service?",
    answer:
      "No. The service is particularly useful for organizations that depend on technology but do not have the internal resources to manage every aspect of their technology environment.",
  },
  {
    question: "Can you manage systems Techtrep did not build?",
    answer:
      "Yes, subject to technical access, compatibility and the scope of the engagement. We can assess existing websites, applications, cloud environments and other technology before recommending an appropriate support arrangement.",
  },
  {
    question: "Can I start with a project and move to managed support?",
    answer:
      "Yes. A business can begin with a website, automation, dashboard, AI or custom technology project and then move into an ongoing support arrangement when appropriate.",
  },
  {
    question: "What is included in the monthly fee?",
    answer:
      "The exact scope depends on the selected plan and your technology environment. Support, maintenance, reviews, monitoring and improvement activities are defined as part of the engagement.",
  },
  {
    question: "Are third-party software and cloud costs included?",
    answer:
      "No. Third-party subscriptions, cloud usage, messaging, AI services and other external platform costs are generally separate unless specifically included in an agreed scope.",
  },
];

export default function ManagedTechnologyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Managed Technology
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Keep your technology working while your business keeps growing.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Ongoing technology support, maintenance, monitoring and
              improvement for organizations that rely on technology but do not
              want to manage every technical detail themselves.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Discuss Managed Technology
              </Link>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Start with a Free Audit
              </Link>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">
              Plans from ₦50,000/month
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
                Technology problems become business problems when nobody owns
                them.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                A website goes down. An application needs an update. A cloud
                service starts behaving differently. A user loses access. A
                security setting needs attention.
              </p>

              <p>
                Individually, these may look like small technical issues. But
                repeated interruptions can consume staff time and distract
                management from running the business.
              </p>

              <p>
                The bigger problem is often that technology only receives
                attention when something breaks.
              </p>

              <p className="font-medium text-slate-900">
                Managed Technology gives your organization an ongoing
                technology partner instead of waiting for every problem to
                become urgent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signs */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Is this familiar?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your organization may need ongoing technology support if...
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {signs.map((sign) => (
              <div
                key={sign}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#39358C] text-xs font-bold text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <p className="text-sm leading-6 text-slate-700">{sign}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we manage */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we manage
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Practical technology support across the systems your business
              depends on.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              The exact scope is tailored to your organization. We focus on the
              technology areas that have the greatest impact on your daily
              operations.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {supportAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl border border-slate-200 p-7 transition-colors hover:border-slate-300"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ongoing */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Beyond support tickets
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                The goal is not just to fix problems. It is to keep improving
                the technology environment.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Proactive maintenance",
                  text: "Deal with routine maintenance and technology housekeeping before they become disruptive.",
                },
                {
                  title: "Better visibility",
                  text: "Understand what technology your organization relies on and where attention is needed.",
                },
                {
                  title: "Fewer recurring problems",
                  text: "Look beyond individual incidents and identify underlying issues that keep coming back.",
                },
                {
                  title: "Technology planning",
                  text: "Make technology decisions with a clearer understanding of business priorities and future requirements.",
                },
                {
                  title: "Continuous improvement",
                  text: "Gradually improve systems, workflows and technology instead of waiting for a major technology project.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Managed Technology plans
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Ongoing support that can grow with your organization.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Choose an engagement level based on the complexity of your
              technology environment and the level of ongoing support you need.
              The final scope is agreed before the engagement begins.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {plan.name}
                </h3>

                <p className="mt-4 text-3xl font-bold tracking-tight text-[#39358C]">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-slate-500">
                    /month
                  </span>
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>

                <div className="mt-7 border-t border-slate-200 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Includes
                  </p>

                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 text-sm font-bold text-[#39358C]"
                          aria-hidden="true"
                        >
                          ✓
                        </span>

                        <span className="text-sm leading-6 text-slate-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-[#39358C] hover:text-[#39358C]"
                >
                  Discuss {plan.name}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm leading-6 text-slate-600">
              <strong className="font-semibold text-slate-900">
                Important:
              </strong>{" "}
              Monthly plans cover the agreed Techtrep service scope. Major
              development projects, new systems, third-party subscriptions,
              cloud usage, messaging, AI services and other usage-based costs
              are separate unless specifically included in an agreed scope.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How it works
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with your current technology environment.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We first understand what your organization depends on and where
              technology is creating friction. From there, we establish an
              appropriate support and improvement scope.
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

      {/* Relationship */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-slate-950 px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  A long-term technology relationship
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  You shouldn&apos;t have to find a new technology person every
                  time something changes.
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  As we work with your organization, we build a better
                  understanding of your systems, priorities and recurring
                  challenges. That context helps technology decisions become
                  more practical over time.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
              >
                Talk to Techtrep
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
              Questions about Managed Technology
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
              Ongoing technology support can follow any of our project
              solutions.
            </h2>
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
                Automate repetitive processes and reduce unnecessary manual
                work.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore Automation →
              </span>
            </Link>

            <Link
              href="/solutions/dashboards-analytics"
              className="group rounded-2xl border border-slate-200 p-7 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-[#39358C]">
                Dashboards &amp; Analytics
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Turn operational data into clearer reporting and management
                visibility.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore Dashboards →
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
                Build technology around business requirements that existing
                software cannot handle effectively.
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
              Ongoing technology support
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let&apos;s make your technology easier to manage.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Tell us what technology your organization depends on, what keeps
              going wrong and where your team needs more support. We&apos;ll
              help define an appropriate ongoing technology arrangement.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Discuss Managed Technology
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