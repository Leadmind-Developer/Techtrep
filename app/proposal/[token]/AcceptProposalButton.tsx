"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AcceptProposalButtonProps = {
token: string;
};

export default function AcceptProposalButton({
token,
}: AcceptProposalButtonProps) {
const router = useRouter();

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState<string | null>(null);

async function handleAccept() {
const confirmed = window.confirm(
"Are you sure you want to accept this proposal?",
);

if (!confirmed) {
  return;
}

setLoading(true);
setError(null);

try {
  const response = await fetch(
    "/api/proposals/accept",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Unable to accept the proposal.",
    );
  }

  router.refresh();
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Unable to accept the proposal.",
  );
} finally {
  setLoading(false);
}

}

return ( <div> <button
     type="button"
     onClick={handleAccept}
     disabled={loading}
     className="inline-flex min-w-48 items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
   >
{loading
? "Accepting..."
: "Accept Proposal"} </button>

  {error && (
    <p
      role="alert"
      className="mt-3 text-sm text-red-600"
    >
      {error}
    </p>
  )}
</div>

);
}
