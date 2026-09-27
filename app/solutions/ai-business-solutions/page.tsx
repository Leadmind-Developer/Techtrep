import Link from "next/link";

const solutionAreas = [
  {
    title: "AI Assistants",
    description:
      "Give customers, staff or members access to useful information through AI-powered assistants designed around your organization's knowledge and processes.",
    items: [
      "Customer-facing AI assistants",
      "Internal staff assistants",
      "Business knowledge assistants",
      "Website and portal AI experiences",
    ],
  },
  {
    title: "AI Customer Support",
    description:
      "Handle common questions and routine customer interactions with AI while allowing your team to take over when human attention is needed.",
    items: [
      "Frequently asked questions",
      "Service information",
      "Initial enquiry handling",
      "Human handoff workflows",
    ],
  },
  {
    title: "Document & Knowledge Automation",
    description:
      "Use AI to extract, summarize, classify and work with business information that would otherwise require significant manual effort.",
    items: [
      "Document processing",
      "Information extraction",
      "Summarization",
      "Knowledge search",
    ],
  },
  {
    title: "AI-Powered Operations",
    description:
      "Combine AI with business workflows to help teams process information, make routine decisions and complete operational tasks faster.",
    items: [
      "AI-assisted workflows",
      "Content and communication assistance",
      "Classification and routing",
      "Workflow decision support",
    ],
  },
];

const useCases = [
  {
    title: "Customer Enquiries",
    description:
      "Answer common questions, collect initial information and route more complex enquiries to the appropriate team.",
  },
  {
    title: "Internal Knowledge",
    description:
      "Help employees find information from approved business documents, policies, procedures and internal knowledge.",
  },
  {
    title: "Documents",
    description:
      "Extract useful information from documents and reduce the manual effort involved in reviewing or organizing large volumes of information.",
  },
  {
    title: "Communication",
    description:
      "Help teams draft, summarize and organize routine business communication while keeping humans responsible for important decisions.",
  },
  {
    title: "Operations",
    description:
      "Use AI inside existing workflows to classify information, suggest actions and reduce repetitive knowledge work.",
  },
  {
    title: "Reporting",
    description:
      "Make operational information easier to interpret by combining structured business data with AI-assisted analysis and summaries.",
  },
];

const signs = [
  "Your staff repeatedly answer the same customer questions.",
  "Employees spend significant time searching through documents or information.",
  "Large numbers of documents need to be reviewed, classified or summarized.",
  "Your team spends too much time drafting routine communication.",
  "You have useful business data but extracting insights requires manual work.",
  "You want an AI assistant but need it connected to your actual business information.",
  "You want to introduce AI but are unsure where it would create genuine value.",
  "You need AI inside an existing workflow rather than as another disconnected application.",
];

const principles = [
  {
    title: "Start with the problem",
    description:
      "We first identify the business problem and determine whether AI is actually the appropriate solution.",
  },
  {
    title: "Use your business context",
    description:
      "Where appropriate, AI solutions can be connected to approved business information, workflows and systems so they are more useful in context.",
  },
  {
    title: "Keep humans in control",
    description:
      "Important business decisions should have appropriate human oversight. AI should support your team rather than create uncontrolled decisions.",
  },
  {
    title: "Protect information",
    description:
      "We consider access, data handling, permissions and the sensitivity of information when designing AI-enabled systems.",
  },
];

const process = [
  {
    number: "01",
    title: "Identify",
    description:
      "We understand the business problem, the users involved, the information available and the outcome you want to improve.",
  },
  {
    number: "02",
    title: "Assess",
    description:
      "We determine whether AI is appropriate and select a practical approach based on the required capability, cost and risk.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "We define the AI experience, data sources, workflow, permissions, integrations and human review points.",
  },
  {
    number: "04",
    title: "Implement",
    description:
      "We build and integrate the solution, test it against realistic scenarios and configure the required safeguards.",
  },
  {
    number: "05",
    title: "Improve",
    description:
      "We monitor how the solution performs and refine the experience as your business requirements and AI capabilities evolve.",
  },
];

const faqs = [
  {
    question: "Do I need to understand AI before working with Techtrep?",
    answer:
      "No. You do not need to know how AI works technically. We start with your business problem and explain the technology in practical terms before recommending an implementation.",
  },
  {
    question: "Can AI work with our existing business systems?",
    answer:
      "Often, yes. Depending on the systems and available integrations, AI can be connected to websites, databases, business applications, documents and automated workflows.",
  },
  {
    question: "Can you build an AI chatbot for our business?",
    answer:
      "Yes. We can build AI-powered customer or internal assistants around appropriate business information and workflows. The exact design depends on the users, information sources, channels and actions the assistant needs to support.",
  },
  {
    question: "Will AI replace our employees?",
    answer:
      "The focus of our solutions is generally to augment employees and reduce repetitive knowledge work. Human involvement remains important for sensitive decisions, exceptions and activities requiring judgment or relationships.",
  },
  {
    question: "How much do AI Business Solutions cost?",
    answer:
      "AI Business Solutions start from ₦500,000. The final cost depends on the AI capability required, integrations, data sources, workflow complexity, user experience and implementation requirements.",
  },
  {
    question: "Are AI usage costs included?",
    answer:
      "Implementation pricing covers the Techtrep project scope. AI model usage, cloud infrastructure, messaging platforms and other third-party services may have separate usage-based charges, which are normally billed separately.",
  },
  {
    question: "Can we start with a small AI project?",
    answer:
      "Yes. A focused use case is often a practical way to introduce AI, measure its usefulness and learn what should be expanded before making a larger investment.",
  },
];

