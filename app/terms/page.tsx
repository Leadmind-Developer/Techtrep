export const metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for the Techtrep Business Solutions website and information provided through the website.",
};

const sections = [
  {
    title: "1. About these terms",
    content: (
      <p>
        These Terms of Use govern your use of the Techtrep Business Solutions
        website. By accessing or using the website, you agree to use it
        responsibly and in accordance with these terms and applicable law.
      </p>
    ),
  },
  {
    title: "2. Website information",
    content: (
      <>
        <p>
          We aim to keep information on this website useful and reasonably
          accurate. However, website content is provided for general
          informational purposes and may change as our services, technology
          capabilities and business offerings develop.
        </p>

        <p>
          Descriptions of services, pricing references, project examples and
          other information on the website should not be interpreted as a
          binding quotation, service agreement or guarantee of a particular
          result unless expressly confirmed in a separate agreement.
        </p>
      </>
    ),
  },
  {
    title: "3. Technology audits",
    content: (
      <>
        <p>
          A Free Technology Audit is intended to provide an initial assessment
          of potential technology opportunities. It is not a guarantee that a
          particular technology solution will be recommended or implemented.
        </p>

        <p>
          Recommendations may depend on information supplied by the
          organization, technical constraints, available systems, budget,
          security requirements and other factors identified during the
          assessment.
        </p>
      </>
    ),
  },
  {
    title: "4. Professional services",
    content: (
      <p>
        Specific technology projects and services are subject to their own
        agreed scope, specifications, commercial terms, timelines,
        responsibilities and acceptance criteria. Where there is a conflict
        between these website terms and a signed or otherwise expressly agreed
        service contract, the applicable service contract will govern the
        relevant engagement.
      </p>
    ),
  },
  {
    title: "5. Intellectual property",
    content: (
      <>
        <p>
          Unless otherwise stated, website content including text, branding,
          graphics, layouts and other original materials belongs to Techtrep or
          is used with appropriate permission.
        </p>

        <p>
          You may not reproduce, modify, distribute, sell or commercially
          exploit substantial portions of website content without appropriate
          permission.
        </p>

        <p>
          Intellectual property relating to software, designs, documentation,
          configurations and other deliverables created during a client
          engagement will be governed by the applicable project agreement.
        </p>
      </>
    ),
  },
  {
    title: "6. Acceptable use",
    content: (
      <>
        <p>You agree not to use the website to:</p>

        <ul>
          <li>Attempt unauthorized access to systems or accounts.</li>
          <li>Introduce malicious software or harmful code.</li>
          <li>Interfere with the availability or operation of the website.</li>
          <li>Submit fraudulent, unlawful or deliberately misleading information.</li>
          <li>Use the website for activity that violates applicable law.</li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Third-party services and links",
    content: (
      <p>
        The website may reference or link to third-party products, platforms,
        services or websites. Such references do not necessarily constitute an
        endorsement or guarantee by Techtrep. Third-party services are subject
        to their own terms, availability and policies.
      </p>
    ),
  },
  {
    title: "8. Availability",
    content: (
      <p>
        We may change, suspend or discontinue parts of the website without
        prior notice. We do not guarantee that the website will always be
        available, uninterrupted or free from errors.
      </p>
    ),
  },
  {
    title: "9. Limitation of responsibility",
    content: (
      <p>
        To the extent permitted by applicable law, information provided through
        this website is supplied without warranties that are not expressly
        stated. Techtrep is not responsible for losses arising solely from
        reliance on general website information where no separate contractual
        relationship or service agreement exists.
      </p>
    ),
  },
  {
    title: "10. Changes to these terms",
    content: (
      <p>
        We may update these Terms of Use when the website, services or
        applicable requirements change. The updated version will be published
        on this page.
      </p>
    ),
  },
  {
    title: "11. Contact",
    content: (
      <>
        <p>
          Questions concerning these Terms of Use can be directed to:
        </p>

        <p>
          <strong>Techtrep Business Solutions</strong>
          <br />
          Email:{" "}
          <a
            href="mailto:email@thetechtrep.com"
            className="text-[#39358C] hover:underline"
          >
            email@thetechtrep.com
          </a>
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
            Legal
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Terms of Use
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            These terms explain the basic conditions for using the Techtrep
            Business Solutions website and engaging with information provided
            through it.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Effective date: September 27, 2026
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            These website terms are separate from the commercial terms that may
            apply to a specific technology project or service engagement.
          </div>

          <div className="mt-12 space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4 text-base leading-8 text-slate-600 [&_li]:ml-5 [&_li]:list-disc">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}