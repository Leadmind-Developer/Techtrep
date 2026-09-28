import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import ServiceSchema from "@/components/ServiceSchema";

const foundationAreas = [
  {
    title: "Business Website",
    description:
      "A professional website that clearly communicates what you do, who you serve and how customers can engage with your organization.",
    items: [
      "Professional business website",
      "Mobile-responsive experience",
      "Service and information pages",
      "Search-engine-friendly structure",
    ],
  },
  {
    title: "Digital Enquiries",
    description:
      "Make it easier for prospects, customers, students, guests or members to contact your organization and start the right process.",
    items: [
      "Online enquiry forms",
      "Lead and contact capture",
      "Automated notifications",
      "Structured enquiry information",
    ],
  },
  {
    title: "Digital Workflows",
    description:
      "Move important processes away from scattered spreadsheets, emails and paper-based work into structured digital workflows.",
    items: [
      "Online forms and submissions",
      "Approval workflows",
      "Internal notifications",
      "Process tracking",
    ],
  },
  {
    title: "Business Systems",
    description:
      "Create the foundations for the systems your organization needs as it grows.",
    items: [
      "Customer or member portals",
      "Staff-facing tools",
      "Database-backed applications",
      "Integration-ready systems",
    ],
  },
];

const useCases = [
  {
    title: "Schools",
    description:
      "Improve admissions enquiries, parent communication, online forms, information delivery and administrative workflows.",
  },
  {
    title: "Hotels",
    description:
      "Improve online visibility, enquiries, booking-related workflows, guest communication and internal processes.",
  },
  {
    title: "Clinics",
    description:
      "Create clearer digital touchpoints for patients while improving enquiries, communication and administrative workflows.",
  },
  {
    title: "Churches",
    description:
      "Support communication, event registration, member engagement, enquiries, giving-related workflows and administration.",
  },
  {
    title: "Media & Entertainment",
    description:
      "Build digital platforms for audiences, events, advertising, sponsorship, content workflows and audience engagement.",
  },
  {
    title: "Growing Businesses",
    description:
      "Replace disconnected digital tools with a more structured foundation for customers, operations and future automation.",
  },
];

const deliverables = [
  "Business and technology requirements discovery",
  "Website or digital platform design",
  "Responsive frontend implementation",
  "Forms and enquiry capture",
  "Database and data structure where required",
  "Email and notification workflows",
  "Basic analytics and measurement",
  "Search-engine-friendly technical foundation",
  "Security and deployment configuration",
  "Documentation and handover",
];

const process = [
  {
    number: "01",
    title: "Understand",
    description:
      "We learn how your organization currently operates, what customers or users need and where your existing digital tools are falling short.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We define the pages, workflows, functionality and technical architecture required for the project.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We design and implement the digital foundation, testing the experience across devices and the key workflows your organization depends on.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "We configure the production environment, connect required services and help your team transition to the new system.",
  },
  {
    number: "05",
    title: "Improve",
    description:
      "Once the foundation is live, we can identify opportunities for automation, analytics, integrations and AI.",
  },
];

const faqs = [
  {
    question: "Is Digital Foundation just website design?",
    answer:
      "No. A website can be part of the solution, but the focus is the broader digital foundation of the business. Depending on your needs, this can include websites, forms, workflows, databases, portals, notifications, integrations and analytics.",
  },
  {
    question: "Can you work with our existing website?",
    answer:
      "Yes. If your existing website is still suitable, we can improve or extend it rather than replacing it unnecessarily. We first assess what you already have and recommend the most practical approach.",
  },
  {
    question: "Can the system be expanded later?",
    answer:
      "Yes. We design the foundation with future improvements in mind. Additional workflows, integrations, dashboards, automation and AI capabilities can be introduced as your requirements grow.",
  },
  {
    question: "Do you provide hosting and deployment?",
    answer:
      "Yes. Where appropriate, we can configure and deploy the solution using suitable cloud or hosting infrastructure. Third-party infrastructure and usage charges are normally billed separately from our implementation fee.",
  },
  {
    question: "How much does Digital Foundation cost?",
    answer:
      "Digital Foundation projects typically start from ₦250,000, with the final cost depending on the number of pages, functionality, integrations, content requirements and technical complexity.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "A focused digital foundation can often be delivered within a few weeks. Larger projects take longer depending on the scope, content readiness, integrations and approval process. We provide a project timeline before implementation begins.",
  },
];

