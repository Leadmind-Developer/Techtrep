import Link from "next/link";
import AuditForm from "@/components/audit/AuditForm";

const auditAreas = [
  {
    number: "01",
    title: "Customer enquiries",
    description:
      "How customers discover you, contact you and move from enquiry to action.",
  },
  {
    number: "02",
    title: "Communication",
    description:
      "WhatsApp, email, forms, notifications and repetitive customer communication.",
  },
  {
    number: "03",
    title: "Internal workflows",
    description:
      "Tasks your staff repeatedly perform manually across the organization.",
  },
  {
    number: "04",
    title: "Existing systems",
    description:
      "The software and platforms you already use and how well they work together.",
  },
  {
    number: "05",
    title: "Data & reporting",
    description:
      "How information is collected, stored, accessed and turned into management insight.",
  },
  {
    number: "06",
    title: "Automation & AI",
    description:
      "Practical opportunities where automation or AI could improve operations.",
  },
];

const outcomes = [
  "A clearer view of your current technology environment",
  "Identification of repetitive processes that could be automated",
  "Practical opportunities to improve customer communication",
  "Potential integration opportunities between existing systems",
  "Ideas for dashboards, reporting and operational visibility",
  "Potential AI opportunities where they make business sense",
];

const process = [
  {
    number: "01",
    title: "Tell us about your business",
    description:
      "Complete the short audit form so we understand your organization before the conversation.",
  },
  {
    number: "02",
    title: "30–45 minute discovery",
    description:
      "We'll discuss how your business operates, where work gets repeated and where technology creates friction.",
  },
  {
    number: "03",
    title: "Identify opportunities",
    description:
      "We'll map practical areas where technology, automation, integration or AI could help.",
  },
  {
    number: "04",
    title: "Receive your recommendations",
    description:
      "You'll receive a concise Technology Opportunity Report with recommended next steps.",
  },
];

const faqs = [
  {
    question: "Is the Technology Audit really free?",
    answer:
      "Yes. The initial Technology Audit is free. It is designed to help us understand your business and identify practical opportunities before recommending any paid implementation.",
  },
  {
    question: "Do I need to be technical?",
    answer:
      "No. The conversation is about how your business operates, not about programming. You can simply explain what your staff do, what systems you use and where you experience problems.",
  },
  {
    question: "Do I have to buy anything after the audit?",
    answer:
      "No. There is no obligation to purchase a Techtrep service after the audit.",
  },
  {
    question: "How long does the audit take?",
    answer:
      "The discovery conversation typically takes around 30–45 minutes. The actual recommendations depend on the complexity of the organization.",
  },
  {
    question: "Can Techtrep work with software we already use?",
    answer:
      "Yes. In many situations, integration and improvement of existing systems is preferable to replacing everything. We assess the current environment before recommending changes.",
  },
  {
    question: "Can businesses outside your main industries request an audit?",
    answer:
      "Yes. Schools, hotels, clinics and churches are initial focus industries, but Techtrep works with organizations across sectors where technology can improve operations.",
  },
];

export default function FreeTechnologyAuditPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_15%,rgba(57,53,140,0.16),transparent_38%)]" />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-[#39358C]/15 bg-[#39358C]/5 px-4 py-2 text-sm font-semibold text-[#39358C]">
                Free Technology Audit
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Find out what your business could{" "}
                <span className="text-[#39358C]">improve or automate.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Tell us how your business works, where your team spends too
                much time manually and which systems are getting in the way.
                We'll help identify practical technology opportunities.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-700">
                <span>✓ 30–45 minute discovery</span>
                <span>✓ No obligation</span>
                <span>✓ Practical recommendations</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#39358C]">
                Start here
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                Tell us about your business.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Complete the short form and we'll follow up to arrange your
                Technology Audit.
              </p>

              <a
                href="#audit-form"
                className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#39358C] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2f2b76]"
              >
                Request My Free Audit →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Why an audit?
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Before changing your technology, understand the business.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-slate-600">
              <p>
                Businesses often add new software without first understanding
                the processes that need fixing.
              </p>

              <p>
                The result can be more tools, more subscriptions and more
                complexity without solving the original problem.
              </p>

              <p>
                Our Technology Audit starts from the opposite direction:
                understand how your organization works, identify the friction
                and then determine where technology can create value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE EXAMINE */}
      <section className="bg-slate-50 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we examine
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              We look at how technology fits into the way your business
              actually works.
            </h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auditAreas.map((area) => (
              <div
                key={area.number}
                className="rounded-3xl border border-slate-200 bg-white p-7"
              >
                <span className="text-sm font-semibold text-[#39358C]">
                  {area.number}
                </span>

                <h3 className="mt-8 text-xl font-semibold text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU RECEIVE */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                What you receive
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Practical recommendations, not a sales pitch.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                After the discovery conversation, we'll identify the
                opportunities that appear most relevant to your organization.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <div className="text-sm font-semibold text-[#39358C]">
                TECHNOLOGY OPPORTUNITY REPORT
              </div>

              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                Your technology improvement roadmap
              </h3>

              <div className="mt-7 space-y-4">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39358C] text-xs text-white">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-slate-700">
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-slate-950 py-24 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Four simple steps.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <div key={step.number}>
                <span className="text-sm font-semibold text-violet-300">
                  {step.number}
                </span>

                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Is this for you?
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The audit is particularly useful if your organization...
            </h2>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {[
                "Relies heavily on spreadsheets or manual processes",
                "Receives many enquiries through WhatsApp or other channels",
                "Uses several systems that don't communicate with each other",
                "Spends significant time sending reminders or follow-ups",
                "Struggles to get clear management reports",
                "Wants to explore practical AI opportunities",
                "Is growing and finding existing processes difficult to manage",
                "Needs a clearer technology roadmap",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 p-5 text-sm font-medium leading-6 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="audit-form" className="scroll-mt-24 bg-slate-50 py-24 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Request your audit
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Tell us about your business.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              The more context you provide, the better prepared we can be for
              the discovery conversation.
            </p>
          </div>

          <div className="mt-12">
            <AuditForm />
          </div>
        </div>
      </section>

      {/* AFTER SUBMISSION */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
            What happens next
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            We review your information before we speak.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Once your request is received, we'll review the information you
            provide and contact you to arrange a suitable time for the
            Technology Audit.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-24 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Frequently asked questions
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Before you request your audit
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-slate-950">
                  {faq.question}

                  <span className="text-xl text-[#39358C] transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-slate-200 py-24 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Tell us what your team is doing manually.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            We'll help you identify what can be improved, connected or
            automated.
          </p>

          <Link
            href="#audit-form"
            className="mt-8 inline-flex rounded-xl bg-[#39358C] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#2f2b76]"
          >
            Request Your Free Audit →
          </Link>
        </div>
      </section>
    </main>
  );
}
