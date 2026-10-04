import Link from "next/link";
import { cookies } from "next/headers";

const contractStatuses = [
  "DRAFT",
  "SENT",
  "SIGNED",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
] as const;

type ContractStatus = (typeof contractStatuses)[number];

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
    status: string;
    opportunity: {
      id: string;
      name: string;
      auditRequest: {
        id: string;
        organization: {
          id: string;
          name: string;
        };
        contact: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
        };
      };
    };
  };
};

type ContractsResponse = {
  success: boolean;
  contracts: Contract[];
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
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusClasses(status: ContractStatus) {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-700";
    case "SENT":
      return "bg-blue-100 text-blue-700";
    case "SIGNED":
      return "bg-purple-100 text-purple-700";
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "EXPIRED":
      return "bg-amber-100 text-amber-700";
    case "TERMINATED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getClientName(contract: Contract) {
  return (
    contract.proposal.opportunity.auditRequest
      .organization.name
  );
}

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000";

  const apiUrl = new URL(
    "/api/contracts",
    baseUrl,
  );

  if (search) {
    apiUrl.searchParams.set("search", search);
  }

  if (status) {
    apiUrl.searchParams.set("status", status);
  }

  let contracts: Contract[] = [];
  let errorMessage = "";

  try {
    const cookieStore = await cookies();

    const response = await fetch(apiUrl.toString(), {
      cache: "no-store",
      headers: {
        cookie: cookieStore.toString(),
      },
    });

    const data =
      (await response.json()) as ContractsResponse;

    if (!response.ok || !data.success) {
      errorMessage =
        data.message ??
        "Unable to retrieve contracts.";
    } else {
      contracts = data.contracts;
    }
  } catch {
    errorMessage =
      "Unable to retrieve contracts.";
  }

  const buildFilterUrl = (
    nextSearch: string,
    nextStatus: string,
  ) => {
    const query = new URLSearchParams();

    if (nextSearch) {
      query.set("search", nextSearch);
    }

    if (nextStatus) {
      query.set("status", nextStatus);
    }

    const queryString = query.toString();

    return queryString
      ? `/business/contracts?${queryString}`
      : "/business/contracts";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Contracts
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage contracts created from accepted
            proposals.
          </p>
        </div>

        <Link
          href="/business/proposals"
          className="inline-flex items-center justify-center rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#302d78]"
        >
          View Proposals
        </Link>
      </div>

      <form
        method="GET"
        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <div>
            <label
              htmlFor="search"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Search
            </label>

            <input
              id="search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Contract number or title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={status}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
            >
              <option value="">
                All statuses
              </option>

              {contractStatuses.map(
                (contractStatus) => (
                  <option
                    key={contractStatus}
                    value={contractStatus}
                  >
                    {contractStatus}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg border border-[#39358c] px-4 py-2.5 text-sm font-medium text-[#39358c] transition hover:bg-[#f5f4ff] md:w-auto"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {!errorMessage && contracts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            No contracts found
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Contracts can be created from accepted
            proposals.
          </p>
        </div>
      ) : null}

      {contracts.length > 0 ? (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Contract
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Client
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Proposal
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Created
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {contract.contractNumber}
                          </p>

                          <p className="mt-0.5 max-w-xs truncate text-sm text-gray-600">
                            {contract.title}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {getClientName(contract)}
                          </p>

                          <p className="mt-0.5 text-sm text-gray-600">
                            {
                              contract.proposal
                                .opportunity
                                .auditRequest
                                .contact.name
                            }
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/business/proposals/${contract.proposal.id}`}
                          className="text-sm font-medium text-[#39358c] hover:underline"
                        >
                          {
                            contract.proposal
                              .proposalNumber
                          }
                        </Link>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {formatMoney(
                          contract.amount,
                          contract.currency,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            contract.status,
                          )}`}
                        >
                          {contract.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {formatDate(
                          contract.createdAt,
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/business/contracts/${contract.id}`}
                          className="text-sm font-medium text-[#39358c] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet */}
          <div className="space-y-4 lg:hidden">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {contract.contractNumber}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {contract.title}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                      contract.status,
                    )}`}
                  >
                    {contract.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Client
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {getClientName(contract)}
                    </p>

                    <p className="mt-0.5 text-sm text-gray-600">
                      {
                        contract.proposal.opportunity
                          .auditRequest.contact.name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatMoney(
                        contract.amount,
                        contract.currency,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Proposal
                    </p>

                    <Link
                      href={`/business/proposals/${contract.proposal.id}`}
                      className="mt-1 inline-block text-sm font-medium text-[#39358c] hover:underline"
                    >
                      {
                        contract.proposal
                          .proposalNumber
                      }
                    </Link>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(
                        contract.createdAt,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <Link
                    href={`/business/contracts/${contract.id}`}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#302d78]"
                  >
                    View Contract
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {search || status ? (
        <div className="text-sm text-gray-600">
          <Link
            href={buildFilterUrl("", "")}
            className="font-medium text-[#39358c] hover:underline"
          >
            Clear filters
          </Link>
        </div>
      ) : null}
    </div>
  );
}