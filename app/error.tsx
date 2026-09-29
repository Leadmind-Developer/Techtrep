"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#39358C] p-3">
          <Image
             src="/icon.svg"
             alt="Techtrep"
             width={40}
             height={40}
             className="h-10 w-10 object-contain"
           />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
          Something went wrong
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          We couldn&apos;t complete that request.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          An unexpected error occurred. Please try again, or return to the
          homepage and continue from there.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Back to Home
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Contact Techtrep
          </Link>
        </div>
      </div>
    </main>
  );
}