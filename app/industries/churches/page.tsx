import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Technology Solutions for Churches",
  description:
    "Technology solutions for churches and faith organizations covering communication, digital workflows, events, reporting, connectivity and operational automation.",
  path: "/industries/churches",
});

const challenges = [
  {
    title: "Member & Visitor Enquiries",
    description:
      "Capture enquiries, organize follow-ups and make it easier for staff or volunteers to respond consistently.",
  },
  {
    title: "Communication",
    description:
      "Improve how announcements, reminders, event information and other routine communications move across the organization.",
  },
  {
    title: "Membership & Administration",
    description:
      "Reduce repetitive administrative work around forms, records, approvals, notifications and internal coordination.",
  },
  {
    title: "Events & Registration",
    description:
      "Simplify event registration, attendance workflows, reminders and post-event communication.",
  },
  {
    title: "Giving & Payment Workflows",
    description:
      "Improve visibility around giving and payment processes and connect appropriate information with operational reporting.",
  },
  {
    title: "Connectivity & Infrastructure",
    description:
      "Improve internet connectivity, LAN, Wi-Fi, devices, security-camera infrastructure and other technology used across your facilities.",
  },
];

const opportunities = [
  "Visitor enquiry capture and follow-up",
  "Membership enquiry workflows",
  "Online forms and registration",
  "Event registration and reminders",
  "Communication automation",
  "Volunteer coordination workflows",
  "Internal approval processes",
  "Giving and payment reporting",
  "Attendance and event dashboards",
  "Website and digital presence improvements",
  "AI-assisted administrative tasks",
  "LAN, Wi-Fi and device deployment",
];

const signs = [
  "Staff or volunteers repeatedly answer the same questions.",
  "Visitor or membership enquiries arrive through different channels and are difficult to track.",
  "Event registrations are managed manually across spreadsheets or messaging platforms.",
  "Announcements and reminders require repeated manual effort.",
  "Management reports take too long to prepare.",
  "Important administrative processes depend heavily on spreadsheets or paper.",
  "Internet or Wi-Fi problems affect services, staff or events.",
  "Different technology systems are disconnected and information has to be entered more than once.",
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We learn how your organization currently handles enquiries, communication, events, administration and reporting.",
  },
  {
    number: "02",
    title: "Identify",
    text: "We identify repetitive tasks, technology gaps, integration opportunities and infrastructure issues affecting operations.",
  },
  {
    number: "03",
    title: "Prioritize",
    text: "We separate quick improvements from larger projects and focus first on practical opportunities.",
  },
  {
    number: "04",
    title: "Implement",
    text: "We implement the appropriate automation, integration, infrastructure, dashboard or custom technology solution.",
  },
  {
    number: "05",
    title: "Improve",
    text: "We review what is working and identify additional opportunities to improve efficiency, communication and operational visibility.",
  },
];

const faqs = [
  {
    question: "Can Techtrep work with the systems our organization already uses?",
    answer:
      "Yes. We can assess your existing websites, communication tools, payment systems, databases and other applications to determine whether they can be integrated, improved or extended.",
  },
  {
    question: "Can you automate event registration and reminders?",
    answer:
      "Yes. We can design workflows for registration, confirmations, reminders, notifications and reporting while keeping the process appropriate for your organization's needs.",
  },
  {
    question: "Can you help manage membership enquiries?",
    answer:
      "Yes. We can help capture enquiries, organize follow-ups and connect relevant communication or administrative workflows.",
  },
  {
    question: "Can you improve our church website?",
    answer:
      "Yes. Website development and improvement can form part of a broader digital foundation project, particularly where the website needs to support enquiries, registration, communication or other workflows.",
  },
  {
    question: "Can you improve our Wi-Fi and network?",
    answer:
      "Yes. Network and infrastructure work can include LAN installation, Wi-Fi deployment, structured cabling, device installation, security-camera cabling and ISP or last-mile connectivity.",
  },
  {
    question: "Can AI be useful for faith organizations?",
    answer:
      "AI can support selected administrative, communication, knowledge and reporting tasks. We focus on practical use cases with appropriate human oversight and clear boundaries.",
  },
  {
    question: "Can you build a custom member or event portal?",
    answer:
      "Yes. Where existing platforms cannot adequately address a defined requirement, we can assess and develop a custom portal, application, integration or internal business tool.",
  },
  {
    question: "Where should our organization start?",
    answer:
      "The Free Technology Audit is a practical starting point. We can review your current technology environment and operational processes and identify opportunities before you commit to a larger project.",
  },
];

