"use server";

import { readAutoPeople, writeAutoPeople } from "@/lib/data/people";
import { readAutoStartups, writeAutoStartups } from "@/lib/data/startups";
import { readCollection, writeCollection } from "@/lib/server/collection-store";
import { AUTO_REJECTED_FILE } from "@/lib/server/entity-extractor";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorised");
}

/** Removes an AI-added profile and remembers its name, so the daily job never adds it back. */
export async function hideAutoEntity(kind: "person" | "startup", id: string): Promise<void> {
  await requireAdmin();

  let name: string | undefined;
  if (kind === "person") {
    const all = await readAutoPeople();
    name = all.find((p) => p.id === id)?.name;
    await writeAutoPeople(all.filter((p) => p.id !== id), `Hide auto-added person ${id}`);
  } else {
    const all = await readAutoStartups();
    name = all.find((s) => s.id === id)?.name;
    await writeAutoStartups(all.filter((s) => s.id !== id), `Hide auto-added startup ${id}`);
  }

  if (name) {
    const rejected = await readCollection<string>(AUTO_REJECTED_FILE);
    if (!rejected.includes(name)) await writeCollection(AUTO_REJECTED_FILE, [...rejected, name], `Never auto-add: ${name}`);
  }
  revalidatePath("/admin/auto-added");
  revalidatePath("/");
  revalidatePath(kind === "person" ? "/entrepreneurs" : "/startups");
}
