import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;
const emailTo = process.env.EMAIL_TO;

if (
  !smtpHost ||
  !smtpUser ||
  !smtpPassword ||
  !emailFrom ||
  !emailTo
) {
  throw new Error(
    "SMTP email configuration is incomplete. Check SMTP_HOST, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM and EMAIL_TO."
  );
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export interface AuditEmailData {
  auditRequestId: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  industry: string;
  companySize: string;
  improvements: string[];
  manualWork: string;
  existingSystems?: string;
  additionalInformation?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatList(items: string[]): string {
  if (!items.length) {
    return "<em>None specified</em>";
  }

  return `<ul style="margin: 8px 0; padding-left: 20px;">
    ${items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}
  </ul>`;
}

/**
 * Sends an internal notification to the Techtrep Business Solutions team.
 */
export async function sendAuditNotification(
  data: AuditEmailData
): Promise<void> {
  const subject = `New Technology Audit Request — ${data.businessName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:#f5f7fb; font-family:Arial,Helvetica,sans-serif; color:#172033;">
        <div style="max-width:700px; margin:0 auto; padding:32px 20px;">
          <div style="background:#39358C; padding:24px 28px; border-radius:14px 14px 0 0; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">
              New Technology Audit Request
            </h1>
            <p style="margin:8px 0 0; opacity:.9;">
              Techtrep Business Solutions
            </p>
          </div>

          <div style="background:#ffffff; padding:28px; border:1px solid #e5e7eb; border-top:0; border-radius:0 0 14px 14px;">
            <h2 style="font-size:18px; margin-top:0;">
              Business Information
            </h2>

            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0; font-weight:bold; width:180px;">Business</td>
                <td style="padding:8px 0;">${escapeHtml(data.businessName)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; font-weight:bold;">Contact</td>
                <td style="padding:8px 0;">${escapeHtml(data.fullName)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; font-weight:bold;">Email</td>
                <td style="padding:8px 0;">
                  <a href="mailto:${escapeHtml(data.email)}">
                    ${escapeHtml(data.email)}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0; font-weight:bold;">Phone / WhatsApp</td>
                <td style="padding:8px 0;">${escapeHtml(data.phone)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; font-weight:bold;">Website</td>
                <td style="padding:8px 0;">
                  ${
                    data.website
                      ? `<a href="${escapeHtml(data.website)}">${escapeHtml(data.website)}</a>`
                      : "Not provided"
                  }
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0; font-weight:bold;">Industry</td>
                <td style="padding:8px 0;">${escapeHtml(data.industry)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; font-weight:bold;">Company Size</td>
                <td style="padding:8px 0;">${escapeHtml(data.companySize)}</td>
              </tr>
            </table>

            <hr style="border:0; border-top:1px solid #e5e7eb; margin:24px 0;" />

            <h2 style="font-size:18px;">Improvement Areas</h2>
            ${formatList(data.improvements)}

            <h2 style="font-size:18px;">Manual Work</h2>
            <p style="white-space:pre-wrap;">
              ${escapeHtml(data.manualWork)}
            </p>

            <h2 style="font-size:18px;">Existing Systems</h2>
            <p style="white-space:pre-wrap;">
              ${data.existingSystems ? escapeHtml(data.existingSystems) : "Not provided"}
            </p>

            <h2 style="font-size:18px;">Additional Information</h2>
            <p style="white-space:pre-wrap;">
              ${
                data.additionalInformation
                  ? escapeHtml(data.additionalInformation)
                  : "Not provided"
              }
            </p>

            <div style="margin-top:28px; padding:16px; background:#f5f7fb; border-radius:10px;">
              <strong>Audit Request ID:</strong>
              <code>${escapeHtml(data.auditRequestId)}</code>
            </div>
          </div>

          <p style="text-align:center; color:#6b7280; font-size:12px; margin-top:20px;">
            This notification was generated automatically by Techtrep Business Solutions.
          </p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: emailFrom,
    to: emailTo,
    replyTo: data.email,
    subject,
    html,
    text: `
New Technology Audit Request

Business: ${data.businessName}
Contact: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Website: ${data.website || "Not provided"}
Industry: ${data.industry}
Company Size: ${data.companySize}

Improvement Areas:
${data.improvements.length ? data.improvements.map((item) => `- ${item}`).join("\n") : "- None specified"}

Manual Work:
${data.manualWork}

Existing Systems:
${data.existingSystems || "Not provided"}

Additional Information:
${data.additionalInformation || "Not provided"}

Audit Request ID:
${data.auditRequestId}
    `.trim(),
  });
}

/**
 * Sends a confirmation to the person who requested the audit.
 */
export async function sendAuditConfirmation(
  data: AuditEmailData
): Promise<void> {
  const subject = "We received your Technology Audit request";

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:#f5f7fb; font-family:Arial,Helvetica,sans-serif; color:#172033;">
        <div style="max-width:650px; margin:0 auto; padding:32px 20px;">
          <div style="background:#39358C; padding:24px 28px; border-radius:14px 14px 0 0; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">
              Technology Audit Request Received
            </h1>
            <p style="margin:8px 0 0; opacity:.9;">
              Techtrep Business Solutions
            </p>
          </div>

          <div style="background:#ffffff; padding:30px; border:1px solid #e5e7eb; border-top:0; border-radius:0 0 14px 14px;">
            <p>Hi ${escapeHtml(data.fullName)},</p>

            <p>
              Thank you for requesting a free Technology Audit from
              <strong>Techtrep Business Solutions</strong>.
            </p>

            <p>
              We have received your information and will review your
              technology challenges, existing systems and areas where your
              business may benefit from improved processes, automation or
              digital solutions.
            </p>

            <div style="margin:24px 0; padding:18px; background:#f5f7fb; border-radius:10px;">
              <strong>Your audit request ID:</strong>
              <code>${escapeHtml(data.auditRequestId)}</code>
            </div>

            <p>
              A member of our team will review your submission and contact
              you using the details you provided.
            </p>

            <p>
              Thank you for choosing Techtrep Business Solutions.
            </p>

            <p style="margin-bottom:0;">
              Regards,<br />
              <strong>Techtrep Business Solutions</strong>
            </p>
          </div>

          <p style="text-align:center; color:#6b7280; font-size:12px; margin-top:20px;">
            This is an automated confirmation of your Technology Audit request.
          </p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: emailFrom,
    to: data.email,
    replyTo: emailTo,
    subject,
    html,
    text: `
Hi ${data.fullName},

Thank you for requesting a free Technology Audit from Techtrep Business Solutions.

We have received your information and will review your technology challenges, existing systems and areas where your business may benefit from improved processes, automation or digital solutions.

Your audit request ID:
${data.auditRequestId}

A member of our team will review your submission and contact you using the details you provided.

Thank you for choosing Techtrep Business Solutions.

Regards,
Techtrep Business Solutions
    `.trim(),
  });
}

export interface ProposalEmailData {
  proposalNumber: string;
  title: string;
  description?: string | null;
  amount?: string | null;
  currency: string;
  validUntil?: string | null;
  recipientName: string;
  recipientEmail: string;
  organizationName: string;
  proposalUrl: string;
}

export async function sendProposalEmail(
  data: ProposalEmailData,
): Promise<void> {
  const subject = `${data.proposalNumber} — ${data.title}`;

  const amountHtml = data.amount
    ? `
        <tr>
          <td style="padding:8px 0; font-weight:bold; width:180px;">
            Proposal Amount
          </td>
          <td style="padding:8px 0;">
            ${escapeHtml(data.currency)} ${escapeHtml(data.amount)}
          </td>
        </tr>
      `
    : "";

  const validUntilHtml = data.validUntil
    ? `
        <tr>
          <td style="padding:8px 0; font-weight:bold;">
            Valid Until
          </td>
          <td style="padding:8px 0;">
            ${escapeHtml(data.validUntil)}
          </td>
        </tr>
      `
    : "";

  const descriptionHtml = data.description
    ? `
        <div style="margin:24px 0;">
          <h2 style="font-size:18px; margin-bottom:10px;">
            Proposal
          </h2>
          <p style="white-space:pre-wrap; line-height:1.6;">
            ${escapeHtml(data.description)}
          </p>
        </div>
      `
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:#f5f7fb; font-family:Arial,Helvetica,sans-serif; color:#172033;">
        <div style="max-width:700px; margin:0 auto; padding:32px 20px;">

          <div style="background:#39358C; padding:24px 28px; border-radius:14px 14px 0 0; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">
              Techtrep Business Solutions
            </h1>
            <p style="margin:8px 0 0; opacity:.9;">
              Technology, Automation &amp; AI for Growing Businesses
            </p>
          </div>

          <div style="background:#ffffff; padding:30px; border:1px solid #e5e7eb; border-top:0; border-radius:0 0 14px 14px;">

            <p>
              Hi ${escapeHtml(data.recipientName)},
            </p>

            <p>
              Thank you for the opportunity to work with
              <strong>${escapeHtml(data.organizationName)}</strong>.
            </p>

            <p>
              Please find your proposal from
              <strong>Techtrep Business Solutions</strong> below.
            </p>

            <div style="margin:24px 0; padding:20px; background:#f5f7fb; border-radius:10px;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0; font-weight:bold; width:180px;">
                    Proposal Number
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.proposalNumber)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0; font-weight:bold;">
                    Title
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.title)}
                  </td>
                </tr>

                ${amountHtml}
                ${validUntilHtml}
              </table>
            </div>

            ${descriptionHtml}

            <div style="text-align:center; margin:32px 0;">
              <a
                href="${escapeHtml(data.proposalUrl)}"
                style="display:inline-block; padding:14px 24px; background:#39358C; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold;"
              >
                View Proposal
              </a>
            </div>

            <p>
              You can review the full proposal and respond securely using
              the button above.
            </p>

            <p style="margin-bottom:0;">
              Regards,<br />
              <strong>Techtrep Business Solutions</strong>
            </p>
          </div>

          <p style="text-align:center; color:#6b7280; font-size:12px; margin-top:20px;">
            This proposal was sent by Techtrep Business Solutions.
          </p>
        </div>
      </body>
    </html>
  `;

  const amountText = data.amount
    ? `Proposal Amount: ${data.currency} ${data.amount}`
    : "";

  const validUntilText = data.validUntil
    ? `Valid Until: ${data.validUntil}`
    : "";

  await transporter.sendMail({
    from: emailFrom,
    to: data.recipientEmail,
    replyTo: emailTo,
    subject,
    html,
    text: `
Hi ${data.recipientName},

Thank you for the opportunity to work with ${data.organizationName}.

Please find your proposal from Techtrep Business Solutions below.

Proposal Number: ${data.proposalNumber}
Title: ${data.title}
${amountText}
${validUntilText}

View Proposal:
${data.proposalUrl}

You can review the full proposal and respond securely using the link above.

Regards,
Techtrep Business Solutions
    `.trim(),
  });
}

export interface ProposalAcceptanceNotificationData {
  proposalId: string;
  proposalNumber: string;
  title: string;
  amount?: string | null;
  currency: string;
  acceptedAt: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  proposalUrl: string;
}

export async function sendProposalAcceptanceNotification(
  data: ProposalAcceptanceNotificationData,
): Promise<void> {
  const subject = `Proposal Accepted — ${data.proposalNumber}`;

  const amountHtml = data.amount
    ? `
        <tr>
          <td style="padding:8px 0; font-weight:bold; width:180px;">
            Proposal Amount
          </td>
          <td style="padding:8px 0;">
            ${escapeHtml(data.currency)} ${escapeHtml(data.amount)}
          </td>
        </tr>
      `
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:#f8fafc; font-family:Arial,Helvetica,sans-serif; color:#0f172a;">
        <div style="max-width:640px; margin:0 auto; padding:32px 20px;">
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
            
            <div style="background:#39358c; padding:24px;">
              <h1 style="margin:0; color:#ffffff; font-size:22px;">
                Proposal Accepted
              </h1>
              <p style="margin:8px 0 0; color:#e0e7ff; font-size:14px;">
                Techtrep Business Solutions
              </p>
            </div>

            <div style="padding:28px;">
              <p style="font-size:16px; line-height:1.6;">
                A client has accepted a proposal through the public proposal portal.
              </p>

              <table style="width:100%; border-collapse:collapse; margin:24px 0; font-size:14px;">
                <tr>
                  <td style="padding:8px 0; font-weight:bold; width:180px;">
                    Proposal Number
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.proposalNumber)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0; font-weight:bold;">
                    Proposal Title
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.title)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0; font-weight:bold;">
                    Client / Organization
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.organizationName)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0; font-weight:bold;">
                    Contact
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.contactName)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0; font-weight:bold;">
                    Contact Email
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.contactEmail)}
                  </td>
                </tr>

                ${amountHtml}

                <tr>
                  <td style="padding:8px 0; font-weight:bold;">
                    Accepted At
                  </td>
                  <td style="padding:8px 0;">
                    ${escapeHtml(data.acceptedAt)}
                  </td>
                </tr>
              </table>

              <div style="margin-top:28px;">
                <a
                  href="${escapeHtml(data.proposalUrl)}"
                  style="display:inline-block; background:#39358c; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-size:14px; font-weight:bold;"
                >
                  View Proposal
                </a>
              </div>

              <p style="margin-top:28px; color:#64748b; font-size:13px; line-height:1.6;">
                The proposal status has already been updated to ACCEPTED in the CRM.
              </p>
            </div>

            <div style="border-top:1px solid #e2e8f0; padding:18px 28px; color:#94a3b8; font-size:12px;">
              Techtrep Business Solutions<br />
              Technology, Automation &amp; AI for Growing Businesses
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const amountText = data.amount
    ? `Proposal Amount: ${data.currency} ${data.amount}`
    : "";

  await transporter.sendMail({
    from: emailFrom,
    to: emailTo,
    subject,
    html,
    text: `
A proposal has been accepted by a client.

Proposal Number: ${data.proposalNumber}
Proposal Title: ${data.title}
Organization: ${data.organizationName}
Contact: ${data.contactName}
Contact Email: ${data.contactEmail}
${amountText}
Accepted At: ${data.acceptedAt}

View Proposal:
${data.proposalUrl}

The proposal status has been updated to ACCEPTED in the CRM.
    `.trim(),
  });
}
