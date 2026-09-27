import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technology Solutions for Media & Entertainment",
  description:
    "Techtrep helps media and entertainment businesses improve content operations, audience engagement, advertising workflows, events, payments, reporting, connectivity and repetitive work with practical technology, automation and AI solutions.",
};

const challenges = [
  {
    title: "Content Operations",
    description:
      "Improve the workflows involved in creating, organizing, publishing and distributing digital content across multiple channels.",
  },
  {
    title: "Audience & Customer Management",
    description:
      "Create better ways to capture enquiries, organize audience information and understand how people interact with your digital products and services.",
  },
  {
    title: "Advertising & Sponsorship",
    description:
      "Improve the management of advertising enquiries, campaigns, sponsorship opportunities, approvals, reporting and related workflows.",
  },
  {
    title: "Events & Experiences",
    description:
      "Simplify event registration, ticketing-related workflows, communications, attendance tracking and operational coordination.",
  },
  {
    title: "Payments & Digital Revenue",
    description:
      "Improve payment workflows and reporting for subscriptions, events, digital services and other revenue-generating activities.",
  },
  {
    title: "Technology Infrastructure",
    description:
      "Build reliable connectivity and technology infrastructure for offices, studios, event spaces, production environments and digital operations.",
  },
];

const opportunities = [
  "Content workflow automation",
  "Editorial and publishing workflows",
  "Audience enquiry capture and follow-up",
  "Customer and audience databases",
  "Advertising enquiry management",
  "Sponsorship workflow automation",
  "Event registration workflows",
  "Digital payment integrations",
  "Subscription and membership workflows",
  "Management dashboards and analytics",
  "AI-assisted content and administrative workflows",
  "LAN, Wi-Fi and device deployment",
];

const signs = [
  "Content teams spend too much time moving information between tools.",
  "Advertising or sponsorship enquiries are difficult to track from first contact to completion.",
  "Audience or customer information is spread across different platforms.",
  "Event registration and communication require significant manual work.",
  "Management reports are assembled manually from multiple systems.",
  "Revenue or payment information is difficult to consolidate.",
  "Digital products depend on disconnected technology systems.",
  "Internet, Wi-Fi, devices or network infrastructure affect daily operations.",
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We learn how your organization handles content, audiences, advertising, events, payments and day-to-day technology operations.",
  },
  {
    number: "02",
    title: "Identify",
    text: "We identify repetitive work, technology gaps, integration opportunities and infrastructure issues affecting productivity.",
  },
  {
    number: "03",
    title: "Prioritize",
    text: "We separate quick improvements from larger technology projects and focus first on opportunities with practical operational value.",
  },
  {
    number: "04",
    title: "Implement",
    text: "We implement the appropriate automation, integration, infrastructure, dashboard or custom technology solution.",
  },
  {
    number: "05",
    title: "Improve",
    text: "We review what is working and identify additional opportunities to improve efficiency, audience experience and technology reliability.",
  },
];

const faqs = [
  {
    question: "Can Techtrep work with our existing publishing or media systems?",
    answer:
      "Yes. We can assess the systems your organization already uses and determine whether they can be integrated, improved or extended rather than automatically replacing them.",
  },
  {
    question: "Can you automate advertising or sponsorship workflows?",
    answer:
      "Yes. We can help organize enquiries, approvals, notifications, internal handoffs and reporting around advertising or sponsorship processes.",
  },
  {
    question: "Can you help manage audience or customer information?",
    answer:
      "Yes. We can assess how audience or customer information is currently captured and identify opportunities to improve organization, communication and reporting.",
  },
  {
    question: "Can you build technology for events?",
    answer:
      "Yes. Depending on the requirement, this can include registration workflows, event portals, payment integrations, notifications, dashboards or custom supporting applications.",
  },
  {
    question: "Can AI be useful for media businesses?",
    answer:
      "AI can support selected content, research, communication, knowledge, administrative and reporting workflows. We focus on practical use cases with appropriate human review and editorial oversight.",
  },
  {
    question: "Can you improve our media company's network and connectivity?",
    answer:
      "Yes. Network and infrastructure work can include LAN installation, Wi-Fi deployment, structured cabling, device installation, security-camera cabling and ISP or last-mile connectivity.",
  },
  {
    question: "Can you build a custom digital product?",
    answer:
      "Yes. Where existing platforms cannot adequately address a defined requirement, we can assess and develop a custom application, portal, platform, integration or internal business tool.",
  },
  {
    question: "Does Techtrep build and operate media technology itself?",
    answer:
      "Yes. Techtrep has built and operated its own digital media technology, giving us practical experience with publishing workflows, digital products, audience-facing systems and the technology behind them.",
  },
  {
    question: "Where should our organization start?",
    answer:
      "The Free Technology Audit is a practical starting point. We can review your technology environment, operational workflows and infrastructure and identify opportunities before you commit to a larger project.",
  },
];

