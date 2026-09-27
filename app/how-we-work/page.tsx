import Link from "next/link";

export const metadata = {
  title: "How We Work",
  description:
    "See how Techtrep Business Solutions moves from business problems to practical technology solutions through audit, discovery, design, implementation and continuous improvement.",
};

const processSteps = [
  {
    number: "01",
    title: "Audit",
    description:
      "We start by understanding how your organization operates today. We look at your business processes, technology environment, connectivity, systems and the problems your team encounters.",
    points: [
      "Understand current processes and workflows",
      "Review existing technology and systems",
      "Identify operational bottlenecks",
      "Understand connectivity and infrastructure needs",
    ],
  },
  {
    number: "02",
    title: "Discover",
    description:
      "We turn what we learn into practical opportunities. The goal is not to recommend technology for its own sake, but to identify where digital tools can create measurable operational value.",
    points: [
      "Identify processes that can be digitized",
      "Find repetitive work that can be automated",
      "Identify integration and reporting opportunities",
      "Assess where AI can provide practical value",
    ],
  },
  {
    number: "03",
    title: "Design",
    description:
      "We define the solution around the way your organization actually works. Depending on the problem, this may involve software, automation, AI, data, cloud services, networking infrastructure or a combination of technologies.",
    points: [
      "Define the recommended solution",
      "Set priorities and implementation phases",
      "Choose an appropriate technology approach",
      "Establish scope, responsibilities and expected outcomes",
    ],
  },
  {
    number: "04",
    title: "Implement",
    description:
      "We turn the plan into a working solution. Implementation can include software development, configuration, integration, cloud deployment, network installation, device setup and operational testing.",
    points: [
      "Build or configure the required technology",
      "Integrate existing systems where appropriate",
      "Install and connect infrastructure and devices",
      "Test the solution before operational handover",
    ],
  },
  {
    number: "05",
    title: "Improve",
    description:
      "Technology should continue to deliver value after implementation. We can provide ongoing support, maintenance, monitoring and improvements as your organization grows and its needs change.",
    points: [
      "Maintain systems and infrastructure",
      "Monitor reliability and performance",
      "Resolve issues and support users",
      "Identify opportunities for continuous improvement",
    ],
  },
];

const areas = [
  {
    title: "Business processes",
    description:
      "How work moves through your organization, where delays occur and which activities depend too heavily on manual effort.",
  },
  {
    title: "Existing software",
    description:
      "The applications and platforms your organization already uses and whether they can work together more effectively.",
  },
  {
    title: "Digital channels",
    description:
      "Websites, forms, portals, online enquiries, customer touchpoints and other ways people interact with your organization.",
  },
  {
    title: "Data & reporting",
    description:
      "How information is collected, stored, shared and turned into useful management and operational insight.",
  },
  {
    title: "Automation opportunities",
    description:
      "Repetitive processes, notifications, approvals, data movement and other work that can potentially be handled by software.",
  },
  {
    title: "AI opportunities",
    description:
      "Customer support, document processing, knowledge access, content workflows and other areas where AI may provide practical value.",
  },
  {
    title: "Network infrastructure",
    description:
      "ISP connectivity, last-mile connections, LAN, Wi-Fi, structured cabling and the infrastructure connecting your organization.",
  },
  {
    title: "Devices & endpoints",
    description:
      "Computers, network equipment, security-camera cabling, connected devices and other endpoints that support daily operations.",
  },
];

const engagementModels = [
  {
    title: "Focused Project",
    description:
      "You have a specific problem that needs to be solved. We define the scope, build or implement the solution and help you put it into operation.",
  },
  {
    title: "Technology Improvement Programme",
    description:
      "Your organization has several areas that need attention. We can work through them in stages, prioritizing the improvements with the greatest practical value.",
  },
  {
    title: "Ongoing Managed Technology",
    description:
      "You need continuing technical support rather than a one-time implementation. We can provide maintenance, monitoring, support and ongoing technology improvements.",
  },
];

