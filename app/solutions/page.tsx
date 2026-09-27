import Link from "next/link";

const solutions = [
  {
    number: "01",
    title: "Digital Foundation",
    description:
      "Build the digital systems your business needs to operate professionally, communicate with customers and capture opportunities.",
    href: "/solutions/digital-foundation",
    points: [
      "Business websites and digital platforms",
      "Online enquiry and lead capture",
      "Forms, portals and customer touchpoints",
      "Digital workflows and operational foundations",
    ],
  },
  {
    number: "02",
    title: "Business Automation",
    description:
      "Turn repetitive manual work into reliable digital workflows that save time, reduce errors and help your team focus on higher-value work.",
    href: "/solutions/business-automation",
    points: [
      "Workflow automation",
      "Lead and enquiry processes",
      "Approvals and notifications",
      "System-to-system integrations",
    ],
  },
  {
    number: "03",
    title: "AI Business Solutions",
    description:
      "Apply AI where it can create practical business value—from customer service and document processing to internal knowledge and operations.",
    href: "/solutions/ai-business-solutions",
    points: [
      "AI assistants and business chatbots",
      "Document and knowledge automation",
      "AI-powered customer support",
      "AI-assisted business operations",
    ],
  },
  {
    number: "04",
    title: "Dashboards & Analytics",
    description:
      "Turn operational data into useful information so management can understand performance, identify problems and make better decisions.",
    href: "/solutions/dashboards-analytics",
    points: [
      "Management dashboards",
      "Operational reporting",
      "KPI tracking",
      "Data consolidation and visualization",
    ],
  },
  {
    number: "05",
    title: "Custom Technology",
    description:
      "Build technology around the way your organization actually works when off-the-shelf software is not enough.",
    href: "/solutions/custom-technology",
    points: [
      "Business applications",
      "Customer and staff portals",
      "Custom workflow platforms",
      "APIs and system integrations",
    ],
  },
  {
    number: "06",
    title: "Networking & Infrastructure",
    description:
      "Connect and equip your business with reliable infrastructure, from ISP and last-mile connectivity through LAN, Wi-Fi, cabling and endpoint installation.",
    href: "/solutions/networking-infrastructure",
    points: [
      "ISP and last-mile connectivity",
      "LAN and Wi-Fi deployment",
      "Structured network cabling",
      "Device, camera and endpoint installation",
    ],
  },
  {
    number: "07",
    title: "Managed Technology",
    description:
      "Keep your technology reliable after implementation with ongoing maintenance, monitoring, support and continuous improvement.",
    href: "/solutions/managed-technology",
    points: [
      "Technology maintenance",
      "Monitoring and support",
      "Security and reliability",
      "Continuous improvement",
    ],
  },{
    number: "08",
    title: "Managed Technology",
    description:
      "Keep your technology reliable after implementation with ongoing maintenance, monitoring, support and continuous improvement.",
    href: "/solutions/managed-technology",
    points: [
      "Technology maintenance",
      "Monitoring and support",
      "Security and reliability",
      "Continuous improvement",
    ],
  },
];

const principles = [
  {
    title: "Business first",
    description:
      "We start with the business problem rather than assuming that a particular technology is the answer.",
  },
  {
    title: "Practical technology",
    description:
      "We focus on solutions your organization can actually adopt, operate and maintain.",
  },
  {
    title: "Connected systems",
    description:
      "Where possible, we connect the systems you already use instead of creating unnecessary technology silos.",
  },
  {
    title: "Built to improve",
    description:
      "Technology should not be a one-time project. We design solutions that can evolve as your organization grows.",
  },
];

export const metadata = {
  title: "Business Technology Solutions",
  description:
    "Explore Techtrep Business Solutions for digital foundations, business automation, AI solutions, dashboards, custom technology, networking and managed technology.",
};

export default function SolutionsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Our Solutions
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology solutions designed around your business.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              From digital foundations and networking infrastructure to workflow automation, AI,
              analytics and custom software, we help organizations improve
              the way they operate.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Start a Free Technology Audit
              </Link>

              <Link
                href="/how-we-work"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                See How We Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                What we do
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                We solve business problems with technology.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                Technology is most valuable when it makes a business easier
                to run. That might mean reducing the amount of manual work
                your staff perform, making it easier for customers to reach
                you, connecting systems that currently operate separately or
                giving management better visibility into the business.
              </p>

              <p>
                Our solutions combine software development, networking and infrastructure, automation,
                integration, cloud technology, data and AI to address those
                practical needs.
              </p>

              <p>
                We do not believe every organization needs a large technology
                project. Sometimes the right answer is a better workflow,
                a simple integration or a focused automation. Other times,
                the business genuinely needs a custom platform.
              </p>

              <p className="font-semibold text-slate-900">
                We help you determine which approach makes sense before
                building it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From foundational systems to intelligent automation.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Choose the area you want to improve, or start with an audit if
              you are not sure where to begin.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {solutions.map((solution) => (
              <article
                key={solution.href}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-sm font-bold tracking-[0.15em] text-[#39358C]">
                    {solution.number}
                  </span>

                  <span
                    className="text-xl text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#39358C]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                  {solution.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {solution.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {solution.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={solution.href}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#39358C] hover:text-[#2f2b76]"
                >
                  Explore {solution.title}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Our approach
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Technology should fit the business.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                The best technical solution is not necessarily the biggest
                one. We look at your existing processes, systems, people and
                goals before recommending what should change.
              </p>

              <Link
                href="/how-we-work"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#39358C] hover:text-[#2f2b76]"
              >
                Learn how we work
                <span aria-hidden="true">→</span>
              </Link>
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

      {/* Who we help */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Who we help
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built for organizations that are ready to operate better.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We work with growing organizations where technology can improve
              customer experience, internal operations, visibility or
              efficiency.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Schools", "/industries/schools"],
              ["Hotels", "/industries/hotels"],
              ["Clinics", "/industries/clinics"],
              ["Churches", "/industries/churches"],
              ["Media & Entertainment", "/industries/media-entertainment"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 transition-colors hover:border-[#39358C] hover:text-[#39358C]"
              >
                {label}
                <span className="ml-2 text-slate-400" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <Link
              href="/industries/other-industries"
              className="inline-flex rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 transition-colors hover:border-[#39358C] hover:text-[#39358C]"
            >
              Other Industries
              <span className="ml-2 text-slate-400" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Audit CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Not sure what you need?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start with a free technology audit.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/80">
              Tell us how your business works, where your team spends too
              much time manually and which systems are getting in the way.
              We will identify practical opportunities to improve,
              automate or connect your operations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Request Your Free Audit
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