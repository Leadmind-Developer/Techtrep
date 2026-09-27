import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Networking & Infrastructure Solutions",
  description:
    "Techtrep provides networking and infrastructure services including ISP connectivity, last-mile connectivity, LAN, Wi-Fi, structured cabling, security-camera cabling, solar cabling, device installation and endpoint connectivity.",
};

const services = [
  {
    title: "ISP Connectivity",
    description:
      "Help assess and implement internet connectivity suitable for your organization's location, users and operational requirements.",
    items: [
      "Connectivity requirements assessment",
      "ISP coordination",
      "Internet access setup",
      "Router and network configuration",
      "Connectivity troubleshooting",
    ],
  },
  {
    title: "Last-Mile Connectivity",
    description:
      "Extend connectivity from the available service point to the location where your organization needs reliable access.",
    items: [
      "Last-mile connectivity planning",
      "Site connectivity assessment",
      "Connection deployment",
      "Network handoff",
      "Connectivity testing",
    ],
  },
  {
    title: "LAN & Network Installation",
    description:
      "Build practical local networks that connect staff, devices, systems and shared resources across your premises.",
    items: [
      "LAN installation",
      "Network device deployment",
      "Switch configuration",
      "Network segmentation",
      "Network testing and troubleshooting",
    ],
  },
  {
    title: "Wi-Fi Deployment",
    description:
      "Design and deploy Wi-Fi coverage for offices, schools, hotels, clinics, churches, media facilities and other environments.",
    items: [
      "Wi-Fi coverage assessment",
      "Access point installation",
      "Network configuration",
      "User and device connectivity",
      "Coverage and performance testing",
    ],
  },
  {
    title: "Structured Cabling",
    description:
      "Install and organize the physical cabling infrastructure required to connect network equipment and endpoints.",
    items: [
      "Network cabling",
      "Cable routing",
      "Termination",
      "Cable organization",
      "Testing and identification",
    ],
  },
  {
    title: "Security-Camera Cabling",
    description:
      "Provide the cabling and connectivity infrastructure required for security-camera deployments.",
    items: [
      "Camera cable routing",
      "Network connectivity",
      "PoE infrastructure",
      "Device connection",
      "Installation testing",
    ],
  },
  {
    title: "Solar Cabling",
    description:
      "Support solar installations with appropriate cabling and connectivity infrastructure as part of broader site technology deployments.",
    items: [
      "Solar cable routing",
      "Site cabling",
      "Equipment connections",
      "Cable organization",
      "Installation support",
    ],
  },
  {
    title: "Device & Endpoint Installation",
    description:
      "Connect and configure the devices employees and customers rely on to access your network and digital systems.",
    items: [
      "Computer installation",
      "Printers and shared devices",
      "Network equipment",
      "Access points",
      "Endpoint connectivity",
    ],
  },
];

const environments = [
  {
    title: "Offices",
    description:
      "Reliable connectivity for staff, computers, printers, cloud applications, meetings and business systems.",
  },
  {
    title: "Schools",
    description:
      "Connectivity across administrative offices, classrooms, staff areas, digital learning spaces and other facilities.",
  },
  {
    title: "Hotels",
    description:
      "Network infrastructure supporting staff operations, guest connectivity and connected technology across the property.",
  },
  {
    title: "Clinics",
    description:
      "Practical network infrastructure for administrative areas, connected devices, internet access and operational systems.",
  },
  {
    title: "Churches",
    description:
      "Connectivity for offices, worship facilities, media teams, events, digital services and connected devices.",
  },
  {
    title: "Media Facilities",
    description:
      "Infrastructure for production environments, publishing operations, connected devices, internet access and audience-facing technology.",
  },
  {
    title: "Retail & Warehouses",
    description:
      "Connectivity for staff devices, point-of-sale environments, inventory operations, security systems and other endpoints.",
  },
  {
    title: "Other Facilities",
    description:
      "Infrastructure can be designed around the physical environment, technology requirements and operational needs of your organization.",
  },
];

const process = [
  {
    number: "01",
    title: "Assess",
    description:
      "We understand the site, users, devices, connectivity requirements and existing infrastructure before recommending an approach.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We determine the appropriate connectivity, network layout, cabling and equipment requirements for the environment.",
  },
  {
    number: "03",
    title: "Install",
    description:
      "We deploy the agreed cabling, network equipment, connectivity and endpoints according to the implementation plan.",
  },
  {
    number: "04",
    title: "Connect",
    description:
      "We configure the relevant network components and connect the required devices and services.",
  },
  {
    number: "05",
    title: "Test",
    description:
      "We test connectivity and verify that the installed infrastructure performs as expected.",
  },
  {
    number: "06",
    title: "Support",
    description:
      "Where required, ongoing technology support and maintenance can help keep the infrastructure working as the organization changes.",
  },
];

