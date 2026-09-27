import Link from "next/link";

const automationAreas = [
  {
    title: "Lead & Enquiry Automation",
    description:
      "Capture enquiries consistently and move them to the right person or process without relying on manual forwarding and follow-up.",
    items: [
      "Website enquiry capture",
      "Lead assignment",
      "Automated notifications",
      "Follow-up workflows",
    ],
  },
  {
    title: "Internal Workflow Automation",
    description:
      "Replace repetitive administrative steps with structured workflows that move information between people and systems automatically.",
    items: [
      "Task routing",
      "Approvals",
      "Status changes",
      "Internal notifications",
    ],
  },
  {
    title: "Data & Document Workflows",
    description:
      "Reduce repetitive data entry and manual document handling by connecting forms, databases and business processes.",
    items: [
      "Data collection",
      "Record creation and updates",
      "Document processing",
      "Automated confirmations",
    ],
  },
  {
    title: "System Integration",
    description:
      "Connect the tools your organization already uses so information does not have to be repeatedly copied between systems.",
    items: [
      "API integrations",
      "CRM and database connections",
      "Payment and business systems",
      "Third-party service integration",
    ],
  },
];

const useCases = [
  {
    title: "Sales & Lead Management",
    description:
      "Capture enquiries, assign leads, notify sales staff and keep follow-up activities moving without relying on memory or spreadsheets.",
  },
  {
    title: "Customer Communication",
    description:
      "Trigger confirmations, reminders, notifications and follow-ups based on what customers do and what happens inside your systems.",
  },
  {
    title: "Approvals",
    description:
      "Move requests through defined approval stages while keeping staff informed about what needs their attention.",
  },
  {
    title: "Operations",
    description:
      "Automate repetitive administrative processes that consume staff time every day or every week.",
  },
  {
    title: "Finance & Administration",
    description:
      "Connect data collection, records, notifications and reporting to reduce repetitive administrative work.",
  },
  {
    title: "Management Reporting",
    description:
      "Automatically collect and organize operational information so management has better visibility without waiting for manual reports.",
  },
];

const signs = [
  "Staff repeatedly enter the same information into different systems.",
  "Important enquiries are manually forwarded or assigned.",
  "Your team spends hours every week compiling reports.",
  "Approvals depend on WhatsApp, email or physical paperwork.",
  "Customers regularly need manual reminders or confirmations.",
  "Employees copy information between spreadsheets and applications.",
  "A process works only because one particular staff member remembers how to do it.",
  "Your business has several systems that do not communicate with each other.",
];

const process = [
  {
    number: "01",
    title: "Map",
    description:
      "We document how the process works today, including the people, systems, decisions and repetitive steps involved.",
  },
  {
    number: "02",
    title: "Identify",
    description:
      "We identify which steps can realistically be automated and where automation would create meaningful operational value.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "We design the workflow, business rules, integrations, notifications and exception handling before implementation.",
  },
  {
    number: "04",
    title: "Automate",
    description:
      "We build, connect and test the automation against real business scenarios before putting it into production.",
  },
  {
    number: "05",
    title: "Improve",
    description:
      "We monitor how the workflow performs and identify further opportunities to simplify or automate the operation.",
  },
];

const faqs = [
  {
    question: "What kinds of business processes can you automate?",
    answer:
      "Potential candidates include lead capture, enquiry routing, approvals, notifications, customer follow-ups, data entry, document workflows, reporting, staff tasks and processes that require information to move between different systems.",
  },
  {
    question: "Do we need to replace our existing software?",
    answer:
      "Not necessarily. Our first preference is usually to work with systems that already serve the business well and connect them where practical. Replacement may only be considered when an existing system is creating a significant limitation.",
  },
  {
    question: "Can you automate processes involving WhatsApp or email?",
    answer:
      "Where supported and appropriate, business communication channels can be incorporated into workflows. The exact approach depends on the platform, available APIs, account configuration and the type of communication involved.",
  },
  {
    question: "Will automation eliminate the need for staff?",
    answer:
      "The objective is normally to reduce repetitive administrative work, not simply remove people from a process. Good automation allows staff to spend more time on activities that require judgment, communication and relationship management.",
  },
  {
    question: "How much does Business Automation cost?",
    answer:
      "Automation projects start from ₦300,000. The final cost depends on the number and complexity of workflows, systems involved, integrations, business rules and testing requirements.",
  },
  {
    question: "How do we know what should be automated?",
    answer:
      "That is exactly what the Free Technology Audit is designed to help identify. We can examine your current processes and highlight practical opportunities where automation could reduce repetitive work or improve reliability.",
  },
];