export const metadata = createPageMetadata({
  title: "Digital Foundation Solutions",
  description:
    "Build the digital systems your business needs to operate professionally, communicate with customers and capture opportunities.",
  path: "/solutions/digital-foundation",
});

export default function DigitalFoundationPage() {
  return (
     <>
         <ServiceSchema
            name="Digital Foundation Solutions"
            description="Build the digital foundation your organization needs with business websites, digital platforms, forms, portals, lead capture and operational workflows."
            path="/solutions/digital-foundation"
            serviceType="Digital Transformation"
           />
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#39358C] hover:text-[#2f2b76]"
            >
              <span aria-hidden="true">←</span>
              All Solutions
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Digital Foundation
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Build the digital foundation your business can grow on.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Create the websites, digital platforms, forms and operational
              systems your organization needs to communicate professionally,
              capture opportunities and work more efficiently.
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
                Discuss Your Project
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <span>Starting from ₦250,000</span>
              <span>•</span>
              <span>Built around your business</span>
              <span>•</span>
              <span>Designed for future growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                The problem
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your digital presence should help the business work.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                Many organizations have a website, social media accounts,
                spreadsheets, messaging apps and several other digital tools
                but still rely heavily on manual processes.
              </p>

              <p>
                Customer enquiries may arrive through different channels.
                Staff may copy information from one system to another.
                Important requests can remain buried in email or messaging
                conversations. Management may have little visibility into
                what is happening.
              </p>

              <p>
                Adding another disconnected tool does not necessarily solve
                the problem.
              </p>

              <p className="font-semibold text-slate-900">
                A strong digital foundation connects the important pieces
                and creates a better starting point for automation,
                analytics and future growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we build
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              The building blocks of a better digital operation.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Your project can include one or several of these components,
              depending on what your organization actually needs.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {foundationAreas.map((area) => (
              <article
                key={area.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {area.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {area.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Common applications
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Digital foundations for different types of organizations.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              The technology changes according to the organization. The
              objective remains the same: create a better digital way to
              operate and engage with people.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {useCase.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                What&apos;s included
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                A foundation built around your requirements.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                We scope each project around your organization rather than
                forcing every client into the same package.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8">
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#39358C]"
                      aria-hidden="true"
                    />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Implementation
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From business requirement to working system.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We keep implementation structured so you understand what is
              being built, why it is being built and what happens next.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {process.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-200 p-6"
              >
                <span className="text-sm font-bold tracking-[0.15em] text-[#39358C]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
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

      {/* Pricing */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Investment
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Digital Foundation
            </h2>

            <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              From ₦250,000
            </p>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Final pricing depends on the scope of the project, number of
              pages or modules, integrations, content requirements and
              technical complexity.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              Hosting, domain registration, paid third-party services,
              messaging, AI usage and other external infrastructure costs
              may be billed separately where applicable.
            </p>

            <Link
              href="/free-technology-audit"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
            >
              Find Out What Your Business Needs
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              FAQ
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Questions about Digital Foundation
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-slate-950">
                  <span>{faq.question}</span>

                  <span
                    className="shrink-0 text-xl font-normal text-slate-400 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>

                <p className="mt-4 max-w-3xl pr-8 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Build a better foundation
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let&apos;s build the digital systems your business actually
              needs.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/80">
              Start with a free technology audit and we&apos;ll help identify
              where your current digital setup can be improved, connected or
              replaced.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Request Your Free Audit
              </Link>

              <Link
                href="/solutions/business-automation"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Business Automation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}