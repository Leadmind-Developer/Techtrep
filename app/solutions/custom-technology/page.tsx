import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import ServiceSchema from "@/components/ServiceSchema";

export const metadata = createPageMetadata({
  title: "Custom Technology Solutions",
  description:
    "Build custom business applications, portals, APIs, integrations and workflow platforms around the way your organization actually operates.",
  path: "/solutions/custom-technology",
});

const solutionAreas = [
  {
    title: "Custom Business Applications",
    description:
      "Build internal or customer-facing applications around the workflows, processes and requirements specific to your organization.",
  },
  {
    title: "Business Portals",
    description:
      "Create secure portals for customers, staff, partners, members or other groups that need access to business services and information.",
  },
  {
    title: "Workflow & Operations Systems",
    description:
      "Replace disconnected spreadsheets, manual processes or unsuitable tools with software designed around the way your team actually works.",
  },
  {
    title: "System Integrations",
    description:
      "Connect applications and services so information can move between systems without unnecessary manual intervention.",
  },
  {
    title: "APIs & Backend Services",
    description:
      "Develop the application logic, APIs and backend services required to support custom business processes and digital products.",
  },
  {
    title: "Existing System Extensions",
    description:
      "Extend an existing application when replacing it completely is unnecessary or when the missing functionality can be developed around it.",
  },
];

const signs = [
  "Your team is maintaining complicated spreadsheets to run an important process.",
  "Existing software forces your organization to work around the way it operates.",
  "Several systems need to exchange information but do not work together.",
  "A customer, staff or partner portal would simplify an important process.",
  "You have a business idea that cannot be delivered effectively with off-the-shelf software.",
  "Your organization needs a system designed around a specific workflow or operational requirement.",
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We start with the business problem, users, workflow and desired outcome.",
  },
  {
    number: "02",
    title: "Define",
    text: "We turn the requirement into a practical scope, system architecture and implementation plan.",
  },
  {
    number: "03",
    title: "Design",
    text: "We design the user experience, workflows, data structures and technical components.",
  },
  {
    number: "04",
    title: "Build",
    text: "We develop the system in manageable stages and validate important functionality as we go.",
  },
  {
    number: "05",
    title: "Launch",
    text: "We deploy the solution, help your team adopt it and address issues discovered during rollout.",
  },
  {
    number: "06",
    title: "Improve",
    text: "We can continue improving the system as your business requirements change.",
  },
];

const faqs = [
  {
    question: "When should a business consider custom technology?",
    answer:
      "Custom technology makes sense when an important business requirement cannot be handled effectively by existing software, when several systems need to work together, or when building a tailored solution can materially improve a process.",
  },
  {
    question: "Do you build completely new software?",
    answer:
      "Yes. We can design and develop new web applications, business systems, portals, APIs and other software where the project requirements justify a custom approach.",
  },
  {
    question: "Can you work with our existing software?",
    answer:
      "Yes. A custom project does not always mean replacing everything. We can assess existing systems and determine whether integration, extension or a new supporting application is more practical.",
  },
  {
    question: "Can you build a mobile application?",
    answer:
      "Mobile applications can be considered as part of a broader custom technology project. The appropriate approach depends on the users, business requirements, existing systems and expected usage.",
  },
  {
    question: "How much does custom technology cost?",
    answer:
      "Custom technology projects start from ₦750,000. Larger or more complex systems can range from ₦1.5 million to ₦5 million or more depending on scope, integrations, users, infrastructure and functionality.",
  },
  {
    question: "Can you maintain the system after launch?",
    answer:
      "Yes. After implementation, ongoing support and improvement can be handled through Techtrep Managed Technology or another support arrangement appropriate to the system.",
  },
];

