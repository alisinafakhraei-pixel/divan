import { getStartupBySlug } from "@/lib/data-access/startups";
import { resolveOgImageSrc } from "@/lib/og-image";
import { initials } from "@/lib/utils";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const startup = await getStartupBySlug(slug);

  const logo = startup ? await resolveOgImageSrc(startup.logo) : null;

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
            borderRadius: 32,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f2f4",
            marginRight: 56,
            flexShrink: 0,
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={200} height={200} style={{ objectFit: "contain", display: "flex" }} />
          ) : (
            <span style={{ fontSize: 84, fontWeight: 700, color: "#22465d" }}>
              {startup ? initials(startup.name) : "D"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#0b0b0f", letterSpacing: -1 }}>
            {startup?.name ?? "Divan"}
          </span>
          <span style={{ fontSize: 30, color: "#5b5f6b", marginTop: 12, maxWidth: 700 }}>
            {startup ? startup.tagline : "Meet Iranian entrepreneurs of the world."}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