export default function MediaEntertainmentPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Media &amp; Entertainment
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology for businesses built around content, audiences and
              experiences.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Improve content operations, audience engagement, advertising,
              events, payments, reporting and infrastructure while reducing the
              repetitive work behind your media business.
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
                Discuss Your Business
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
                Modern media businesses operate across many digital systems.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                A media organization may depend on publishing platforms,
                websites, social channels, advertising systems, payment
                providers, event platforms, analytics tools, customer
                databases and internal communication applications.
              </p>

              <p>
                These systems can each solve a specific problem while creating
                additional work when information has to be copied or reconciled
                between them.
              </p>

              <p>
                Editorial teams may manage content in one system while
                commercial teams track advertising opportunities somewhere
                else. Event teams may maintain separate registration lists,
                while management reporting requires information from several
                different sources.
              </p>

              <p className="font-medium text-slate-900">
                Techtrep helps media and entertainment businesses connect
                these moving parts and identify where technology can make
                operations easier to manage.
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
              Practical technology improvements across media operations.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We look at the entire operational picture—from content and
              audiences to commercial workflows, events, payments and the
              infrastructure underneath them.
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
                Connect the work behind the content.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                The biggest opportunity is often not another standalone
                application. It may be connecting existing systems,
                automating handoffs or giving teams better visibility into
                what is already happening.
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

      {/* Techtrep Experience */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Built from practical experience
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                We understand the technology behind digital media because we
                build it ourselves.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Techtrep has developed and operated its own digital technology,
                including media publishing infrastructure, audience-facing
                applications, payment-enabled platforms and other software
                products.
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                That experience informs how we approach media technology:
                understand the workflow first, use existing systems where they
                make sense, integrate where possible and build custom
                technology when there is a clear requirement.
              </p>

              <Link
                href="/case-studies"
                className="mt-7 inline-flex items-center text-sm font-semibold text-[#39358C] hover:underline"
              >
                See Selected Technology Work →
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
              <p className="text-sm font-semibold text-slate-950">
                Areas where technology can connect the operation
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Content",
                  "Audience",
                  "Advertising",
                  "Sponsorship",
                  "Events",
                  "Payments",
                  "Analytics",
                  "Communication",
                  "Infrastructure",
                  "AI workflows",
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

      {/* Solutions */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Techtrep solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Technology across the full media operation.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              From digital foundations and infrastructure to automation,
              analytics and custom applications, we can address individual
              requirements or connected technology needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Digital Foundation",
                description:
                  "Websites, digital platforms and essential technology infrastructure for your digital presence.",
                href: "/solutions/digital-foundation",
              },
              {
                title: "Business Automation",
                description:
                  "Automate repetitive editorial, commercial, communication and administrative workflows.",
                href: "/solutions/business-automation",
              },
              {
                title: "AI Business Solutions",
                description:
                  "Apply AI to practical content, research, communication, knowledge and administrative use cases.",
                href: "/solutions/ai-business-solutions",
              },
              {
                title: "Dashboards & Analytics",
                description:
                  "Bring operational, audience, commercial and financial information into clearer management views.",
                href: "/solutions/dashboards-analytics",
              },
              {
                title: "Custom Technology",
                description:
                  "Build digital products, portals, applications or integrations around specific business requirements.",
                href: "/solutions/custom-technology",
              },
              {
                title: "Managed Technology",
                description:
                  "Keep applications, websites, infrastructure and technology environments supported and improving.",
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
                Connected media operations
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Digital media still depends on physical infrastructure.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Offices, studios, event spaces and production environments
                depend on reliable connectivity, LAN infrastructure, Wi-Fi,
                devices, security systems and appropriate power and cabling.
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
                Your media business may have an opportunity to improve if...
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
              How we work with media businesses
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with how your operation works—not with a technology
              product.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We understand the workflow first, then recommend the technology
              approach that fits the requirement.
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
                  Not sure where your media business should start?
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  Tell us where your teams spend too much time manually, which
                  systems are difficult to connect and where technology or
                  infrastructure creates friction. We&apos;ll identify
                  practical opportunities.
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
              Questions from media &amp; entertainment businesses
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
              Media &amp; Entertainment
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Build a technology operation that keeps up with your audience.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Whether you need to streamline content workflows, improve
              audience management, automate advertising processes, support
              events, connect systems, improve infrastructure or explore AI,
              we can start by understanding how your operation works today.
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