export default function CustomTechnologyPage() {
  return (
     <>
         <ServiceSchema
            name="Custom Technology Solutions"
            description="Techtrep Business Solutions designs and builds custom software, business platforms and technology solutions around the specific requirements of an organization."
            path="/solutions/custom-technology"
            serviceType="Custom Software Development"
           />
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Custom Technology
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              When your business needs software built around the way you
              actually work.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              We design and build practical custom technology for business
              requirements that off-the-shelf software cannot handle
              effectively.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Discuss Your Project
              </Link>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Start with a Free Audit
              </Link>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">
              Custom projects from ₦750,000
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
                Sometimes the problem isn&apos;t your business. It&apos;s the
                software around it.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                Off-the-shelf software is useful because it solves common
                problems for many organizations. But businesses often develop
                processes that are more specific than the software they use.
              </p>

              <p>
                Teams then create workarounds, duplicate information between
                systems, maintain spreadsheets or rely on manual processes to
                fill the gaps.
              </p>

              <p>
                At some point, the workaround itself becomes a business
                problem.
              </p>

              <p className="font-medium text-slate-900">
                That is where a properly scoped custom technology solution can
                make sense.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When custom makes sense */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              When custom makes sense
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Build custom software because there is a business reason—not
              simply because you can.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We do not recommend custom development automatically. We first
              look at whether an existing product, integration or automation
              can solve the problem more efficiently.
            </p>
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

      {/* What we build */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we build
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Technology designed around a real business requirement.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              From internal tools to customer-facing applications, we focus on
              building technology that solves a defined business problem and
              can evolve with the organization.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutionAreas.map((solution) => (
              <div
                key={solution.title}
                className="rounded-2xl border border-slate-200 p-7 transition-colors hover:border-slate-300"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {solution.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology approach */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Our approach
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Good software starts with understanding the business.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Before writing code, we want to understand who will use the
                system, what they are trying to accomplish, where the current
                process breaks down and what success should look like.
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                That helps us avoid building technically impressive software
                that creates more work for the people it is supposed to help.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Business-first requirements",
                  text: "Define the problem and desired outcome before deciding what to build.",
                },
                {
                  title: "Practical architecture",
                  text: "Choose technology based on the project's actual requirements, scale and long-term needs.",
                },
                {
                  title: "Security and access",
                  text: "Consider authentication, authorization, data protection and operational security from the beginning.",
                },
                {
                  title: "Scalable foundations",
                  text: "Build the system so it can evolve rather than forcing every future requirement into the first release.",
                },
                {
                  title: "Maintainable technology",
                  text: "Favor clear structures and documented decisions that make future maintenance easier.",
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

      {/* Process */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How we build
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From business requirement to working technology.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Larger projects are broken into manageable stages so that
              requirements can be validated before unnecessary complexity is
              introduced.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {process.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 p-7"
              >
                <span className="text-sm font-bold text-[#39358C]">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-semibold text-slate-950">
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

      {/* Project examples */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Examples of projects
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                The technology can be different. The principle stays the same.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                We can work on a focused internal application or a broader
                digital product. The right scope depends on the business
                requirement.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Customer portals",
                "Internal management systems",
                "Booking and service platforms",
                "Payment and transaction systems",
                "Membership and subscription systems",
                "Business workflow applications",
                "Data and reporting platforms",
                "API-driven integrations",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <p className="text-sm font-medium leading-6 text-slate-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>
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
                Scope the project around the problem you need to solve.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Custom technology projects start from
                <strong className="font-semibold text-slate-900">
                  {" "}
                  ₦750,000
                </strong>
                .
              </p>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Larger systems can range from ₦1.5 million to ₦5 million or
                more depending on functionality, integrations, users,
                infrastructure and implementation requirements.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                We provide a more specific scope and estimate after
                understanding the requirements. Third-party software,
                infrastructure and usage-based services are separate where
                applicable.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <p className="text-sm font-semibold text-slate-500">
                A typical project considers
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "Users and user roles",
                  "Business workflows",
                  "Core functionality",
                  "Data and integrations",
                  "Security requirements",
                  "Hosting and infrastructure",
                  "Deployment and handover",
                  "Ongoing support requirements",
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
              Questions about custom technology
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
              Custom technology often works alongside automation and ongoing
              support.
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
                Automate repetitive processes before deciding whether custom
                software is necessary.
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
                Add practical AI capabilities where they can improve a
                business process.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore AI Solutions →
              </span>
            </Link>

            <Link
              href="/solutions/managed-technology"
              className="group rounded-2xl border border-slate-200 p-7 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-[#39358C]">
                Managed Technology
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Keep your technology supported, maintained and improving after
                launch.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore Managed Technology →
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
              Have a technology requirement?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tell us what you need your technology to do.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Describe the process you want to improve, the system you wish
              existed or the software that is no longer working well for your
              organization. We&apos;ll help determine the most practical way
              forward.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Discuss Your Project
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
    </>
  );
}