import Link from "next/link";
import { cookies } from "next/headers";
import ContractEditForm from "./ContractEditForm";

import ContractStatusControl from "./ContractStatusControl";

const contractStatuses = [
  "DRAFT",
  "SENT",
  "SIGNED",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
] as const;

type ContractStatus =
  (typeof contractStatuses)[number];

type Contract = {
  id: string;
  contractNumber: string;
  title: string;
  description: string | null;
  status: ContractStatus;
  amount: string | number;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  signedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  proposal: {
    id: string;
    proposalNumber: string;
    title: string;
    description: string | null;
    amount: string | number;
    currency: string;
    status: string;
    validUntil: string | null;
    sentAt: string | null;
    acceptedAt: string | null;
    opportunity: {
      id: string;
      name: string;
      description: string | null;
      status: string;
      priority: string;
      estimatedValue: string | number | null;
      auditRequest: {
        id: string;
        organization: {
          id: string;
          name: string;
          website: string | null;
          industry: string | null;
          companySize: string | null;
        };
        contact: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: string | null;
        };
      };
    };
  };
};

type ContractResponse = {
  success: boolean;
  contract?: Contract;
  message?: string;
};

function formatMoney(
  amount: string | number,
  currency: string,
) {
  const numericAmount =
    typeof amount === "number"
      ? amount
      : Number(amount);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000";

  const apiUrl = new URL(
    `/api/contracts/${id}`,
    baseUrl,
  );

  let contract: Contract | null = null;
  let errorMessage = "";

  try {
    const cookieStore = await cookies();

    const response = await fetch(
      apiUrl.toString(),
      {
        cache: "no-store",
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    );

    const data =
      (await response.json()) as ContractResponse;

    if (!response.ok || !data.success) {
      errorMessage =
        data.message ??
        "Unable to retrieve contract.";
    } else if (data.contract) {
      contract = data.contract;
    } else {
      errorMessage =
        "Contract data was not returned.";
    }
  } catch {
    errorMessage =
      "Unable to retrieve contract.";
  }

  if (errorMessage || !contract) {
    return (
      <div className="space-y-6">
        <Link
          href="/business/contracts"
          className="inline-flex text-sm font-medium text-[#39358c] hover:underline"
        >
          ← Back to Contracts
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage ||
            "Contract not found."}
        </div>
      </div>
    );
  }

  const opportunity =
    contract.proposal.opportunity;

  const auditRequest =
    opportunity.auditRequest;

  const organization =
    auditRequest.organization;

  const contact =
    auditRequest.contact;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/business/contracts"
            className="text-sm font-medium text-[#39358c] hover:underline"
          >
            ← Back to Contracts
          </Link>

          <div className="mt-3">
            <p className="text-sm font-medium text-gray-500">
              {contract.contractNumber}
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-gray-900">
              {contract.title}
            </h1>
          </div>
        </div>

        <Link
          href={`/business/proposals/${contract.proposal.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-[#39358c] px-4 py-2.5 text-sm font-medium text-[#39358c] transition hover:bg-[#f5f4ff]"
        >
          View Proposal
        </Link>
      </div>

      <ContractStatusControl
        contractId={contract.id}
        status={contract.status}
        signedAt={contract.signedAt}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Contract Details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Contract Number"
                value={contract.contractNumber}
              />

              <InfoItem
                label="Amount"
                value={formatMoney(
                  contract.amount,
                  contract.currency,
                )}
              />

              <InfoItem
                label="Start Date"
                value={formatDate(
                  contract.startDate,
                )}
              />

              <InfoItem
                label="End Date"
                value={formatDate(
                  contract.endDate,
                )}
              />

              <InfoItem
                label="Signed Date"
                value={formatDate(
                  contract.signedAt,
                )}
              />

              <InfoItem
                label="Created"
                value={formatDate(
                  contract.createdAt,
                )}
              />
            </div>

            {contract.description ? (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {contract.description}
                </p>
              </div>
            ) : null}

            {contract.notes ? (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Notes
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {contract.notes}
                </p>
              </div>
            ) : null}
          </section>
            <ContractEditForm
              contractId={contract.id}
              title={contract.title}
              description={contract.description}
              startDate={contract.startDate}
              endDate={contract.endDate}
              signedAt={contract.signedAt}
              notes={contract.notes}
            />

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Related Proposal
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Proposal Number"
                value={
                  contract.proposal
                    .proposalNumber
                }
              />

              <InfoItem
                label="Proposal Status"
                value={
                  contract.proposal.status
                }
              />

              <InfoItem
                label="Proposal Amount"
                value={formatMoney(
                  contract.proposal.amount,
                  contract.proposal.currency,
                )}
              />

              <InfoItem
                label="Accepted"
                value={formatDate(
                  contract.proposal
                    .acceptedAt,
                )}
              />
            </div>

            <div className="mt-5">
              <Link
                href={`/business/proposals/${contract.proposal.id}`}
                className="text-sm font-medium text-[#39358c] hover:underline"
              >
                Open proposal →
              </Link>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Opportunity
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Opportunity"
                value={opportunity.name}
              />

              <InfoItem
                label="Status"
                value={opportunity.status}
              />

              <InfoItem
                label="Priority"
                value={opportunity.priority}
              />

              <InfoItem
                label="Estimated Value"
                value={
                  opportunity.estimatedValue !==
                  null
                    ? formatMoney(
                        opportunity.estimatedValue,
                        contract.currency,
                      )
                    : "—"
                }
              />
            </div>

            {opportunity.description ? (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {opportunity.description}
                </p>
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Client
            </h2>

            <div className="mt-5 space-y-5">
              <InfoItem
                label="Organization"
                value={organization.name}
              />

              <InfoItem
                label="Industry"
                value={
                  organization.industry ??
                  "—"
                }
              />

              <InfoItem
                label="Company Size"
                value={
                  organization.companySize ??
                  "—"
                }
              />

              {organization.website ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Website
                  </p>

                  <a
                    href={
                      organization.website
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-sm font-medium text-[#39358c] hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact
            </h2>

            <div className="mt-5 space-y-5">
              <InfoItem
                label="Name"
                value={contact.name}
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </p>

                <a
                  href={`mailto:${contact.email}`}
                  className="mt-1 block break-all text-sm font-medium text-[#39358c] hover:underline"
                >
                  {contact.email}
                </a>
              </div>

              <InfoItem
                label="Phone"
                value={contact.phone ?? "—"}
              />

              <InfoItem
                label="Role"
                value={contact.role ?? "—"}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}