export const metadata = {
  title: "Business Automation",
  description:
    "Automate repetitive business processes, workflows, approvals, notifications and system integrations with Techtrep Business Solutions.",
};

export default function BusinessAutomationPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#39358C] hover:text-[#2f2b76]"
            >
              <span aria-hidden="true">←</span>
              All Solutions
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Business Automation
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Stop spending people&apos;s time on work software can do.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              We find the repetitive work slowing your organization down and
              turn it into reliable digital workflows that save time, reduce
              errors and keep your business moving.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Find What You Can Automate
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Discuss an Automation Project
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <span>Starting from ₦300,000</span>
              <span>•</span>
              <span>Workflow-focused</span>
              <span>•</span>
              <span>Built around your existing operation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                The opportunity
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your team should not have to repeatedly move information
                around by hand.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                Every business has repetitive work. Someone receives an
                enquiry, copies the details into a spreadsheet, sends an
                email, updates another system and reminds a colleague to
                follow up.
              </p>

              <p>
                None of those individual tasks may seem significant. But
                repeated dozens or hundreds of times, they consume staff
                hours, introduce errors and create opportunities for things
                to be forgotten.
              </p>

              <p>
                Automation allows the systems involved to handle predictable
                steps automatically while people remain responsible for
                decisions, exceptions and relationships.
              </p>

              <p className="font-semibold text-slate-900">
                The goal is not to automate everything. It is to automate
                the right things.
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
              Does this sound familiar?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your business may already have automation opportunities.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Look at the work your team performs repeatedly. These are often
              the first places worth investigating.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {signs.map((sign) => (
              <div
                key={sign}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
              >
                <span
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39358C] text-xs text-white"
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

      {/* Automation areas */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we automate
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Connect the steps that currently depend on manual work.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Automation can be simple or sophisticated. We choose the
              approach based on the process rather than forcing every
              organization into the same technology.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {automationAreas.map((area) => (
              <article
                key={area.title}
                className="rounded-2xl border border-slate-200 p-7 sm:p-8"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {area.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {area.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Common use cases
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Where automation can make a practical difference.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {useCase.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service levels */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Automation projects
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start small or automate a larger operation.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We offer two starting points for automation work. The exact
              scope is defined after we understand your processes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-7 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#39358C]">
                Automation Starter
              </p>

              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                From ₦300,000
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Ideal when you have one clearly defined repetitive process
                that is consuming staff time or creating avoidable manual
                work.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  "One focused workflow or automation opportunity",
                  "Business process mapping",
                  "Automation design",
                  "Required integration or system connection",
                  "Testing and deployment",
                  "Basic documentation and handover",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border-2 border-[#39358C] p-7 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#39358C]">
                Automation Growth
              </p>

              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                From ₦600,000
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Designed for organizations with multiple connected
                processes, systems or departments that need a broader
                automation layer.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  "Multiple related workflows",
                  "Cross-system integrations",
                  "Advanced business rules",
                  "Automated notifications and routing",
                  "Operational visibility and tracking",
                  "Testing, deployment and documentation",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            Third-party platform, messaging, cloud, AI and other usage-based
            charges are normally billed separately where applicable.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Our process
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              We automate the process—not just the task.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Understanding the entire workflow helps us avoid automating a
              broken or unnecessary process.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {process.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="text-sm font-bold tracking-[0.15em] text-[#39358C]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
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

      {/* Related solutions */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Go further
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Automation often creates the foundation for the next improvement.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link
              href="/solutions/ai-business-solutions"
              className="rounded-2xl border border-slate-200 p-6 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-bold text-slate-950">
                AI Business Solutions
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Add AI to customer service, knowledge, documents and
                operational workflows where it creates practical value.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#39358C]">
                Explore AI Solutions →
              </span>
            </Link>

            <Link
              href="/solutions/dashboards-analytics"
              className="rounded-2xl border border-slate-200 p-6 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Dashboards &amp; Analytics
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Turn the information flowing through your processes into
                useful operational and management visibility.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#39358C]">
                Explore Dashboards →
              </span>
            </Link>

            <Link
              href="/solutions/managed-technology"
              className="rounded-2xl border border-slate-200 p-6 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Managed Technology
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Keep your automation and business technology maintained,
                monitored and improved after implementation.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#39358C]">
                Explore Managed Technology →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              FAQ
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Questions about Business Automation
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-slate-950">
                  <span>{faq.question}</span>

                  <span
                    className="shrink-0 text-xl font-normal text-slate-400 transition-transform group-open:rotate-45"
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

      {/* Final CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Find your first automation opportunity
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tell us what your staff are doing manually every day.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/80">
              We&apos;ll help you identify what can be automated, what should
              remain human and where technology can make the biggest
              practical difference.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                Talk to Techtrep
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}