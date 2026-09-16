import Link from "next/link";

const solutions = [
  {
    number: "01",
    title: "Digital Foundation",
    description:
      "Build the digital systems your business needs to communicate, operate and grow.",
    href: "/solutions/digital-foundation",
  },
  {
    number: "02",
    title: "Business Automation",
    description:
      "Turn repetitive manual processes into reliable digital workflows.",
    href: "/solutions/business-automation",
  },
  {
    number: "03",
    title: "AI Business Solutions",
    description:
      "Apply practical AI to customer service, knowledge, documents, reporting and operations.",
    href: "/solutions/ai-business-solutions",
  },
  {
    number: "04",
    title: "Dashboards & Analytics",
    description:
      "Turn operational data into clear information your team can actually use.",
    href: "/solutions/dashboards-analytics",
  },
  {
    number: "05",
    title: "Custom Technology",
    description:
      "Build the portals, applications, integrations and workflows your business actually needs.",
    href: "/solutions/custom-technology",
  },
  {
    number: "06",
    title: "Managed Technology",
    description:
      "Keep your technology maintained, monitored, secure and improving after implementation.",
    href: "/solutions/managed-technology",
  },
];

const industries = [
  {
    title: "Schools",
    description: "Admissions, parent communication, fees and operations.",
    href: "/industries/schools",
  },
  {
    title: "Hotels",
    description: "Guest enquiries, booking workflows and communication.",
    href: "/industries/hotels",
  },
  {
    title: "Clinics",
    description: "Appointments, reminders and administrative workflows.",
    href: "/industries/clinics",
  },
  {
    title: "Churches",
    description: "First-timer follow-up, events and member engagement.",
    href: "/industries/churches",
  },
];

const principles = [
  "Understand the business first",
  "Improve what already works",
  "Automate where it makes sense",
  "Connect disconnected systems",
  "Use AI where it creates value",
  "Support the technology after launch",
];

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(57,53,140,0.14),transparent_35%)]" />

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center rounded-full border border-[#39358C]/15 bg-[#39358C]/5 px-4 py-2 text-sm font-medium text-[#39358C]">
              Technology, Automation & AI for Growing Businesses
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Make your business{" "}
              <span className="text-[#39358C]">easier to run.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              We help organizations digitize operations, automate repetitive
              work, connect their systems and use AI where it creates practical
              business value.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-xl bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2f2b76]"
              >
                Get a Free Technology Audit
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/solutions"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Explore Solutions
              </Link>
            </div>
          </div>

          <div className="mt-20 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Digitize
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Build stronger digital foundations.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                Automate
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Remove repetitive manual work.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                Connect
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Make your systems work together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-slate-50 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                The problem
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Your business shouldn't have to work harder because your
                systems don't work together.
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-slate-600">
                Growing businesses often accumulate technology one tool at a
                time. A website here. A spreadsheet there. WhatsApp for
                enquiries. Email for communication. Another system for
                payments.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Eventually, staff spend more time moving information between
                systems than actually using it.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Too much manual work",
              "Disconnected systems",
              "Slow follow-up",
              "Scattered information",
              "Manual reporting",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-800 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Our approach
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              We improve the way your business works.
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 md:grid-cols-3 lg:grid-cols-6">
            {[
              ["01", "Digitize"],
              ["02", "Automate"],
              ["03", "Connect"],
              ["04", "Understand"],
              ["05", "Intelligentize"],
              ["06", "Manage"],
            ].map(([number, title]) => (
              <div key={number} className="bg-white p-6">
                <span className="text-xs font-semibold text-[#39358C]">
                  {number}
                </span>

                <h3 className="mt-8 text-base font-semibold text-slate-950">
                  {title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="bg-slate-950 py-24 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
                What we do
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Technology that solves real business problems.
              </h2>
            </div>

            <Link
              href="/solutions"
              className="text-sm font-semibold text-white hover:text-violet-300"
            >
              View all solutions →
            </Link>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <Link
                href={solution.href}
                key={solution.number}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:border-violet-300/30 hover:bg-white/[0.07]"
              >
                <span className="text-sm font-semibold text-violet-300">
                  {solution.number}
                </span>

                <h3 className="mt-10 text-xl font-semibold">
                  {solution.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {solution.description}
                </p>

                <span className="mt-8 inline-block text-sm font-semibold text-white transition group-hover:translate-x-1">
                  Explore solution →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Industries
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Solutions built around how your industry works.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We focus initially on industries where operational automation
              creates clear opportunities, while remaining open to businesses
              across sectors.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <Link
                href={industry.href}
                key={industry.title}
                className="group rounded-3xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-[#39358C]/30 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {industry.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {industry.description}
                </p>

                <span className="mt-8 inline-block text-sm font-semibold text-[#39358C]">
                  Explore →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-7">
            <h3 className="font-semibold text-slate-950">
              Don't see your industry?
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              We also work with professional services, retail, real estate,
              hospitality, nonprofits, logistics, SMEs and other
              organizations.
            </p>

            <Link
              href="/industries/other-industries"
              className="mt-5 inline-block text-sm font-semibold text-[#39358C]"
            >
              Explore other industries →
            </Link>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-slate-50 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Why Techtrep
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Business-first technology.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                We don't recommend technology simply because it exists. We
                start with the business problem and work backwards toward the
                right solution.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {principles.map((principle, index) => (
                <div
                  key={principle}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <span className="text-sm font-semibold text-[#39358C]">
                    0{index + 1}
                  </span>

                  <span className="text-sm font-medium text-slate-800">
                    {principle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY BUILT */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[#39358C] p-8 text-white sm:p-12 lg:p-16">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
                Technology built by Techtrep
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                We don't just advise on technology. We build and operate it.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-violet-100">
                Techtrep's technology experience spans digital products,
                cloud infrastructure, automation, payments, document
                processing, publishing systems and software platforms.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {["Nexa", "PDFImageTools", "Techtrep Media"].map((name) => (
                <div
                  key={name}
                  className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur"
                >
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="mt-2 text-sm leading-6 text-violet-100">
                    Technology designed, built or operated by the Techtrep
                    team.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              How we work
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              From business problem to working solution.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-5">
            {[
              ["01", "Audit", "Understand your business and technology environment."],
              ["02", "Discover", "Identify the highest-value opportunities."],
              ["03", "Design", "Define a practical solution and roadmap."],
              ["04", "Implement", "Build, integrate, test and deploy."],
              ["05", "Improve", "Support, monitor and continuously improve."],
            ].map(([number, title, description]) => (
              <div key={number}>
                <span className="text-sm font-semibold text-[#39358C]">
                  {number}
                </span>

                <h3 className="mt-5 text-xl font-semibold text-slate-950">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-slate-200 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
            Start with the problem
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            What is slowing your business down?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Tell us what your team is doing manually, where customers are
            getting stuck or which systems aren't working together.
          </p>

          <div className="mt-9">
            <Link
              href="/free-technology-audit"
              className="inline-flex items-center justify-center rounded-xl bg-[#39358C] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#2f2b76]"
            >
              Get Your Free Technology Audit
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
