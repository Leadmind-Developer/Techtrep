"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SendProposalButtonProps = {
  proposalId: string;
};

export default function SendProposalButton({
  proposalId,
}: SendProposalButtonProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (sending) {
      return;
    }

    const confirmed = window.confirm(
      "Send this proposal to the client now?",
    );

    if (!confirmed) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/proposals/${proposalId}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to send the proposal.",
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to send the proposal.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSend}
        disabled={sending}
        className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#302c78] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send Proposal"}
      </button>

      {error && (
        <p className="max-w-xs text-right text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}