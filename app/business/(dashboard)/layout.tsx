import type { ReactNode } from "react";

import { requireUser } from "@/lib/auth/authorization";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";

export default async function BusinessLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} />

      <div className="lg:pl-64">
        <Header user={user} />

        <MobileNav user={user} />

        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}