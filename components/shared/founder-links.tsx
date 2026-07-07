import { EntityAvatar } from "@/components/shared/entity-avatar";
import { getPersonById } from "@/lib/data-access/people";
import Link from "next/link";

export async function FounderLinks({ founderIds }: { founderIds: string[] }) {
  const founders = (await Promise.all(founderIds.map(getPersonById))).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  if (founders.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Key people
      </h2>
      <div className="flex flex-wrap gap-3">
        {founders.map((founder) => (
          <Link
            key={founder.id}
            href={`/entrepreneurs/${founder.slug}`}
            className="flex items-center gap-2 rounded-xl border border-border p-3 transition-colors hover:border-foreground"
          >
            <EntityAvatar name={founder.name} image={founder.picture} size="sm" />
            <div>
              <p className="text-sm font-medium text-foreground">{founder.name}</p>
              <p className="text-xs text-muted-foreground">{founder.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
