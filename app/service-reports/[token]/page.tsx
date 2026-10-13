import { notFound } from "next/navigation";

import { hashServiceReportToken } from "@/lib/service-report-token";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ token: string }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(value) + " UTC";
}

function formatCurrency(value: { toString(): string }, currency: string) {
  const amount = Number(value.toString());

  if (!Number.isFinite(amount)) return "—";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ReportSection({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content?.trim()) return null;

  return (
    <section className="border-t border-slate-200 pt-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {content}
      </p>
    </section>
  );
}

export default async function CustomerServiceReportPage({
  params,
}: PageProps) {
  const { token } = await params;

  // Tokens created by Techtrep are 32 random bytes encoded as 64 hex characters.
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    notFound();
  }

  const tokenHash = hashServiceReportToken(token);

  const report = await prisma.serviceReport.findFirst({
    where: {
      publicTokenHash: tokenHash,
      publicTokenExpiresAt: { gt: new Date() },
      publicTokenRevokedAt: null,
      status: "FINALIZED",
      finalizedAt: { not: null },
    },
    select: {
      reportNumber: true,
      reportDate: true,
      reportingPeriodStart: true,
      reportingPeriodEnd: true,
      finalizedAt: true,
      executiveSummary: true,
      workPerformed: true,
      incidentSummary: true,
      recommendations: true,
      nextSteps: true,
      totalRequests: true,
      resolvedRequests: true,
      openRequests: true,
      urgentRequests: true,
      slaEligibleRequests: true,
      slaMetRequests: true,
      slaBreachedRequests: true,
      slaComplianceRate: true,
      billingCurrency: true,
      totalInvoiced: true,
      totalPaid: true,
      totalOutstanding: true,
      organization: {
        select: { name: true },
      },
      managedService: {
        select: {
          serviceNumber: true,
          name: true,
        },
      },
      preparedBy: {
        select: { name: true },
      },
    },
  });

  if (!report) {
    notFound();
  }

  const currency = report.billingCurrency || "NGN";
  const slaRate = report.slaComplianceRate?.toString();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-t-2xl bg-[#39358c] p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            Techtrep Business Solutions
          </p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            Managed Service Report
          </h1>

          <p className="mt-2 text-sm text-white/85">
            {report.reportNumber}
          </p>
        </header>

        <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Prepared for</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {report.organization.name}
              </h2>

              <p className="mt-3 text-sm text-slate-600">
                {report.managedService.name}
              </p>
              <p className="text-xs text-slate-500">
                Service reference: {report.managedService.serviceNumber}
              </p>

              <p className="mt-4 text-sm text-slate-600">
                Reporting period: {formatDate(report.reportingPeriodStart)}
                {" – "}
                {formatDate(report.reportingPeriodEnd)}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Report date: {formatDate(report.reportDate)}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Finalized: {formatDateTime(report.finalizedAt!)}
              </p>
            </div>

            <a
              href={`/api/service-reports/${token}/pdf`}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#39358c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f2b76]"
            >
              Download PDF
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Metric label="Total requests" value={report.totalRequests} />
            <Metric label="Resolved requests" value={report.resolvedRequests} />
            <Metric label="Open requests" value={report.openRequests} />
            <Metric label="Urgent requests" value={report.urgentRequests} />
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              SLA performance
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Metric
                label="SLA-eligible requests"
                value={report.slaEligibleRequests}
              />
              <Metric label="SLA met" value={report.slaMetRequests} />
              <Metric label="SLA breached" value={report.slaBreachedRequests} />
            </div>

            <p className="mt-3 text-sm text-slate-600">
              SLA compliance:{" "}
              <span className="font-semibold text-slate-900">
                {slaRate == null ? "Not available" : `${slaRate}%`}
              </span>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Billing summary
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Metric
                label="Total invoiced"
                value={formatCurrency(report.totalInvoiced, currency)}
              />
              <Metric
                label="Total paid"
                value={formatCurrency(report.totalPaid, currency)}
              />
              <Metric
                label="Outstanding"
                value={formatCurrency(report.totalOutstanding, currency)}
              />
            </div>
          </section>

          <div className="mt-8 space-y-6">
            <ReportSection
              title="Executive summary"
              content={report.executiveSummary}
            />
            <ReportSection
              title="Work performed"
              content={report.workPerformed}
            />
            <ReportSection
              title="Incident summary"
              content={report.incidentSummary}
            />
            <ReportSection
              title="Recommendations"
              content={report.recommendations}
            />
            <ReportSection
              title="Next steps"
              content={report.nextSteps}
            />
          </div>

          <footer className="mt-8 border-t border-slate-200 pt-5 text-xs leading-6 text-slate-500">
            <p>
              This is a finalized service report prepared by Techtrep Business
              Solutions.
            </p>
            {report.preparedBy?.name && (
              <p>Prepared by: {report.preparedBy.name}</p>
            )}
            <p>
              This private report link expires automatically. Contact Techtrep
              if you need access restored.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
