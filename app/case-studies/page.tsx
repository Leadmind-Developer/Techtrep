import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Case Studies & Technology Projects",
  description:
    "Explore selected technology products and platforms developed or operated by Techtrep, including Nexa, PDFImageTools and Techtrep Media.",
  path: "/case-studies",
});

const projects = [
  {
    number: "01",
    type: "Payments & Business Platform",
    title: "Nexa",
    description:
      "A digital payments, utilities and event-management platform built by Techtrep, combining wallet functionality, payments, utility services, events and transaction workflows.",
    challenge:
      "Build a technology platform capable of bringing several customer-facing financial and event workflows together while supporting reliable transaction processing.",
    approach: [
      "Digital wallet and transaction workflows",
      "Airtime, data and utility services",
      "Event management and payment flows",
      "Payment-provider and third-party integrations",
      "Cloud-hosted backend and application infrastructure",
    ],
    href: "https://nexa.com.ng",
    linkLabel: "Visit Nexa",
  },
  {
    number: "02",
    type: "Document Processing",
    title: "PDFImageTools",
    description:
      "A browser-based document and image utility platform designed to make common PDF and image operations accessible without requiring users to install desktop software.",
    challenge:
      "Provide useful document-processing capabilities through a simple web experience while keeping infrastructure costs appropriate for workloads that can vary significantly.",
    approach: [
      "Browser-based document workflows",
      "PDF and image processing",
      "Cloud-hosted processing infrastructure",
      "Automated temporary-file handling",
      "Infrastructure optimization for variable workloads",
    ],
    href: "https://pdfimagetools-vercel-9c3h.vercel.app/",
    linkLabel: "Visit PDFImageTools",
  },
  {
    number: "03",
    type: "Digital Media Platform",
    title: "Techtrep Media",
    description:
      "A technology-focused digital media platform built and operated by Techtrep, combining publishing, search, content organization, audience engagement and advertising infrastructure.",
    challenge:
      "Operate a modern publishing platform that can support a growing technology content library while maintaining a strong technical and search foundation.",
    approach: [
      "Technology publishing platform",
      "Structured content architecture",
      "Search and content discovery",
      "SEO-focused publishing workflows",
      "Advertising and audience infrastructure",
    ],
    href: "https://thetechtrep.com",
    linkLabel: "Visit Techtrep Media",
  },
];

const capabilities = [
  {
    title: "Software & Platforms",
    description:
      "Web applications, business platforms, portals and customer-facing digital products built around specific operational requirements.",
  },
  {
    title: "Integrations",
    description:
      "Connecting applications, payment providers, APIs and other services so information can move between systems more effectively.",
  },
  {
    title: "Cloud & Infrastructure",
    description:
      "Cloud deployment, application infrastructure and architecture decisions designed around reliability, performance and cost.",
  },
  {
    title: "Automation",
    description:
      "Reducing repetitive work through workflows, notifications, data movement, scheduled processes and system integrations.",
  },
  {
    title: "Data & Operations",
    description:
      "Technology that helps organizations capture information, understand operational activity and make better use of their data.",
  },
  {
    title: "Networking & Connectivity",
    description:
      "ISP, last-mile, LAN, Wi-Fi, structured cabling, device installation and endpoint connectivity for physical business environments.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Case Studies & Technology Projects
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology built to solve real problems.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Our work spans software platforms, digital products,
              integrations, cloud infrastructure, automation and operational
              technology. Here are selected examples of technology built and
              operated by Techtrep.
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
                Discuss Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Context */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Our work
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Built, tested and operated in the real world.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                These examples represent technology products and platforms
                developed or operated by Techtrep. They demonstrate the types
                of technical problems we work on and the range of capabilities
                we can bring to a business environment.
              </p>

              <p>
                They are not presented as customer case studies unless
                explicitly identified as such. We believe a technology company
                should be clear about what it has actually built, rather than
                using vague or unverified claims to create an impressive
                portfolio.
              </p>

              <p>
                Client engagements can involve different technologies,
                constraints and commercial requirements, so we focus on
                understanding the individual problem before recommending an
                approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Selected projects
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Examples of technology we have built.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Each project involves a different combination of product
              development, infrastructure, integrations and operational
              requirements.
            </p>
          </div>

          <div className="mt-14 space-y-6">
            {projects.map((project) => (
              <article
                key={project.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
                    <span className="text-sm font-bold tracking-[0.18em] text-indigo-300">
                      {project.number}
                    </span>

                    <p className="mt-8 text-sm font-semibold uppercase tracking-[0.12em] text-indigo-300">
                      {project.type}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold">
                      {project.title}
                    </h3>

                    <p className="mt-5 leading-7 text-slate-300">
                      {project.description}
                    </p>

                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex items-center text-sm font-semibold text-white transition-colors hover:text-indigo-200"
                    >
                      {project.linkLabel}
                      <span className="ml-2" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </div>

                  <div className="p-8 sm:p-10 lg:p-12">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#39358C]">
                        The challenge
                      </p>

                      <p className="mt-3 leading-7 text-slate-600">
                        {project.challenge}
                      </p>
                    </div>

                    <div className="mt-9">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#39358C]">
                        Technology approach
                      </p>

                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {project.approach.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-6 text-slate-600"
                          >
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What this means for your business
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              We can work across the technology stack.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              A business problem rarely fits neatly into one technology
              category. Our capabilities cover the digital and physical
              technology layers that support day-to-day operations.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="rounded-2xl border border-slate-200 p-7"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {capability.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Notable distinction */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Our perspective
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                The right solution is not always the biggest one.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-300">
              <p>
                A business does not necessarily need to replace every system
                it already has. Sometimes the best improvement is connecting
                two existing systems, automating a repetitive task or making
                information easier to access.
              </p>

              <p>
                In other situations, an organization may need a new application
                or a broader technology implementation. We assess the problem,
                constraints and desired outcome before deciding what should be
                built or changed.
              </p>

              <Link
                href="/how-we-work"
                className="inline-flex font-semibold text-white transition-colors hover:text-indigo-200"
              >
                See how we work
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-[#39358C] px-7 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
                  Have a technology problem?
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Let&apos;s discuss what you need to build or improve.
                </h2>

                <p className="mt-5 text-base leading-7 text-indigo-100">
                  Tell us what your team is struggling with, what you are
                  currently doing manually or where your technology is falling
                  short. We&apos;ll help you identify a practical next step.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/free-technology-audit"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
                >
                  Start a Free Audit
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-indigo-300 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Contact Techtrep
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}