export default function ChurchesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Churches &amp; Faith Organizations
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology that makes your organization easier to run.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Improve communication, administration, events, membership
              workflows, reporting and technology infrastructure while reducing
              repetitive work for staff and volunteers.
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
                Discuss Your Organization
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
                Growing organizations often end up with technology spread
                across many tools.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                A church or faith organization may use a website, messaging
                platforms, registration tools, payment services, spreadsheets,
                presentation systems, databases and other applications.
              </p>

              <p>
                These tools can be useful individually while still creating
                additional administrative work when information has to be
                entered, copied or communicated manually.
              </p>

              <p>
                Event teams may maintain separate registration lists.
                Volunteers may communicate through different channels.
                Administrative teams may spend significant time preparing
                reports or following up on routine enquiries.
              </p>

              <p className="font-medium text-slate-900">
                Techtrep helps organizations identify where technology can
                simplify these processes and improve operational visibility.
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
              Practical technology improvements across your operations.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Every organization has different processes. We start with the
              way your teams currently work and identify where technology can
              remove friction.
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
                Give your staff and volunteers more time for work that
                requires people.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                We look for repetitive processes that can be simplified through
                better systems, automation, integration, reporting or
                carefully selected AI capabilities.
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

      {/* Events */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Events &amp; engagement
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Make recurring events easier to organize.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Conferences, programs, meetings and other events can create a
                significant amount of administrative work before and after the
                event itself.
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Technology can help bring registration, confirmations,
                reminders, attendance information and reporting into a more
                consistent workflow.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
              <p className="text-sm font-semibold text-slate-950">
                Possible workflow improvements
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Online event registration",
                  "Automated confirmations",
                  "Event reminders",
                  "Attendance capture",
                  "Volunteer coordination",
                  "Post-event communication",
                  "Event reporting",
                  "Integration with existing systems",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39358C] text-xs font-bold text-white"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span className="text-sm font-medium text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Techtrep solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From digital infrastructure to automation and AI.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We can improve a specific workflow or work across several
              connected technology needs.
            </p>
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
                  "Automate repetitive communication, registration, administration and operational workflows.",
                href: "/solutions/business-automation",
              },
              {
                title: "AI Business Solutions",
                description:
                  "Apply AI to practical communication, knowledge, administration and reporting use cases.",
                href: "/solutions/ai-business-solutions",
              },
              {
                title: "Dashboards & Analytics",
                description:
                  "Create clearer visibility into registrations, events, giving and operational activity.",
                href: "/solutions/dashboards-analytics",
              },
              {
                title: "Custom Technology",
                description:
                  "Build portals, applications or integrations around requirements existing platforms cannot handle.",
                href: "/solutions/custom-technology",
              },
              {
                title: "Managed Technology",
                description:
                  "Keep your organization's technology, applications and infrastructure supported and maintained.",
                href: "/solutions/managed-technology",
              },
            ].map((solution) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-colors hover:border-[#39358C]"
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

      {/* Infrastructure */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Connected facilities
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Reliable connectivity supports modern facilities and events.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Internet connectivity, LAN, Wi-Fi, presentation devices,
                security cameras and other connected equipment can all be part
                of the technology environment your organization relies on.
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Techtrep can assess infrastructure requirements and help with
                LAN installation, Wi-Fi, structured cabling, endpoint and
                device installation, security-camera cabling and ISP or
                last-mile connectivity.
              </p>

              <Link
                href="/solutions/networking-infrastructure"
                className="mt-7 inline-flex items-center text-sm font-semibold text-[#39358C] hover:underline"
              >
                Explore Network &amp; Infrastructure →
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
              <p className="text-sm font-semibold text-slate-950">
                Infrastructure can include
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "ISP connectivity",
                  "Last-mile connectivity",
                  "LAN installation",
                  "Wi-Fi deployment",
                  "Network devices",
                  "Endpoint installation",
                  "Structured cabling",
                  "Security-camera cabling",
                  "Solar technology cabling",
                  "Network support",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
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
                Your organization may have an opportunity to improve if...
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
              How we work with organizations
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with how your organization operates—not with a technology
              product.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We understand the existing environment first, then recommend the
              technology approach that fits the requirement.
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
                  Not sure where your organization should start?
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  Tell us where staff or volunteers spend too much time
                  manually, which systems are difficult to work with and where
                  technology creates friction. We&apos;ll identify practical
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
              Questions from churches &amp; faith organizations
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
              Churches &amp; Faith Organizations
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make technology work harder for your organization.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Whether you need to improve communication, simplify
              administration, streamline events, connect systems, improve
              connectivity, build reporting or explore AI, we can start by
              understanding how your organization works today.
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