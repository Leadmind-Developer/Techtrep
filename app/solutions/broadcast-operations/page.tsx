
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title:
    "Broadcast Operations Solutions | Playout, Logging, Traffic & Automation",
  description:
    "Connect radio and television operations with broadcast playout automation, off-air logging, compliance, traffic management, CRM, billing, audit and integrated reporting.",
  path: "/solutions/broadcast",
});

const broadcastModules = [
  {
    number: "01",
    category: "Broadcast operations",
    title: "Playout Automation",
    description:
      "Improve the scheduling and execution of broadcast content with workflows for playlists, programme schedules, commercial breaks and playout coordination.",
    capabilities: [
      "Programme and playlist scheduling",
      "Content and commercial break coordination",
      "Playout workflow integration",
      "Operational status and reporting",
    ],
  },
  {
    number: "02",
    category: "Broadcast operations",
    title: "Off-Air Dub & Radio Logger",
    description:
      "Capture and retain broadcast output for programme review, transmission verification, incident investigation and operational recordkeeping.",
    capabilities: [
      "Broadcast output recording",
      "Time-based recording references",
      "Playback and review workflows",
      "Recording retention and retrieval",
    ],
  },
  {
    number: "03",
    category: "Broadcast operations",
    title: "Broadcast Compliance",
    description:
      "Support compliance monitoring and recordkeeping through structured broadcast records, review workflows and access to relevant transmission evidence.",
    capabilities: [
      "Compliance review workflows",
      "Broadcast record retrieval",
      "Programme and transmission monitoring support",
      "Exception tracking and documentation",
    ],
  },
  {
    number: "04",
    category: "Commercial operations",
    title: "Traffic Management",
    description:
      "Organize advertising orders, campaign schedules, spot allocation and commercial instructions while reducing manual coordination between sales and broadcast teams.",
    capabilities: [
      "Advertising orders and campaign records",
      "Spot scheduling and allocation",
      "Commercial instructions and approvals",
      "Campaign execution and reconciliation",
    ],
  },
  {
    number: "05",
    category: "Commercial operations",
    title: "Broadcast CRM",
    description:
      "Manage advertisers, agencies, prospects and commercial relationships in a shared system that connects customer information with sales activity.",
    capabilities: [
      "Advertiser and agency records",
      "Enquiries and sales opportunities",
      "Follow-ups and relationship history",
      "Commercial pipeline visibility",
    ],
  },
  {
    number: "06",
    category: "Commercial operations",
    title: "Billing & Revenue Management",
    description:
      "Connect advertising and commercial transactions with invoicing, payment tracking, account reconciliation and revenue reporting.",
    capabilities: [
      "Advertising and service invoicing",
      "Invoice and payment tracking",
      "Customer account records",
      "Revenue and outstanding balance reports",
    ],
  },
  {
    number: "07",
    category: "Management & accountability",
    title: "Broadcast Audit & Reporting",
    description:
      "Bring relevant operational and commercial records together to support internal reviews, traceability, management oversight and reporting.",
    capabilities: [
      "Operational activity records",
      "Commercial and campaign reporting",
      "Audit trail and exception visibility",
      "Management dashboards",
    ],
  },
];

const connectedWorkflows = [
  {
    step: "01",
    title: "Advertiser enquiry",
    description:
      "Capture a prospective advertiser, agency, campaign requirement and follow-up activity in CRM.",
  },
  {
    step: "02",
    title: "Order & traffic",
    description:
      "Turn approved commercial instructions into campaign records, schedules and traffic requirements.",
  },
  {
    step: "03",
    title: "Playout",
    description:
      "Coordinate campaign and programme information with compatible playout systems and operational workflows.",
  },
  {
    step: "04",
    title: "Logging & verification",
    description:
      "Use available broadcast logs and recorded output to support transmission review and campaign verification.",
  },
  {
    step: "05",
    title: "Billing & reconciliation",
    description:
      "Connect relevant campaign and delivery information with invoicing, payment tracking and account review.",
  },
  {
    step: "06",
    title: "Audit & management",
    description:
      "Provide management with connected records, exceptions, commercial visibility and operational reports.",
  },
];

const outcomes = [
  {
    title: "Less repetitive administration",
    description:
      "Reduce manual data entry, duplicate records and repeated handoffs between departments.",
  },
  {
    title: "Better commercial visibility",
    description:
      "Understand advertiser relationships, campaign activity, billing status and outstanding revenue.",
  },
  {
    title: "Connected operational records",
    description:
      "Make relevant broadcast and commercial information easier to find, review and reconcile.",
  },
  {
    title: "More informed management",
    description:
      "Bring selected operational, commercial and financial information into useful reporting views.",
  },
  {
    title: "Systems that fit your operation",
    description:
      "Assess existing broadcast software and infrastructure before deciding what to integrate, extend or replace.",
  },
  {
    title: "A foundation for improvement",
    description:
      "Start with priority workflows and expand the connected solution as business requirements evolve.",
  },
];

