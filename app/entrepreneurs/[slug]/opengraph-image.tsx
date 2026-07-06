import { getPersonBySlug } from "@/lib/data-access/people";
import { resolveOgImageSrc } from "@/lib/og-image";
import { initials } from "@/lib/utils";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);

  const photo = person ? await resolveOgImageSrc(person.picture) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: 80,
        }}
      >
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: 120,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#b3e0ff",
            marginRight: 56,
            flexShrink: 0,
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              width={240}
              height={240}
              style={{ objectFit: "cover", borderRadius: 120, display: "flex" }}
            />
          ) : (
            <span style={{ fontSize: 84, fontWeight: 700, color: "#22465d" }}>
              {person ? initials(person.name) : "D"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#0b0b0f", letterSpacing: -1 }}>
            {person?.name ?? "Divan"}
          </span>
          <span style={{ fontSize: 32, color: "#5b5f6b", marginTop: 12 }}>
            {person ? `${person.title} · ${person.knownFor}` : "Meet Iranian entrepreneurs of the world."}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
