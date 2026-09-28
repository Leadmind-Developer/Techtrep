import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read the Techtrep Business Solutions privacy policy covering information collected through our website, enquiries, technology audits and communications.",
  path: "/privacy-policy",
});

const sections = [
  {
    title: "1. Information we collect",
    content: (
      <>
        <p>
          When you interact with Techtrep Business Solutions through this
          website, we may receive information that you voluntarily provide.
          This may include your name, organization name, email address, phone
          number, website address, industry, organization size and information
          about your technology requirements.
        </p>

        <p>
          If you request a Free Technology Audit, you may also provide
          information about your business processes, existing systems,
          operational challenges, automation opportunities and other
          information relevant to the requested assessment.
        </p>

        <p>
          Please do not submit passwords, payment credentials, patient records,
          financial account credentials or other highly sensitive information
          through public website forms.
        </p>
      </>
    ),
  },
  {
    title: "2. How we use information",
    content: (
      <>
        <p>Information submitted to us may be used to:</p>

        <ul>
          <li>Respond to enquiries and requests.</li>
          <li>Arrange or prepare for a technology audit.</li>
          <li>Understand your organization&apos;s technology requirements.</li>
          <li>Prepare proposals or discuss potential services.</li>
          <li>Communicate with you about an enquiry or requested service.</li>
          <li>Maintain appropriate business and service records.</li>
          <li>Protect the security and integrity of our systems.</li>
        </ul>

        <p>
          We aim to use personal information for specified and legitimate
          purposes and to avoid collecting information that is unnecessary for
          the purpose for which it is requested.
        </p>
      </>
    ),
  },
  {
    title: "3. Information you should not submit",
    content: (
      <p>
        Website forms are not intended for the submission of passwords,
        authentication secrets, payment-card information, medical or patient
        records, financial credentials, or other sensitive personal information
        that is not necessary for an enquiry or technology assessment. If a
        project requires the handling of sensitive information, appropriate
        technical and contractual arrangements should be established before
        that information is transferred.
      </p>
    ),
  },
  {
    title: "4. Sharing information",
    content: (
      <>
        <p>
          We do not intend to sell personal information submitted through this
          website.
        </p>

        <p>
          Information may need to be shared with service providers or
          technology partners where reasonably necessary to operate the
          website, communicate with you, provide a requested service or
          implement a project. Where third parties are involved in processing
          personal information, appropriate arrangements should be considered
          based on the nature of the processing.
        </p>

        <p>
          We may also disclose information where required by applicable law or
          where reasonably necessary to protect our rights, systems or users.
        </p>
      </>
    ),
  },
  {
    title: "5. Data security",
    content: (
      <p>
        We take reasonable technical and organizational measures to protect
        information against unauthorized access, loss, misuse, alteration or
        disclosure. However, no internet transmission or electronic storage
        system can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    title: "6. Data retention",
    content: (
      <p>
        We retain information for as long as reasonably necessary for the
        purpose for which it was collected, to manage an ongoing business
        relationship, to maintain appropriate business records, or where
        retention is otherwise required or permitted by applicable law. The
        appropriate retention period may vary depending on the nature of the
        information and the reason it was collected.
      </p>
    ),
  },
  {
    title: "7. Your privacy rights",
    content: (
      <>
        <p>
          Depending on the circumstances and applicable law, individuals may
          have rights relating to their personal information, including rights
          concerning access, correction, deletion, restriction or objection to
          certain processing.
        </p>

        <p>
          If you would like to make a privacy-related request concerning
          information you have provided to us, contact us using the details
          below. We may need to verify the identity of the person making a
          request before acting on it.
        </p>
      </>
    ),
  },
  {
    title: "8. Cookies and similar technologies",
    content: (
      <p>
        This website may use technical mechanisms necessary for its operation.
        If analytics, advertising, authentication or other technologies that
        use cookies or similar identifiers are introduced, this policy may be
        updated to describe their purposes and the choices available to
        visitors.
      </p>
    ),
  },
  {
    title: "9. Third-party websites",
    content: (
      <p>
        Our website may contain links to external websites and services. Those
        websites operate under their own privacy practices. We are not
        responsible for the privacy practices or content of third-party
        websites.
      </p>
    ),
  },
  {
    title: "10. Changes to this policy",
    content: (
      <p>
        We may update this Privacy Policy when our website, services, data
        practices or applicable requirements change. The latest version will be
        published on this page with an updated effective date.
      </p>
    ),
  },
  {
    title: "11. Contact",
    content: (
      <>
        <p>
          For privacy questions or requests concerning information submitted
          through this website, contact:
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

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
            Legal
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            This Privacy Policy explains how Techtrep Business Solutions
            handles information submitted through this website.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Effective date: September 27, 2026
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            This policy is intended to describe our current website practices.
            It should be reviewed and updated if our data processing, analytics,
            marketing, authentication or third-party service arrangements
            change.
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