import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type ReceiptPdfProps = {
  receiptNumber: string;
  issuedAt: Date;
  paymentNumber: string;
  paymentDate: Date;
  paymentMethod: string;
  paymentReference: string | null;

  invoiceNumber: string;
  invoiceTitle: string;
  invoiceTotal: string;
  paymentAmount: string;
  totalPaid: string;
  balanceDue: string;
  currency: string;

  clientName: string;
  clientEmail: string;
  clientPhone: string | null;

  notes: string | null;
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1f2937",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 24,
    borderBottom: "1 solid #e5e7eb",
  },

  brand: {
    color: "#39358c",
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
  },

  tagline: {
    marginTop: 5,
    fontSize: 8,
    color: "#6b7280",
  },

  receiptLabel: {
    textAlign: "right",
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  receiptNumber: {
    marginTop: 5,
    textAlign: "right",
    fontSize: 10,
    color: "#39358c",
    fontFamily: "Helvetica-Bold",
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  clientBox: {
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 5,
  },

  clientName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  muted: {
    marginTop: 4,
    fontSize: 9,
    color: "#6b7280",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottom: "1 solid #f3f4f6",
  },

  label: {
    color: "#6b7280",
  },

  value: {
    color: "#111827",
    fontFamily: "Helvetica-Bold",
  },

  amountBox: {
    marginTop: 24,
    padding: 18,
    backgroundColor: "#f5f4ff",
    borderRadius: 6,
    alignItems: "center",
  },

  amountLabel: {
    fontSize: 9,
    color: "#6b7280",
  },

  amount: {
    marginTop: 6,
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#39358c",
  },

  confirmation: {
    marginTop: 24,
    padding: 14,
    backgroundColor: "#ecfdf5",
    borderRadius: 5,
    color: "#065f46",
    fontSize: 10,
    lineHeight: 1.5,
  },

  notes: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 5,
    fontSize: 9,
    lineHeight: 1.5,
    color: "#4b5563",
  },

  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    paddingTop: 10,
    borderTop: "1 solid #e5e7eb",
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatMoney(
  amount: string,
  currency: string,
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

function formatPaymentMethod(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ReceiptPdf({
  receiptNumber,
  issuedAt,
  paymentNumber,
  paymentDate,
  paymentMethod,
  paymentReference,
  invoiceNumber,
  invoiceTitle,
  invoiceTotal,
  paymentAmount,
  totalPaid,
  balanceDue,
  currency,
  clientName,
  clientEmail,
  clientPhone,
  notes,
}: ReceiptPdfProps) {
  return (
    <Document
      title={`Receipt ${receiptNumber}`}
      author="Techtrep Business Solutions"
      subject={`Payment receipt ${receiptNumber}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              Techtrep Business Solutions
            </Text>

            <Text style={styles.tagline}>
              Technology, Automation & AI for Growing
              Businesses
            </Text>
          </View>

          <View>
            <Text style={styles.receiptLabel}>
              PAYMENT RECEIPT
            </Text>

            <Text style={styles.receiptNumber}>
              {receiptNumber}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            RECEIVED FROM
          </Text>

          <View style={styles.clientBox}>
            <Text style={styles.clientName}>
              {clientName}
            </Text>

            <Text style={styles.muted}>
              {clientEmail}
            </Text>

            {clientPhone && (
              <Text style={styles.muted}>
                {clientPhone}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            PAYMENT DETAILS
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Receipt Number
            </Text>

            <Text style={styles.value}>
              {receiptNumber}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Receipt Date
            </Text>

            <Text style={styles.value}>
              {formatDate(issuedAt)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment Number
            </Text>

            <Text style={styles.value}>
              {paymentNumber}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment Date
            </Text>

            <Text style={styles.value}>
              {formatDate(paymentDate)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment Method
            </Text>

            <Text style={styles.value}>
              {formatPaymentMethod(paymentMethod)}
            </Text>
          </View>

          {paymentReference && (
            <View style={styles.row}>
              <Text style={styles.label}>
                Reference
              </Text>

              <Text style={styles.value}>
                {paymentReference}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>
              Invoice
            </Text>

            <Text style={styles.value}>
              {invoiceNumber}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Description
            </Text>

            <Text style={styles.value}>
              {invoiceTitle}
            </Text>
          </View>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>
            AMOUNT RECEIVED
          </Text>

          <Text style={styles.amount}>
            {formatMoney(paymentAmount, currency)}                          
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            INVOICE SUMMARY
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Invoice Total
            </Text>

            <Text style={styles.value}>
              {formatMoney(invoiceTotal, currency)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Total Paid
            </Text>

            <Text style={styles.value}>
              {formatMoney(totalPaid, currency)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Balance Due
            </Text>

            <Text style={styles.value}>
              {formatMoney(balanceDue, currency)}
            </Text>
          </View>
        </View>

        <Text style={styles.confirmation}>
          Payment has been received and recorded by
          Techtrep Business Solutions. This receipt
          confirms the payment identified above.
        </Text>

        {notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>
              NOTES
            </Text>

            <Text>{notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Techtrep Business Solutions • Technology,
          Automation & AI for Growing Businesses
        </Text>
      </Page>
    </Document>
  );
}