const implementationOptions = [
  {
    title: "Integrate existing systems",
    description:
      "Connect compatible playout, recording, traffic, accounting and business applications through their available interfaces, APIs or supported integration methods.",
  },
  {
    title: "Extend current workflows",
    description:
      "Improve the business processes around existing broadcast equipment and applications without automatically replacing established systems.",
  },
  {
    title: "Develop custom applications",
    description:
      "Build selected portals, operational tools, workflow components, integrations or dashboards when existing products do not adequately meet the requirement.",
  },
];

const challenges = [
  "Advertising bookings and broadcast schedules are managed in disconnected systems.",
  "Commercial teams repeatedly send instructions to traffic or playout teams by email or spreadsheet.",
  "Advertiser records, campaign details and customer account information are duplicated.",
  "Broadcast recordings or transmission evidence are difficult to retrieve when needed.",
  "Campaign delivery, billing and payment records require manual reconciliation.",
  "Management cannot easily see the relationship between commercial activity and broadcast operations.",
  "Operational reports are assembled manually from different departments.",
  "Existing broadcast software does not adequately support the organization's wider business workflows.",
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand your station's broadcast environment, business workflows, existing applications, equipment and operational priorities.",
  },
  {
    number: "02",
    title: "Assess",
    description:
      "Identify system capabilities, integration constraints, workflow gaps, business requirements and the information teams need to exchange.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Define the proposed architecture, integration approach, responsibilities, implementation scope and practical delivery priorities.",
  },
  {
    number: "04",
    title: "Implement",
    description:
      "Configure, integrate or develop the agreed components, then test relevant workflows with your team and existing systems.",
  },
  {
    number: "05",
    title: "Support & improve",
    description:
      "Review the solution after implementation, address agreed support needs and identify further opportunities for improvement.",
  },
];

const faqs = [
  {
    question: "Is this a single, ready-made broadcast software product?",
    answer:
      "The broadcast solution is a connected technology offering that can combine existing software, system integrations, automation and custom applications. The exact components depend on your station's requirements and technical environment. We will establish what is available, what can be integrated and what needs to be developed during discovery.",
  },
  {
    question: "Can you integrate with our existing radio or television playout system?",
    answer:
      "We can assess your existing playout environment and its supported interfaces, APIs, data exchange methods and integration constraints. Integration feasibility depends on the particular product, version, licensing, vendor support and access available.",
  },
  {
    question: "What is an off-air dub or radio logger?",
    answer:
      "A radio logger records broadcast output for later playback and review. Depending on the equipment and configuration, a solution may support recording retrieval, time references, programme review and evidence for operational or compliance workflows. Recording requirements and retention policies should be defined for each station.",
  },
  {
    question: "Can the solution connect advertising traffic to billing?",
    answer:
      "Where the relevant systems support integration, commercial orders and campaign information can be connected with traffic schedules, delivery records and billing workflows. The specific automation and reconciliation rules must be agreed with your team.",
  },
  {
    question: "Can you help us improve broadcast compliance?",
    answer:
      "We can assess compliance-related monitoring, recording, retrieval, review and documentation workflows. The solution can support your organization's compliance processes, but the appropriate regulatory requirements, recording specifications and retention policies must be established with your compliance team.",
  },
  {
    question: "Can we implement only one module first?",
    answer:
      "Yes. A station may begin with a priority requirement such as traffic management, logging, CRM, billing integration or reporting. We can assess how that component fits the wider environment and plan further integration where it is practical.",
  },
  {
    question: "Will we have to replace our existing broadcast equipment?",
    answer:
      "Not necessarily. We first assess your current equipment and software. Where existing systems are suitable and provide the required integration capabilities, retaining them may be the more practical approach. Any replacement recommendation should follow a clear technical and operational assessment.",
  },
  {
    question: "Can the solution support both radio and television?",
    answer:
      "The business workflows—such as commercial management, customer records, billing and reporting—may apply to both. Recording, playout, scheduling and integration requirements differ by broadcast environment, so the implementation must be designed around the station's specific technology.",
  },
  {
    question: "How do we get started?",
    answer:
      "Start with a discussion or Free Technology Audit. We will learn about your current systems, operational challenges and priorities, then identify possible integration, automation or custom development opportunities.",
  },
];

