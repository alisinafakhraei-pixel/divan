"use client";

import { adminDeleteEntity } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteEntityButtonProps {
  kind: "person" | "startup";
  targetId: string;
  name: string;
}

export function DeleteEntityButton({ kind, targetId, name }: DeleteEntityButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Delete {name} for good?</span>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={async () => {
            setPending(true);
            await adminDeleteEntity(kind, targetId);
            router.push("/admin/manage");
          }}
        >
          {pending ? "Deleting..." : "Yes, delete"}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button type="button" variant="destructive" size="sm" onClick={() => setConfirming(true)}>
      <Trash2 className="size-4" />
      Delete
    </Button>
  );
}
