import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#39358C] text-xl font-bold text-white">
          T
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#39358C]">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          We couldn&apos;t find that page.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          The page you&apos;re looking for may have moved, been renamed, or
          no longer exists.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-[#39358C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f2b76]"
          >
            Back to Home
          </Link>

          <Link
            href="/solutions"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Explore Solutions
          </Link>

          <Link
            href="/free-technology-audit"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Free Technology Audit
          </Link>
        </div>
      </div>
    </main>
  );
}