import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technology Solutions for Hotels & Hospitality",
  description:
    "Techtrep helps hotels and hospitality businesses improve guest enquiries, reservations, communication, operations, reporting, connectivity and repetitive workflows with practical technology, automation and AI solutions.",
};

const challenges = [
  {
    title: "Guest Enquiries & Reservations",
    description:
      "Capture enquiries, organize follow-ups and reduce the manual work involved in responding to prospective and returning guests.",
  },
  {
    title: "Guest Communication",
    description:
      "Improve how booking information, confirmations, reminders and other important guest communications move across the business.",
  },
  {
    title: "Front Desk Operations",
    description:
      "Reduce repetitive administrative work around guest information, requests, internal communication and daily front-desk processes.",
  },
  {
    title: "Housekeeping & Maintenance",
    description:
      "Create clearer workflows for room status, maintenance requests, task assignment and communication between operational teams.",
  },
  {
    title: "Payments & Financial Visibility",
    description:
      "Improve visibility into bookings, payments and operational information by connecting relevant systems and reporting processes.",
  },
  {
    title: "Connectivity & Technology Infrastructure",
    description:
      "Improve the hotel's network, Wi-Fi, devices and technology infrastructure so guests and staff can rely on connected services.",
  },
];

const opportunities = [
  "Automated guest enquiry capture and follow-up",
  "Reservation and booking workflows",
  "Guest communication automation",
  "Online booking and enquiry forms",
  "Check-in and administrative workflows",
  "Housekeeping task coordination",
  "Maintenance request workflows",
  "Management dashboards and reporting",
  "Payment and booking information integration",
  "Guest Wi-Fi and network improvements",
  "Device and endpoint installation",
  "AI-assisted guest communication and administration",
];

const signs = [
  "Staff spend too much time answering the same guest questions.",
  "Booking enquiries arrive through multiple channels and are difficult to track.",
  "Front-desk staff repeatedly enter the same information into different systems.",
  "Housekeeping or maintenance requests are communicated manually.",
  "Management reports take too long to prepare.",
  "Guest or staff Wi-Fi is unreliable or difficult to manage.",
  "Different hotel systems do not communicate effectively with one another.",
  "Staff rely on spreadsheets, messaging apps or paper processes for recurring work.",
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We learn how your hotel currently handles enquiries, reservations, guest communication and day-to-day operations.",
  },
  {
    number: "02",
    title: "Identify",
    text: "We identify repetitive work, technology gaps, integration opportunities and infrastructure issues affecting operations.",
  },
  {
    number: "03",
    title: "Prioritize",
    text: "We separate quick operational improvements from larger technology projects and focus on practical opportunities first.",
  },
  {
    number: "04",
    title: "Implement",
    text: "We implement the appropriate automation, integration, infrastructure, dashboard or custom technology solution.",
  },
  {
    number: "05",
    title: "Improve",
    text: "We continue to identify opportunities to improve reliability, efficiency and the guest experience as your business evolves.",
  },
];

const faqs = [
  {
    question: "Can Techtrep work with our existing hotel management software?",
    answer:
      "Yes. We can assess the systems your hotel already uses and determine whether they can be integrated, improved or extended rather than automatically replacing them.",
  },
  {
    question: "Can you automate guest enquiries?",
    answer:
      "Yes. We can design workflows that capture enquiries, organize them, route them to the appropriate team and trigger suitable follow-ups while keeping staff involved where human interaction is important.",
  },
  {
    question: "Can you help improve our hotel's Wi-Fi and network?",
    answer:
      "Yes. Network and infrastructure work can include connectivity assessment, LAN infrastructure, Wi-Fi deployment, device installation, structured cabling and coordination of ISP or last-mile connectivity.",
  },
  {
    question: "Can you automate housekeeping or maintenance workflows?",
    answer:
      "Yes. Where the current process is heavily manual, we can design digital workflows for task assignment, status updates, notifications and management visibility.",
  },
  {
    question: "Can AI be useful for hotels?",
    answer:
      "AI can support selected use cases such as guest communication, internal knowledge access, administrative tasks and reporting. We focus on practical applications with appropriate human oversight.",
  },
  {
    question: "Can you build a custom hotel application?",
    answer:
      "Yes. If existing software cannot adequately address a defined requirement, we can assess and develop a custom application, portal, integration or internal business tool.",
  },
  {
    question: "Where should our hotel start?",
    answer:
      "The Free Technology Audit is a practical starting point. We can review your current technology, operational processes and infrastructure and identify opportunities before you commit to a larger project.",
  },
];

