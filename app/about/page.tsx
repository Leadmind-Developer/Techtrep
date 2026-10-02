import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Techtrep Business Solutions",
  description:
    "Learn about Techtrep Business Solutions and our approach to practical business technology, automation, AI, custom software, networking and infrastructure.",
  path: "/about",
});

const principles = [
  {
    title: "Business first",
    description:
      "We start with the business problem, not the technology. The solution should make sense operationally and commercially.",
  },
  {
    title: "Practical technology",
    description:
      "Technology should solve real problems, reduce unnecessary effort and help organizations operate more effectively.",
  },
  {
    title: "Build where necessary",
    description:
      "We do not assume everything needs to be custom-built. Where existing systems work, we look for ways to connect and improve them.",
  },
  {
    title: "Think beyond software",
    description:
      "Business technology includes applications, automation, AI, data, connectivity, networks, devices and the infrastructure that connects them.",
  },
];

const capabilities = [
  "Digital platforms",
  "Business automation",
  "AI solutions",
  "Custom software",
  "Data & dashboards",
  "Cloud technology",
  "Networking & infrastructure",
  "Device & endpoint installation",
];

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              About Techtrep
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Technology that works for the way your business works.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Techtrep Business Solutions helps organizations use technology
              more effectively—from digital platforms and automation to AI,
              analytics, networking and infrastructure.
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

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Techtrep Business Solutions
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                A practical technology partner for growing organizations.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                Techtrep Business Solutions is the business technology arm of
                Techtrep, focused on helping organizations improve the way they
                operate through practical technology.
              </p>

              <p>
                Businesses often have technology problems that cross several
                categories. A customer enquiry may start on a website, move
                into a spreadsheet, require a staff response, generate a
                payment and eventually appear in a management report.
              </p>

              <p>
                Solving that problem may require more than one technology. It
                could involve a digital platform, an automation workflow, an
                integration, a dashboard, AI, network connectivity or physical
                infrastructure.
              </p>

              <p>
                Our role is to understand the complete problem and help put the
                appropriate pieces together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we believe
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Four principles guide our work.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <span className="text-sm font-bold text-[#39358C]">
                  0{index + 1}
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {principle.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Our capabilities
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                One partner across the technology environment.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                We bring together digital and physical technology capabilities
                so organizations can address connected problems without having
                to treat every technology layer as a separate project.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-[#39358C]"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {capability}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Built by Techtrep
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                We use the same engineering mindset in our own products.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-300">
              <p>
                Techtrep has built and operated technology products including
                payment and utility platforms, document-processing tools and a
                digital media platform.
              </p>

              <p>
                These projects give us practical experience across product
                development, cloud infrastructure, integrations, operations
                and ongoing technology improvement.
              </p>

              <Link
                href="/case-studies"
                className="inline-flex font-semibold text-white transition-colors hover:text-indigo-200"
              >
                Explore our technology projects
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-[#39358C] px-7 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
                  Start a conversation
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Tell us what you are trying to improve.
                </h2>

                <p className="mt-5 text-base leading-7 text-indigo-100">
                  We can start with a specific technology requirement or help
                  you identify where technology could make the biggest
                  operational difference.
                </p>
              </div>

              <Link
                href="/free-technology-audit"            
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Request a Free Audit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}