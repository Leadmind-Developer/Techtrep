import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import fs from "fs";
import path from "path";


type CurrencyValue = {
  currency: string;
  value: number;
};

type BillingCurrency = {
  currency: string;
  totalInvoiced: number;
  totalPaid: number;
  outstanding: number;
  overdueInvoices: number;
  collectionRate: number;
};

type CommercialReport = {
  sales: {
    totalProposals: number;
    acceptedProposals: number;
    acceptedValue: CurrencyValue[];
    activeContracts: number;
    pipelineValue: CurrencyValue[];
  };

  billing: {
    currencies: BillingCurrency[];
  };

  projects: {
    activeProjects: number;
    completedProjects: number;
    currencies: CurrencyValue[];
  };
};

const logoPath = path.join(
  process.cwd(),
  "public",
  "logo.png",
);

const logoData = `data:image/png;base64,${fs
    .readFileSync(logoPath)
    .toString("base64")}`;

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
  },

  header: {
    marginBottom: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerContent: {
    flex: 1,
    justifyContent: "center",
 },

  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
    marginLeft: 18,
    borderRadius: 8,
  },  

  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: "#39358c",
    marginBottom: 4,
  },

  title: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 9,
    color: "#64748b",
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#39358c",
    marginBottom: 8,
  },

  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 25,
    alignItems: "center",
  },

  lastRow: {
    flexDirection: "row",
    minHeight: 25,
    alignItems: "center",
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 27,
    alignItems: "center",
  },

  metric: {
    width: "55%",
    paddingHorizontal: 8,
  },

  currency: {
    width: "20%",
    paddingHorizontal: 8,
    textAlign: "right",
  },

  value: {
    width: "25%",
    paddingHorizontal: 8,
    textAlign: "right",
  },

  headerText: {
    fontSize: 8,
    fontWeight: 700,
    color: "#475569",
  },

  cellText: {
    fontSize: 9,
  },

  valueText: {
    fontSize: 9,
    fontWeight: 700,
    color: "#0f172a",
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },

  summaryCard: {
    width: "31.5%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },

  summaryLabel: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 5,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
  },

  footer: {
    position: "absolute",
    bottom: 22,
    left: 42,
    right: 42,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 7,
    color: "#94a3b8",
  },

  empty: {
    fontSize: 9,
    color: "#64748b",
    padding: 8,
  },
});

