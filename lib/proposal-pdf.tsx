import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type ProposalPdfProps = {
  proposalNumber: string;
  title: string;
  description: string | null;
  amount: string | null;
  currency: string;
  status: string;
  validUntil: string | null;
  organizationName: string;
  contactName: string;
  contactEmail: string | null;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#334155",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: "#39358c",
  },

  brandSubtext: {
    marginTop: 4,
    fontSize: 8,
    color: "#64748b",
  },

  proposalNumber: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "right",
  },

  proposalNumberValue: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
    textAlign: "right",
  },

  titleSection: {
    marginTop: 28,
  },

  eyebrow: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#39358c",
    textTransform: "uppercase",
  },

  title: {
    marginTop: 8,
    fontSize: 24,
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#0f172a",
  },

  status: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 4,
    backgroundColor: "#f1f5f9",
    fontSize: 8,
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
  },

  clientSection: {
    marginTop: 26,
    padding: 16,
    borderRadius: 6,
    backgroundColor: "#f8fafc",
  },

  sectionLabel: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 0.8,
    color: "#64748b",
    textTransform: "uppercase",
  },

  clientName: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
  },

  clientContact: {
    marginTop: 4,
    fontSize: 9,
    color: "#64748b",
  },

  section: {
    marginTop: 26,
  },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
  },

  paragraph: {
    marginBottom: 8,
    fontSize: 10,
    lineHeight: 1.6,
    color: "#475569",
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  bullet: {
    width: 12,
    fontSize: 10,
    color: "#39358c",
  },

  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: "#475569",
  },

  heading: {
    marginTop: 12,
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#0f172a",
  },

  investment: {
    marginTop: 28,
    padding: 18,
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  investmentLabel: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 0.8,
    color: "#64748b",
    textTransform: "uppercase",
  },

  investmentAmount: {
    marginTop: 7,
    fontSize: 20,
    fontWeight: 700,
    color: "#39358c",
  },

  validity: {
    marginTop: 7,
    fontSize: 9,
    color: "#64748b",
  },

  footer: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 22,
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
});

function isSectionHeading(line: string) {
  const normalized = line.trim();

  if (!normalized) {
    return false;
  }

  return (
    normalized === normalized.toUpperCase() &&
    /[A-Z]/.test(normalized) &&
    normalized.length <= 80
  );
}

function isBullet(line: string) {
  return /^(\u2022|-|\*)\s+/.test(line.trim());
}

function getBulletText(line: string) {
  return line
    .trim()
    .replace(/^(\u2022|-|\*)\s+/, "");
}

function ProposalDescription({
  content,
}: {
  content: string | null;
}) {
  if (!content?.trim()) {
    return (
      <Text style={styles.paragraph}>
        No description has been provided.
      </Text>
    );
  }

  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n");

  const elements: React.ReactNode[] = [];

  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    elements.push(
      <Text
        key={`paragraph-${elements.length}`}
        style={styles.paragraph}
      >
        {paragraphLines.join(" ")}
      </Text>,
    );

    paragraphLines = [];
  };

  const flushBullets = () => {
    if (bulletItems.length === 0) {
      return;
    }

    elements.push(
      <View key={`bullets-${elements.length}`}>
        {bulletItems.map((item, index) => (
          <View
            key={`${item}-${index}`}
            style={styles.bulletRow}
          >
            <Text style={styles.bullet}>•</Text>

            <Text style={styles.bulletText}>
              {item}
            </Text>
          </View>
        ))}
      </View>,
    );

    bulletItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushBullets();
      return;
    }

    if (isSectionHeading(trimmed)) {
      flushParagraph();
      flushBullets();

      elements.push(
        <Text
          key={`heading-${elements.length}`}
          style={styles.heading}
        >
          {trimmed}
        </Text>,
      );

      return;
    }

    if (isBullet(trimmed)) {
      flushParagraph();
      bulletItems.push(getBulletText(trimmed));
      return;
    }

    flushBullets();
    paragraphLines.push(trimmed);
  });

  flushParagraph();
  flushBullets();

  return <View>{elements}</View>;
}

function formatAmount(
  amount: string | null,
  currency: string,
) {
  if (!amount) {
    return "Not specified";
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency} ${amount}`;
  }

  return `${currency} ${numericAmount.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

export default function ProposalPdf({
  proposalNumber,
  title,
  description,
  amount,
  currency,
  status,
  validUntil,
  organizationName,
  contactName,
  contactEmail,
}: ProposalPdfProps) {
  return (
    <Document
      title={`${proposalNumber} - ${title}`}
      author="Techtrep Business Solutions"
      subject={title}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              Techtrep Business Solutions
            </Text>

            <Text style={styles.brandSubtext}>
              Technology, Automation & AI for Growing
              Businesses
            </Text>
          </View>

          <View>
            <Text style={styles.proposalNumber}>
              PROPOSAL
            </Text>

            <Text style={styles.proposalNumberValue}>
              {proposalNumber}
            </Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>
            Business Proposal
          </Text>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.status}>
            {status}
          </Text>
        </View>

        <View style={styles.clientSection}>
          <Text style={styles.sectionLabel}>
            Prepared for
          </Text>

          <Text style={styles.clientName}>
            {organizationName}
          </Text>

          <Text style={styles.clientContact}>
            {contactName}
            {contactEmail
              ? ` • ${contactEmail}`
              : ""}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Proposal Overview
          </Text>

          <ProposalDescription
            content={description}
          />
        </View>

        <View style={styles.investment}>
          <Text style={styles.investmentLabel}>
            Proposed Investment
          </Text>

          <Text style={styles.investmentAmount}>
            {formatAmount(amount, currency)}
          </Text>

          {validUntil && (
            <Text style={styles.validity}>
              Proposal valid until {validUntil}
            </Text>
          )}
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