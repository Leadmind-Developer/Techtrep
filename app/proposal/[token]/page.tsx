import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import AcceptProposalButton from "./AcceptProposalButton";

type PublicProposalPageProps = {
params: Promise<{
token: string;
}>;
};

function formatCurrency(
value: unknown,
currency: string,
): string {
if (value === null || value === undefined) {
return "—";
}

const numericValue = Number(value);

if (!Number.isFinite(numericValue)) {
return "—";
}

return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
minimumFractionDigits: 2,
maximumFractionDigits: 2,
}).format(numericValue);
}

function formatDate(
value: Date | null,
): string {
if (!value) {
return "—";
}

return new Intl.DateTimeFormat("en-GB", {
day: "2-digit",
month: "long",
year: "numeric",
}).format(value);
}

function getStatusLabel(
status: string,
): string {
switch (status) {
case "SENT":
return "Awaiting your response";

case "ACCEPTED":
  return "Accepted";

case "REJECTED":
  return "Rejected";

case "EXPIRED":
  return "Expired";

case "WITHDRAWN":
  return "Withdrawn";

default:
  return status;

}
}

export default async function PublicProposalPage({
params,
}: PublicProposalPageProps) {
const { token } = await params;

if (!token) {
notFound();
}

const proposal = await prisma.proposal.findUnique({
where: {
publicToken: token,
},
select: {
id: true,
proposalNumber: true,
title: true,
description: true,
amount: true,
currency: true,
status: true,
validUntil: true,
acceptedAt: true,
opportunity: {
select: {
auditRequest: {
select: {
organization: {
select: {
name: true,
},
},
contact: {
select: {
name: true,
email: true,
},
},
},
},
},
},
},
});

if (!proposal) {
notFound();
}

const organization =
proposal.opportunity.auditRequest.organization;

const contact =
proposal.opportunity.auditRequest.contact;

const isExpired =
proposal.validUntil !== null &&
proposal.validUntil.getTime() < Date.now() &&
proposal.status === "SENT";

const canAccept =
proposal.status === "SENT" &&
!isExpired;

const displayedStatus =
isExpired
? "Expired"
: getStatusLabel(proposal.status);

return ( <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"> <div className="mx-auto w-full max-w-4xl"> <div className="mb-8 text-center"> <p className="text-sm font-semibold text-indigo-600">
Techtrep Business Solutions </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Proposal
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Technology, Automation &amp; AI for Growing Businesses
      </p>
    </div>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Proposal Number
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {proposal.proposalNumber}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
              displayedStatus === "Accepted"
                ? "bg-emerald-100 text-emerald-700"
                : displayedStatus === "Expired"
                  ? "bg-amber-100 text-amber-700"
                  : displayedStatus === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
            }`}
          >
            {displayedStatus}
          </span>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {proposal.title}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Prepared for{" "}
            <span className="font-medium text-slate-700">
              {organization.name}
            </span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Proposal Amount
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(
                proposal.amount,
                proposal.currency,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Valid Until
            </p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatDate(proposal.validUntil)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Proposal Details
          </h3>

          <div className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {proposal.description ||
              "No additional proposal details have been provided."}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-base font-semibold text-slate-900">
            Prepared For
          </h3>

          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p className="font-medium text-slate-900">
              {organization.name}
            </p>

            <p>{contact.name}</p>

            <p>{contact.email}</p>
          </div>
        </div>

        {proposal.status === "ACCEPTED" && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">
              Proposal accepted
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-700">
              Thank you. Your acceptance has been recorded by
              Techtrep Business Solutions.
            </p>

            {proposal.acceptedAt && (
              <p className="mt-2 text-xs text-emerald-600">
                Accepted on{" "}
                {formatDate(proposal.acceptedAt)}
              </p>
            )}
          </div>
        )}

        {isExpired && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-800">
              This proposal has expired
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-700">
              The proposal can no longer be accepted through
              this link. Please contact Techtrep Business
              Solutions if you require an updated proposal.
            </p>
          </div>
        )}

        {canAccept && (
          <div className="border-t border-slate-200 pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Ready to proceed?
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                By accepting this proposal, you confirm that
                you wish to proceed with the services described
                above.
              </p>

              <div className="mt-5">
                <AcceptProposalButton
                  token={token}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>

    <footer className="mt-8 text-center text-xs text-slate-400">
      <p>
        Techtrep Business Solutions
      </p>

      <p className="mt-1">
        Technology, Automation &amp; AI for Growing Businesses
      </p>
    </footer>
  </div>
</main>

);
}
