import { AdminNav } from "@/components/admin/admin-nav";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] space-y-6 px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal moderation tools. No auth or persistence yet — see BACKEND_TODO.md.
        </p>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