export default function HowWeWorkPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How We Work
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              From business problem to working solution.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Good technology starts with understanding the business. We begin
              with how your organization actually operates, then identify where
              technology can make work simpler, faster, more connected and more
              reliable.
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
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Talk to Techtrep
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Our approach
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Technology should solve a business problem.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                We do not begin by asking which technology you want to buy. We
                begin by asking what your organization is trying to accomplish,
                what is slowing it down and what your team currently has to do
                manually.
              </p>

              <p>
                Sometimes the answer is a new application. Sometimes it is an
                automation connecting systems you already have. It could be an
                AI assistant, a management dashboard, a better digital
                workflow, a more reliable network or the installation and
                connection of the devices your team depends on.
              </p>

              <p>
                Our job is to understand the problem first and then determine
                the appropriate technology response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              The process
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Five stages from understanding to improvement.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Every engagement is different, but our approach provides a clear
              path from identifying the problem to implementing and improving
              the solution.
            </p>
          </div>

          <div className="mt-14 space-y-5">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9"
              >
                <div className="grid gap-7 lg:grid-cols-[110px_0.9fr_1.1fr] lg:items-start">
                  <div>
                    <span className="text-sm font-bold tracking-[0.18em] text-[#39358C]">
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm leading-6 text-slate-600">
                    {step.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What we look at */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we look at
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              We look beyond the software.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              A technology problem is not always a software problem. We look
              across the operational environment so recommendations fit the
              way your organization actually works.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <article
                key={area.title}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Technology spectrum */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
                One technology partner
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Software, automation, AI and infrastructure can work together.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-300">
              <p>
                Organizations often have technology spread across different
                vendors, applications, devices and infrastructure. That can
                create disconnected workflows and make even simple operational
                tasks harder than they need to be.
              </p>

              <p>
                Techtrep Business Solutions can work across that technology
                environment—from digital platforms and custom applications to
                automation, AI, data, networking, connectivity and endpoints.
              </p>

              <p>
                The objective is not to replace everything. Where existing
                systems work, we look for ways to connect, improve and extend
                them.
              </p>

              <div className="flex flex-wrap gap-3 pt-3">
                {[
                  "Digital Platforms",
                  "Automation",
                  "AI",
                  "Data",
                  "Cloud",
                  "Networking",
                  "Connectivity",
                  "Devices",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Engagement models
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with what your organization needs.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Some organizations need a focused implementation. Others need a
              broader technology improvement programme or a partner who can
              provide ongoing support.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {engagementModels.map((model, index) => (
              <article
                key={model.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7"
              >
                <span className="text-sm font-bold text-[#39358C]">
                  0{index + 1}
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {model.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {model.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/solutions"
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <p className="text-sm font-semibold text-[#39358C]">Solutions</p>
              <p className="mt-2 font-semibold text-slate-950">
                Explore what we do
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Software, automation, AI, analytics and infrastructure.
              </p>
            </Link>

            <Link
              href="/industries"
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <p className="text-sm font-semibold text-[#39358C]">
                Industries
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                See who we help
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Explore technology needs across different industries.
              </p>
            </Link>

            <Link
              href="/case-studies"
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <p className="text-sm font-semibold text-[#39358C]">
                Case Studies
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                See technology in practice
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Explore selected technology projects and engineering work.
              </p>
            </Link>

            <Link
              href="/contact"
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#39358C]"
            >
              <p className="text-sm font-semibold text-[#39358C]">Contact</p>
              <p className="mt-2 font-semibold text-slate-950">
                Talk about your needs
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Tell us what your organization is trying to improve.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-[#39358C] px-7 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
                  Not sure where to start?
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Start with a free technology audit.
                </h2>

                <p className="mt-5 text-base leading-7 text-indigo-100">
                  Tell us how your organization currently operates, what your
                  team is doing manually and where you are experiencing
                  technology challenges. We&apos;ll help identify practical
                  opportunities for improvement.
                </p>
              </div>

              <div>
                <Link
                  href="/free-technology-audit"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
                >
                  Request Your Free Audit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}