import type { CurrentUser } from "@/lib/auth/authorization";

type HeaderProps = {
user: CurrentUser;
};

export default function Header({ user }: HeaderProps) {
return ( <header className="sticky top-0 z-30 hidden h-16 border-b border-slate-200 bg-white/95 backdrop-blur lg:block"> <div className="flex h-full items-center justify-between px-6 lg:px-8"> <div> <p className="text-sm font-medium text-slate-900">
Business Management </p>

      <p className="text-xs text-slate-500">
        Welcome back, {user.name || user.email}
      </p>
    </div>

    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">
          {user.name || "User"}
        </p>

        <p className="text-xs text-slate-500">
          {user.role}
        </p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {(user.name || user.email)
          .charAt(0)
          .toUpperCase()}
      </div>
    </div>
  </div>
</header>

);
}
