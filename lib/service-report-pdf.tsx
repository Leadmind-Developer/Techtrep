import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type ServiceReportPdfProps = {
  reportNumber: string;
  reportDate: Date;
  reportingPeriodStart: Date;
  reportingPeriodEnd: Date;
  organizationName: string;
  serviceNumber: string;
  serviceName: string;
  preparedByName: string | null;
  executiveSummary: string | null;
  workPerformed: string | null;
  incidentSummary: string | null;
  recommendations: string | null;
  nextSteps: string | null;
  totalRequests: number;
  resolvedRequests: number;
  openRequests: number;
  urgentRequests: number;
  slaEligibleRequests: number;
  slaMetRequests: number;
  slaBreachedRequests: number;
  slaComplianceRate: unknown;
  billingCurrency: string;
  totalInvoiced: unknown;
  totalPaid: unknown;
  totalOutstanding: unknown;
  finalizedAt: Date | null;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingBottom: 48,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#334155",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  brand: {
    fontSize: 17,
    fontWeight: 700,
    color: "#39358c",
  },
  brandSubtext: {
    marginTop: 4,
    fontSize: 8,
    color: "#64748b",
  },
  reportLabel: {
    fontSize: 8,
    textAlign: "right",
    color: "#64748b",
  },
  reportNumber: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: 700,
    textAlign: "right",
    color: "#0f172a",
  },
  titleSection: {
    marginTop: 22,
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#39358c",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 6,
    fontSize: 23,
    fontWeight: 700,
    color: "#0f172a",
  },
  period: {
    marginTop: 7,
    fontSize: 10,
    color: "#64748b",
  },
  clientSection: {
    marginTop: 20,
    padding: 13,
    borderRadius: 5,
    backgroundColor: "#f8fafc",
  },
  label: {
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 0.7,
    color: "#64748b",
    textTransform: "uppercase",
  },
  clientName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
  },
  detail: {
    marginTop: 4,
    fontSize: 9,
    color: "#475569",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.55,
    color: "#475569",
  },
  emptyText: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#94a3b8",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricCard: {
    width: "23.5%",
    padding: 9,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 7,
    color: "#64748b",
  },
  metricValue: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 700,
    color: "#39358c",
  },
  table: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableLabel: {
    fontSize: 9,
    color: "#475569",
  },
  tableValue: {
    fontSize: 9,
    fontWeight: 700,
    color: "#0f172a",
  },
  footer: {
    position: "absolute",
    left: 42,
    right: 42,
    bottom: 22,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
  },
});

