import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technology Solutions for Clinics & Healthcare",
  description:
    "Techtrep helps clinics and healthcare organizations improve patient enquiries, appointments, communication, administration, reporting, connectivity and repetitive workflows with practical technology, automation and AI solutions.",
};

const challenges = [
  {
    title: "Patient Enquiries & Appointments",
    description:
      "Improve how enquiries and appointment requests are captured, organized and followed up so staff spend less time managing them manually.",
  },
  {
    title: "Patient Communication",
    description:
      "Create more consistent communication workflows for appointment information, reminders, service enquiries and other routine interactions.",
  },
  {
    title: "Administrative Workflows",
    description:
      "Reduce repetitive administrative work involving forms, approvals, notifications, documents and internal coordination.",
  },
  {
    title: "Payments & Billing Workflows",
    description:
      "Improve visibility around payment processes and connect appropriate financial information with operational reporting.",
  },
  {
    title: "Management Reporting",
    description:
      "Give management clearer visibility into operational activity, appointments, enquiries, payments and other relevant business indicators.",
  },
  {
    title: "Connectivity & Technology Infrastructure",
    description:
      "Improve the network, Wi-Fi, devices, security-camera infrastructure and connectivity that staff depend on every day.",
  },
];

const opportunities = [
  "Appointment enquiry capture and follow-up",
  "Appointment reminder workflows",
  "Online enquiry and booking forms",
  "Patient communication workflows",
  "Administrative task automation",
  "Internal approval and notification workflows",
  "Management dashboards and reporting",
  "Payment and operational reporting",
  "Website and digital presence improvements",
  "LAN and Wi-Fi infrastructure",
  "Device and endpoint installation",
  "AI-assisted administrative workflows",
];

const signs = [
  "Staff spend too much time answering routine appointment questions.",
  "Appointment requests arrive through multiple channels and are difficult to coordinate.",
  "Staff repeatedly enter the same information into different systems.",
  "Reminders and routine communications are handled manually.",
  "Management reports take too long to prepare.",
  "The clinic depends heavily on spreadsheets or paper-based processes.",
  "Internet, Wi-Fi or network reliability affects daily operations.",
  "Different business systems are disconnected and difficult to manage.",
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We learn how your clinic currently handles enquiries, appointments, administration, communication and reporting.",
  },
  {
    number: "02",
    title: "Identify",
    text: "We identify repetitive work, technology gaps, integration opportunities and infrastructure issues affecting operations.",
  },
  {
    number: "03",
    title: "Prioritize",
    text: "We separate quick improvements from larger technology projects and focus first on practical opportunities.",
  },
  {
    number: "04",
    title: "Implement",
    text: "We implement the appropriate automation, integration, infrastructure, dashboard or custom technology solution.",
  },
  {
    number: "05",
    title: "Improve",
    text: "We review the results and identify additional opportunities to improve efficiency, reliability and operational visibility.",
  },
];

const faqs = [
  {
    question: "Can Techtrep work with our existing clinic software?",
    answer:
      "Yes. We can assess the systems your organization already uses and determine whether they can be integrated, improved or extended rather than automatically replacing them.",
  },
  {
    question: "Can you automate appointment enquiries and reminders?",
    answer:
      "Yes. We can design workflows for capturing appointment requests, routing them appropriately and automating suitable reminders or notifications while keeping staff involved where necessary.",
  },
  {
    question: "Can you improve our clinic's website?",
    answer:
      "Yes. Website improvements can form part of a digital foundation project, particularly where the website needs to support enquiries, appointments, communication or other business processes.",
  },
  {
    question: "Can you improve our clinic's network and Wi-Fi?",
    answer:
      "Yes. Network and infrastructure work can include LAN infrastructure, Wi-Fi deployment, device installation, structured cabling and coordination of ISP or last-mile connectivity.",
  },
  {
    question: "Can AI be used in clinic administration?",
    answer:
      "AI can support selected administrative and communication tasks when implemented appropriately. We focus on defined use cases, appropriate human oversight and responsible handling of sensitive information.",
  },
  {
    question: "Can you build a custom clinic application?",
    answer:
      "Yes. Where existing software cannot adequately address a defined operational requirement, we can assess and develop a custom application, portal, integration or internal business tool.",
  },
  {
    question: "Do we need to replace our existing systems?",
    answer:
      "Not necessarily. Our first approach is to understand what you already have and determine whether better configuration, integration, automation or supporting technology can solve the problem.",
  },
  {
    question: "Where should our clinic start?",
    answer:
      "The Free Technology Audit is a practical starting point. We can review your current technology environment and operational processes and identify opportunities before you commit to a larger project.",
  },
];