export default function HotelsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Hotels &amp; Hospitality
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology that helps your hotel run more smoothly.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Improve guest enquiries, reservations, communication, operations
              and reporting while reducing the repetitive work that takes your
              staff away from guests.
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
                Discuss Your Hotel
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
                A hotel depends on many moving parts working together.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                A hotel may depend on booking platforms, a property management
                system, payment services, messaging channels, accounting
                software, staff communication tools, Wi-Fi infrastructure and
                many other technologies.
              </p>

              <p>
                When those systems are disconnected, staff can end up
                repeatedly copying information, checking multiple platforms or
                communicating operational requests manually.
              </p>

              <p>
                The result can be slower responses, unnecessary administrative
                work, limited management visibility and technology that does
                not fully support the guest experience.
              </p>

              <p className="font-medium text-slate-900">
                Techtrep helps hospitality businesses identify where better
                technology, automation, integration and infrastructure can
                simplify operations.
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
              Practical technology improvements across hotel operations.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We start with the way your hotel currently operates and identify
              where technology can remove friction, improve communication or
              provide better visibility.
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
                Reduce repetitive work without replacing everything you
                already use.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                In many cases, the opportunity is not buying another
                application. It is connecting existing systems, improving a
                workflow or automating a repetitive task.
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
              From connectivity and infrastructure to automation and AI.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We can improve a specific operational process or work across
              several connected technology needs.
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
                  "Automate repetitive guest, booking, administrative and operational workflows.",
                href: "/solutions/business-automation",
              },
              {
                title: "AI Business Solutions",
                description:
                  "Apply AI to practical guest communication, knowledge, administration and reporting use cases.",
                href: "/solutions/ai-business-solutions",
              },
              {
                title: "Dashboards & Analytics",
                description:
                  "Give management clearer visibility into bookings, payments, operations and key business indicators.",
                href: "/solutions/dashboards-analytics",
              },
              {
                title: "Custom Technology",
                description:
                  "Build portals, applications or integrations around requirements existing hotel software cannot handle.",
                href: "/solutions/custom-technology",
              },
              {
                title: "Managed Technology",
                description:
                  "Keep your hotel's technology, applications and infrastructure supported and improving.",
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

      {/* Infrastructure callout */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Connected hospitality
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your hotel's digital experience depends on the infrastructure
                underneath it.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Guest Wi-Fi, front-desk systems, staff devices, security
                cameras and other connected equipment all depend on reliable
                physical and network infrastructure.
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Techtrep can assess connectivity requirements and help with LAN
                infrastructure, Wi-Fi, device installation, structured cabling
                and ISP or last-mile connectivity as part of a broader
                technology engagement.
              </p>

              <Link
                href="/solutions/networking-infrastructure"
                className="mt-7 inline-flex items-center text-sm font-semibold text-[#39358C] hover:underline"
              >
                Explore Network &amp; Infrastructure →
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
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
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800"
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
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Is this familiar?
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your hotel may have an opportunity to improve if...
              </h2>
            </div>

            <div className="space-y-4">
              {signs.map((sign) => (
                <div
                  key={sign}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5"
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
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How we work with hotels
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with how your hotel operates—not with a technology
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
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
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
                  Not sure where your hotel should start?
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  Tell us where your hotel spends too much time manually, which
                  systems are difficult to work with and where guests or staff
                  experience friction. We&apos;ll identify practical technology
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
              Questions from hotels
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
              Hotels &amp; Hospitality
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make technology work harder for your hotel.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Whether you need to improve guest enquiries, automate operations,
              connect systems, improve connectivity, build reporting or
              explore AI, we can start by understanding how your hotel works
              today.
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