const faqs = [
  {
    question: "Can Techtrep work with our existing ISP?",
    answer:
      "Yes. We can work with your existing ISP where appropriate and help assess the connectivity, network and site requirements around the service.",
  },
  {
    question: "Do you provide LAN installation?",
    answer:
      "Yes. Our networking services include LAN installation, network cabling, network device deployment, configuration, testing and troubleshooting.",
  },
  {
    question: "Do you install Wi-Fi networks?",
    answer:
      "Yes. We can assess the environment, deploy access points, configure the network and test coverage and connectivity.",
  },
  {
    question: "Do you handle last-mile connectivity?",
    answer:
      "Yes. Last-mile connectivity is part of our infrastructure offering. The specific deployment approach depends on the location, available connectivity options and site requirements.",
  },
  {
    question: "Can you handle security-camera cabling?",
    answer:
      "Yes. We provide security-camera cabling and the associated network infrastructure needed to connect cameras and related equipment.",
  },
  {
    question: "Do you handle solar cabling?",
    answer:
      "Yes. Solar cabling and site infrastructure can be handled as part of the broader cabling and connectivity requirements for a project. The exact scope is assessed based on the installation.",
  },
  {
    question: "Can you install and connect devices?",
    answer:
      "Yes. We can install and connect computers, printers, network equipment, access points and other business endpoints as part of an infrastructure deployment.",
  },
  {
    question: "Can you maintain the network after installation?",
    answer:
      "Yes. Ongoing monitoring, troubleshooting, maintenance and technology support can be provided through our Managed Technology services.",
  },
];

export default function NetworkingInfrastructurePage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Networking & Infrastructure
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Connect your business from ISP to endpoint.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Techtrep provides practical networking and infrastructure
              services covering ISP connectivity, last-mile connectivity, LAN,
              Wi-Fi, structured cabling, security-camera cabling, solar
              cabling, device installation and endpoint connectivity.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
              >
                Discuss Your Infrastructure
              </Link>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Start a Free Technology Audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Connectivity stack */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              End-to-end connectivity
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              The infrastructure behind your digital operations.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Internet access is only one part of a working technology
              environment. The connection has to reach your premises, move
              through the network and ultimately reach the people and devices
              that need it.
            </p>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-7">
            {[
              "ISP",
              "Last Mile",
              "LAN",
              "Wi-Fi",
              "Cabling",
              "Devices",
              "Endpoints",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-3 md:block">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#39358C] text-sm font-bold text-white md:h-16 md:w-full">
                  {index + 1}
                </div>

                <div className="md:mt-4">
                  <p className="text-sm font-bold text-slate-950">{item}</p>
                  {index < 6 && (
                    <p className="mt-1 text-xs text-slate-500 md:hidden">
                      →
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <p className="text-sm leading-7 text-slate-700">
              <strong className="text-slate-950">The goal:</strong> a
              connected environment where your internet service, internal
              network, physical infrastructure and business devices work
              together reliably.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              What we do
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Networking, cabling and connectivity services.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              We can handle individual infrastructure requirements or combine
              several services into one coordinated deployment.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.items.map((item) => (
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

      {/* Who it is for */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
                Built around the environment
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Infrastructure for different operating environments.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Network requirements vary considerably between organizations.
                We consider the physical environment, number of users,
                devices, applications and connectivity requirements when
                planning an installation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {environments.map((environment) => (
                <div
                  key={environment.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-lg font-bold text-slate-950">
                    {environment.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {environment.description}
                  </p>
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
              How we work
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From site assessment to working connectivity.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Good infrastructure starts with understanding what the
              organization actually needs. We approach deployments as a
              connected system rather than a collection of individual
              installations.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {process.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <p className="text-sm font-bold text-[#39358C]">
                  {step.number}
                </p>

                <h3 className="mt-4 text-xl font-bold text-slate-950">
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

      {/* Combined technology */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-slate-950 px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  More than connectivity
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Infrastructure that supports the rest of your technology.
                </h2>

                <p className="mt-5 text-base leading-7 text-white/70">
                  Networking often sits underneath your websites,
                  applications, cloud services, security systems, business
                  devices and automated workflows. That is why infrastructure
                  can be combined with our broader technology services when a
                  project requires it.
                </p>
              </div>

              <Link
                href="/solutions/managed-technology"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
              >
                Explore Managed Technology
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related solutions */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Related solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Infrastructure can be part of a larger technology project.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Link
              href="/solutions/digital-foundation"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Digital Foundation
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Build the digital foundation your organization needs across
                websites, systems and technology.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/custom-technology"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Custom Technology
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Build technology around a workflow when existing tools are not
                enough.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>

            <Link
              href="/solutions/managed-technology"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#39358C]/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-950">
                Managed Technology
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Keep your infrastructure and technology working with ongoing
                support and maintenance.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#39358C]">
                Explore →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
              Frequently asked questions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Questions about networking and infrastructure
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 px-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-slate-950">
                  <span>{faq.question}</span>

                  <span
                    className="shrink-0 text-xl font-normal text-[#39358C] transition-transform group-open:rotate-45"
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

      {/* CTA */}
      <section className="bg-[#39358C]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Plan your infrastructure
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let&apos;s build a network that supports the way you work.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              Tell us about your location, connectivity requirements,
              existing infrastructure and the devices your organization needs
              to connect.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#39358C] transition-colors hover:bg-slate-100"
              >
                Discuss Your Project
              </Link>

              <Link
                href="/free-technology-audit"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Start a Free Technology Audit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}