export default function ClinicsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Clinics &amp; Healthcare
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology that helps your clinic run more efficiently.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Improve appointment enquiries, communication, administration,
              reporting and technology infrastructure while reducing
              repetitive work for your staff.
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
                Discuss Your Clinic
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
                Healthcare operations depend on reliable processes and
                technology.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                A clinic may rely on appointment systems, websites, payment
                services, communication platforms, accounting tools,
                spreadsheets, network infrastructure and specialist healthcare
                applications.
              </p>

              <p>
                These systems may each perform an important function while
                leaving staff responsible for manually moving information
                between them.
              </p>

              <p>
                Enquiries may arrive through different channels. Appointment
                reminders may be handled manually. Reports may require
                information to be collected from several systems before
                management can see what is happening.
              </p>

              <p className="font-medium text-slate-900">
                Techtrep helps clinics identify where technology can simplify
                operations without unnecessarily replacing the systems they
                already depend on.
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
              Practical technology improvements across clinic operations.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We focus on operational technology, automation and infrastructure
              that can make everyday work easier for staff and improve
              visibility for management.
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
                Better workflows can reduce administrative pressure on your
                team.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                We look for areas where automation, integration, better
                reporting, infrastructure improvements or carefully selected
                AI capabilities can make a measurable operational difference.
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

      {/* Responsible Technology */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Responsible technology
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Healthcare technology needs the right boundaries.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Technology projects in healthcare can involve systems and
                information that require careful handling. We therefore
                approach automation, integrations and AI around clearly
                defined operational requirements and appropriate access
                controls.
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Our focus is on helping your organization improve its
                operations while respecting the security, privacy and
                governance requirements applicable to the systems involved.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
              <p className="text-sm font-semibold text-slate-950">
                Areas we consider
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Access and permissions",
                  "System integration boundaries",
                  "Data minimization",
                  "Secure infrastructure",
                  "Operational accountability",
                  "Human oversight for AI-assisted workflows",
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
              From infrastructure and connectivity to automation and AI.
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
                  "Automate repetitive appointment, communication and administrative workflows.",
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
                  "Create clearer visibility into appointments, enquiries, payments and operational KPIs.",
                href: "/solutions/dashboards-analytics",
              },
              {
                title: "Custom Technology",
                description:
                  "Build portals, applications or integrations around requirements existing systems cannot handle.",
                href: "/solutions/custom-technology",
              },
              {
                title: "Managed Technology",
                description:
                  "Keep your clinic's technology, applications and infrastructure supported and maintained.",
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
                Connected clinic
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Reliable infrastructure supports reliable operations.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Internet connectivity, LAN infrastructure, Wi-Fi, devices and
                security-camera systems can all form part of the technology
                environment your staff depend on.
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
                Your clinic may have an opportunity to improve if...
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
              How we work with clinics
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with how your clinic operates—not with a technology
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
                  Not sure where your clinic should start?
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  Tell us where your team spends too much time manually, which
                  systems are difficult to work with and where technology or
                  connectivity creates friction. We&apos;ll identify practical
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
              Questions from clinics
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
              Clinics &amp; Healthcare
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make technology work harder for your clinic.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Whether you need to improve appointment workflows, automate
              administration, connect systems, strengthen connectivity,
              improve reporting or explore AI, we can start by understanding
              how your clinic works today.
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