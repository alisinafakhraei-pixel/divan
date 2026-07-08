import { logoutAdmin } from "@/app/actions/admin-auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] space-y-6 px-4 py-12 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Internal moderation tools.</p>
        </div>
        <form action={logoutAdmin}>
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