export const metadata = {
  title: "AI Business Solutions",
  description:
    "Practical AI business solutions including AI assistants, customer support, document automation, knowledge systems and AI-powered workflows from Techtrep.",
};

export default function AIBusinessSolutionsPage() {
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
              AI Business Solutions
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Use AI where it creates real business value.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              We help organizations apply AI to customer service, business
              knowledge, documents, reporting and operations—without adding
              AI simply because it is fashionable.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Explore Your AI Opportunities
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Discuss an AI Project
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <span>Starting from ₦500,000</span>
              <span>•</span>
              <span>Practical use cases</span>
              <span>•</span>
              <span>Human oversight</span>
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
                AI is most useful when it solves a specific business problem.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                Businesses are being encouraged to “use AI” for almost
                everything. But adding an AI tool without a clear purpose can
                create another system for employees to learn without solving
                the underlying problem.
              </p>

              <p>
                A better starting point is to look at the work your
                organization already performs. Where are employees spending
                time reading, searching, summarizing, classifying, responding
                or processing information?
              </p>

              <p>
                Those activities can sometimes be good candidates for AI,
                particularly when the process involves large amounts of
                information or predictable knowledge work.
              </p>

              <p className="font-semibold text-slate-900">
                We focus on the business outcome first and select AI
                technology only when it is the right tool for the job.
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
              Potential opportunities
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your organization may already have useful AI use cases.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              If any of these situations sound familiar, there may be an
              opportunity to investigate.
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

      {/* Solution areas */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we build
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Practical AI solutions for real business workflows.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We can build AI capabilities as standalone experiences or
              integrate them into the systems and workflows your organization
              already uses.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {solutionAreas.map((area) => (
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
              Where businesses are exploring practical AI.
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

      {/* Principles */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Responsible implementation
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Useful AI also needs sensible boundaries.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                AI systems can produce incorrect information, expose
                sensitive data if poorly configured or make inappropriate
                decisions when given the wrong level of autonomy. We design
                around those realities.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-2xl border border-slate-200 p-6"
                >
                  <h3 className="text-lg font-bold text-slate-950">
                    {principle.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {principle.description}
                  </p>
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
              Implementation
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From AI idea to useful business capability.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We start with the business requirement and work toward an
              implementation that is useful, maintainable and appropriate
              for the organization.
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

      {/* Pricing */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Investment
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              AI Business Solutions
            </h2>

            <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              From ₦500,000
            </p>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Final pricing depends on the AI capability, number of users,
              data sources, integrations, workflow complexity and
              implementation requirements.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              AI model usage, cloud infrastructure, messaging services and
              other third-party usage-based costs may be billed separately.
            </p>

            <Link
              href="/free-technology-audit"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
            >
              Explore Your AI Opportunity
            </Link>
          </div>
        </div>
      </section>

      {/* Related solutions */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Related solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              AI works even better when connected to your operation.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link
              href="/solutions/business-automation"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Business Automation
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Connect AI capabilities to workflows that move information
                and tasks through your organization.
              </p>

              <span className="mt-5 inline-flex text-sm font-semibold text-[#39358C]">
                Explore Business Automation →
              </span>
            </Link>

            <Link
              href="/solutions/dashboards-analytics"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Dashboards &amp; Analytics
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Combine operational data and AI-assisted analysis to improve
                business visibility.
              </p>

              <span className="mt-5 inline-flex text-sm font-semibold text-[#39358C]">
                Explore Dashboards →
              </span>
            </Link>

            <Link
              href="/solutions/custom-technology"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Custom Technology
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Build AI capabilities directly into a custom application or
                business platform.
              </p>

              <span className="mt-5 inline-flex text-sm font-semibold text-[#39358C]">
                Explore Custom Technology →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              FAQ
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Questions about AI Business Solutions
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
              Start with the business problem
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find out where AI could actually help your organization.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/80">
              Tell us what your team spends time doing, what information is
              difficult to manage and which processes you want to improve.
              We&apos;ll help identify practical opportunities for AI and
              automation.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Start a Free Technology Audit
              </Link>

              <Link
                href="/solutions/business-automation"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Business Automation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