function formatDate(value: Date | null): string {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

function formatMoney(
  value: unknown,
  currency: string,
): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `${currency} —`;
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function formatPercentage(value: unknown): string {
  const rate = Number(value);

  return value === null ||
    value === undefined ||
    !Number.isFinite(rate)
    ? "N/A"
    : `${rate.toFixed(2)}%`;
}

function NarrativeSection({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  return (
    <View style={styles.section} wrap>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={content?.trim() ? styles.paragraph : styles.emptyText}>
        {content?.trim() || "No information provided."}
      </Text>
    </View>
  );
}

export default function ServiceReportPdf({
  reportNumber,
  reportDate,
  reportingPeriodStart,
  reportingPeriodEnd,
  organizationName,
  serviceNumber,
  serviceName,
  preparedByName,
  executiveSummary,
  workPerformed,
  incidentSummary,
  recommendations,
  nextSteps,
  totalRequests,
  resolvedRequests,
  openRequests,
  urgentRequests,
  slaEligibleRequests,
  slaMetRequests,
  slaBreachedRequests,
  slaComplianceRate,
  billingCurrency,
  totalInvoiced,
  totalPaid,
  totalOutstanding,
  finalizedAt,
}: ServiceReportPdfProps) {
  return (
    <Document
      title={`${reportNumber} - Service Report`}
      author="Techtrep Business Solutions"
      subject={`Managed service report for ${serviceName}`}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              Techtrep Business Solutions
            </Text>
            <Text style={styles.brandSubtext}>
              Technology, Automation & AI for Growing Businesses
            </Text>
          </View>

          <View>
            <Text style={styles.reportLabel}>SERVICE REPORT</Text>
            <Text style={styles.reportNumber}>{reportNumber}</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>Managed Services</Text>
          <Text style={styles.title}>Service Report</Text>
          <Text style={styles.period}>
            Reporting period: {formatDate(reportingPeriodStart)}
            {" — "}
            {formatDate(reportingPeriodEnd)}
          </Text>
          <Text style={styles.detail}>
            Report date: {formatDate(reportDate)}
          </Text>
        </View>

        <View style={styles.clientSection}>
          <Text style={styles.label}>Prepared for</Text>
          <Text style={styles.clientName}>{organizationName}</Text>
          <Text style={styles.detail}>
            Service: {serviceName}
          </Text>
          <Text style={styles.detail}>
            Service reference: {serviceNumber}
          </Text>
          {preparedByName && (
            <Text style={styles.detail}>
              Prepared by: {preparedByName}
            </Text>
          )}
        </View>

        <NarrativeSection
          title="Executive Summary"
          content={executiveSummary}
        />

        <View style={styles.section} wrap>
          <Text style={styles.sectionTitle}>
            Service Performance
          </Text>

          <View style={styles.metricGrid}>
            {[
              ["Total Requests", totalRequests],
              ["Resolved / Closed", resolvedRequests],
              ["Open Requests", openRequests],
              ["Urgent Requests", urgentRequests],
            ].map(([label, value]) => (
              <View key={String(label)} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{String(label)}</Text>
                <Text style={styles.metricValue}>{String(value)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.table}>
            {[
              ["SLA-eligible requests", slaEligibleRequests],
              ["SLA targets met", slaMetRequests],
              ["SLA breaches", slaBreachedRequests],
              ["SLA compliance", formatPercentage(slaComplianceRate)],
            ].map(([label, value], index, rows) => (
              <View
                key={String(label)}
                style={
                  index === rows.length - 1
                    ? styles.tableRowLast
                    : styles.tableRow
                }
              >
                <Text style={styles.tableLabel}>{String(label)}</Text>
                <Text style={styles.tableValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        </View>

        <NarrativeSection
          title="Work Performed"
          content={workPerformed}
        />

        <NarrativeSection
          title="Incident Summary"
          content={incidentSummary}
        />

        <View style={styles.section} wrap>
          <Text style={styles.sectionTitle}>
            Billing Summary
          </Text>
          <View style={styles.table}>
            {[
              ["Total invoiced", formatMoney(totalInvoiced, billingCurrency)],
              ["Total paid", formatMoney(totalPaid, billingCurrency)],
              ["Outstanding balance", formatMoney(totalOutstanding, billingCurrency)],
            ].map(([label, value], index, rows) => (
              <View
                key={label}
                style={
                  index === rows.length - 1
                    ? styles.tableRowLast
                    : styles.tableRow
                }
              >
                <Text style={styles.tableLabel}>{label}</Text>
                <Text style={styles.tableValue}>{value}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.emptyText, { marginTop: 6 }]}>
            Billing figures reflect the snapshot recorded when this report was generated.
          </Text>
        </View>

        <NarrativeSection
          title="Recommendations"
          content={recommendations}
        />

        <NarrativeSection
          title="Next Steps"
          content={nextSteps}
        />

        <View style={styles.section}>
          <Text style={styles.detail}>
            Finalized: {formatDate(finalizedAt)}
          </Text>
          <Text style={styles.emptyText}>
            This report reflects the recorded service and billing snapshot for the stated reporting period.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Techtrep Business Solutions
          </Text>
          <Text style={styles.footerText}>
            business.thetechtrep.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}