function formatAmount(
  value: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

function CurrencyRows({
  items,
}: {
  items: CurrencyValue[];
}) {
  if (items.length === 0) {
    return <Text style={styles.empty}>No data available.</Text>;
  }

  return (
    <View>
      {items.map((item, index) => (
        <View
          key={`${item.currency}-${index}`}
          style={
            index === items.length - 1
              ? styles.lastRow
              : styles.row
          }
        >
          <Text style={[styles.metric, styles.cellText]}>
            Value
          </Text>

          <Text style={[styles.currency, styles.cellText]}>
            {item.currency}
          </Text>

          <Text style={[styles.value, styles.valueText]}>
            {formatAmount(
              item.value,
              item.currency,
            )}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ReportTable({
  rows,
}: {
  rows: Array<{
    metric: string;
    currency?: string;
    value: string;
  }>;
}) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.metric,
            styles.headerText,
          ]}
        >
          Metric
        </Text>

        <Text
          style={[
            styles.currency,
            styles.headerText,
          ]}
        >
          Currency
        </Text>

        <Text
          style={[
            styles.value,
            styles.headerText,
          ]}
        >
          Value
        </Text>
      </View>

      {rows.map((row, index) => (
        <View
          key={`${row.metric}-${row.currency ?? ""}-${index}`}
          style={
            index === rows.length - 1
              ? styles.lastRow
              : styles.row
          }
        >
          <Text style={[styles.metric, styles.cellText]}>
            {row.metric}
          </Text>

          <Text style={[styles.currency, styles.cellText]}>
            {row.currency ?? ""}
          </Text>

          <Text style={[styles.value, styles.valueText]}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SalesSection({
  sales,
}: {
  sales: CommercialReport["sales"];
}) {
  const acceptedRows = sales.acceptedValue.map(
    (item) => ({
      metric: "Accepted Value",
      currency: item.currency,
      value: formatAmount(
        item.value,
        item.currency,
      ),
    }),
  );

  const pipelineRows = sales.pipelineValue.map(
    (item) => ({
      metric: "Active Pipeline",
      currency: item.currency,
      value: formatAmount(
        item.value,
        item.currency,
      ),
    }),
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Sales
      </Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Total Proposals
          </Text>
          <Text style={styles.summaryValue}>
            {sales.totalProposals}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Accepted Proposals
          </Text>
          <Text style={styles.summaryValue}>
            {sales.acceptedProposals}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Active Contracts
          </Text>
          <Text style={styles.summaryValue}>
            {sales.activeContracts}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.cellText,
          { marginBottom: 5, fontWeight: 700 },
        ]}
      >
        Accepted Value
      </Text>

      <ReportTable rows={acceptedRows} />

      <View style={{ marginTop: 12 }}>
        <Text
          style={[
            styles.cellText,
            { marginBottom: 5, fontWeight: 700 },
          ]}
        >
          Active Pipeline
        </Text>

        <ReportTable rows={pipelineRows} />
      </View>
    </View>
  );
}

function BillingSection({
  billing,
}: {
  billing: CommercialReport["billing"];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Billing
      </Text>

      {billing.currencies.length === 0 ? (
        <View style={styles.table}>
          <Text style={styles.empty}>
            No issued invoices available.
          </Text>
        </View>
      ) : (
        billing.currencies.map((item) => (
          <View
            key={item.currency}
            style={{ marginBottom: 12 }}
          >
            <ReportTable
              rows={[
                {
                  metric: "Total Invoiced",
                  currency: item.currency,
                  value: formatAmount(
                    item.totalInvoiced,
                    item.currency,
                  ),
                },
                {
                  metric: "Total Paid",
                  currency: item.currency,
                  value: formatAmount(
                    item.totalPaid,
                    item.currency,
                  ),
                },
                {
                  metric: "Outstanding",
                  currency: item.currency,
                  value: formatAmount(
                    item.outstanding,
                    item.currency,
                  ),
                },
                {
                  metric: "Overdue Invoices",
                  currency: item.currency,
                  value: String(
                    item.overdueInvoices,
                  ),
                },
                {
                  metric: "Collection Rate",
                  currency: item.currency,
                  value: formatPercentage(
                    item.collectionRate,
                  ),
                },
              ]}
            />
          </View>
        ))
      )}
    </View>
  );
}

function ProjectsSection({
  projects,
}: {
  projects: CommercialReport["projects"];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Projects
      </Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Active Projects
          </Text>
          <Text style={styles.summaryValue}>
            {projects.activeProjects}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Completed Projects
          </Text>
          <Text style={styles.summaryValue}>
            {projects.completedProjects}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.cellText,
          { marginBottom: 5, fontWeight: 700 },
        ]}
      >
        Project Value
      </Text>

      <ReportTable
        rows={projects.currencies.map(
          (item) => ({
            metric: "Project Value",
            currency: item.currency,
            value: formatAmount(
              item.value,
              item.currency,
            ),
          }),
        )}
      />
    </View>
  );
}

export function CommercialReportPdf({
  report,
  reportDate,
}: {
  report: CommercialReport;
  reportDate: string;
}) {
  return (
    <Document
      title="Techtrep Business Solutions - Commercial Performance Report"
      author="Techtrep Business Solutions"
      subject="Commercial performance across sales, billing and projects"
      creator="Techtrep Business Solutions"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.brand}>
            Techtrep Business Solutions
          </Text>

          <Text style={styles.title}>
            Commercial Performance Report
          </Text>

          <Text style={styles.subtitle}>
            Sales, billing and project performance
          </Text>

          <Text
            style={[
              styles.subtitle,
              { marginTop: 4 },
            ]}
          >
            Report date: {reportDate}
          </Text>
        </View>

        <Image
          src={logoData}
          style={styles.logo}
        />
    </View>

        <SalesSection sales={report.sales} />

        <BillingSection billing={report.billing} />

        <ProjectsSection
          projects={report.projects}
        />

        <View style={styles.footer}>
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