export default function BroadcastSolutionsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Techtrep Broadcast Solutions
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Connect your broadcast, commercial and business operations.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Bring playout automation, off-air logging, compliance, traffic
              management, CRM, billing and audit workflows into a more
              connected broadcast operation—with integration and automation
              designed around your station.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Discuss Your Broadcast Requirements
              </Link>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Request a Free Technology Audit
              </Link>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              For radio stations, television broadcasters and media groups.
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
                The operational challenge
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                A broadcast station is more than its transmission system.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                Behind every radio or television station are commercial,
                technical and administrative workflows. Advertising must be
                sold, scheduled and delivered. Broadcast output may need to be
                recorded and reviewed. Customer accounts must be managed,
                invoices issued and revenue reconciled.
              </p>

              <p>
                These activities often involve different applications,
                departments, equipment and records. When the systems do not
                communicate, teams rely on manual handoffs, duplicate data
                entry, spreadsheets and repeated follow-ups.
              </p>

              <p>
                That makes it harder to trace an advertising order through
                scheduling, broadcast delivery and billing—or to assemble a
                clear picture of operations for management.
              </p>

              <p className="font-medium text-slate-900">
                Techtrep helps broadcasters assess, connect and improve the
                technology and workflows supporting their operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Broadcast solution modules
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              The systems that support your broadcast operation.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Address individual operational needs or plan a connected
              solution across broadcast, commercial and management functions.
              The right implementation depends on your existing environment
              and requirements.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {broadcastModules.map((module) => (
              <article
                key={module.number}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#39358C]">
                    {module.number}
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    {module.category}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-950">
                  {module.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {module.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {module.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-start gap-2.5 text-sm leading-6 text-slate-700"
                    >
                      <span
                        className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#39358C]/10 text-[10px] font-bold text-[#39358C]"
                        aria-hidden="true"
                      >
                        ✓
                      </span>

                      {capability}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Connected workflow */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Connected workflows
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Follow the workflow from advertiser to broadcast and revenue.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                The value of integration is in connecting information across
                departments. With compatible systems and agreed workflows,
                commercial and operational records can move through the
                organization with fewer manual handoffs.
              </p>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                The workflow below illustrates a potential connected
                architecture. Actual integrations depend on the capabilities
                of the systems involved.
              </p>
            </div>

            <div className="space-y-4">
              {connectedWorkflows.map((workflow, index) => (
                <div
                  key={workflow.step}
                  className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#39358C] text-xs font-bold text-white">
                      {workflow.step}
                    </span>

                    <div>
                      <h3 className="text-base font-semibold text-slate-950">
                        {workflow.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {workflow.description}
                      </p>
                    </div>
                  </div>

                  {index < connectedWorkflows.length - 1 && (
                    <div
                      className="absolute -bottom-4 left-[2.15rem] z-10 h-4 w-px bg-[#39358C]/40"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Business value
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Make broadcast operations easier to coordinate and manage.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              A connected solution should address real operational problems.
              We focus on reducing unnecessary manual work, improving access
              to information and helping teams make better-informed decisions.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome) => (
              <div
                key={outcome.title}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <h3 className="text-lg font-semibold text-slate-950">
                  {outcome.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {outcome.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration approach */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Integration &amp; implementation
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Work with the technology you have. Build what is missing.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Broadcast environments differ. Some stations already have
                established playout, recording or traffic systems. Others
                need additional business applications, integrations or
                reporting.
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Techtrep assesses the current environment before recommending
                an approach. We consider technical compatibility, operational
                requirements, implementation complexity and the value of
                retaining existing systems.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center text-sm font-semibold text-[#39358C] hover:underline"
              >
                Discuss Your Broadcast Environment →
              </Link>
            </div>

            <div className="space-y-4">
              {implementationOptions.map((option, index) => (
                <div
                  key={option.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#39358C]/10 text-sm font-bold text-[#39358C]">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {option.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Is this familiar?
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your station may benefit from connected broadcast technology if…
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                These are common areas to investigate during a broadcast
                technology assessment. The right solution depends on your
                station's actual workflow and systems.
              </p>
            </div>

            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39358C]/10 text-xs font-bold text-[#39358C]"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-700">
                    {challenge}
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
              How we work
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with your station's requirements.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We define the operational problem, assess the existing
              technology and agree on a practical implementation before
              committing to a larger project.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {process.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <span className="text-sm font-bold text-[#39358C]">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-semibold text-slate-950">
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

      {/* CTA */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-slate-950 px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  Start with your broadcast requirements
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Let's identify where your broadcast operation can work better.
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  Tell us about your station, existing systems, operational
                  challenges and the workflows you want to connect. We can
                  assess your requirements and identify practical next steps
                  for integration, automation or custom development.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
                >
                  Discuss Your Requirements
                </Link>

                <Link
                  href="/free-technology-audit"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Request a Free Audit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Frequently asked questions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Broadcast solutions, integration and implementation
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 px-6">
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

      {/* Industry link */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Techtrep Media &amp; Entertainment
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Explore technology for your wider media business.
              </h2>

              <p className="mt-5 text-base leading-7 text-white/80">
                Beyond broadcast operations, Techtrep supports media
                organizations with digital platforms, content workflows,
                audience management, business automation, analytics and
                technology infrastructure.
              </p>
            </div>

            <Link
              href="/industries/media-entertainment"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Media &amp; Entertainment →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
