// Archive (ZIP) detail renderer (slot `detail`).
//
// A browser cannot render a ZIP archive inline, and the renderer snapshot
// carries an ADDRESS and never the archive bytes — so a client-side
// central-directory LISTING would require the renderer to fetch and parse the
// archive itself. That is beyond the sibling bases' passive-address depth
// (audio/video/image/pdf all hand an address to a native element and never
// fetch/parse), so it is deliberately out of scope here: the faithful minimal
// renderer is a typed download SHELL — the archive's identity, its size, and a
// download affordance.
//
// THE DOWNLOAD ADDRESS COMES FROM THE BYTE ROAD. Inside a third-party
// application the host's session route carries no cookie, so a shell offering
// it hands the reader a dead link. At props version 2 the snapshot carries the
// byte reference the reader may actually fetch on the surface they are on, and
// this shell offers that; a snapshot built at the older version has no
// reference and falls back to the session href. The renderer requests NO host
// ports, builds no address of its own, and fetches nothing.
//
// NEVER-BLANK: the shell always renders the archive identity; the download link
// appears only when a road carries one, but the panel is never empty.

import type { ReactElement } from "react";

import type { ArtifactRendererProps } from "../artifact-renderer-props";
import { resolveByteRoad } from "./byte-road";

/** Human-readable byte size for the shell (pure; exported for tests). */
export function formatBytes(size: number | null | undefined): string | null {
  if (typeof size !== "number" || !Number.isFinite(size) || size < 0) return null;
  if (size < 1024) return `${size} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let n = size / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(1)} ${units[i]}`;
}

export default function ZipArtifactDetail(props: ArtifactRendererProps): ReactElement {
  const bytes = resolveByteRoad(props);
  const downloadHref = bytes.download;
  const title = props.artifact?.title ?? null;
  const size = formatBytes(props.artifact?.size);
  const heading = title ?? "ZIP archive";

  return (
    <article
      className="soft-panel rounded-card overflow-hidden p-6"
      data-zip-artifact="shell"
      data-byte-road={bytes.road}
    >
      <p className="text-sm font-medium">{heading}</p>
      {/* THE FOUR PARTS THE DRAWING GIVES A DOWNLOAD CARD, AND NO FIFTH (the
          review drawing §V.2): "the file's name, its form, its size, and the
          download". The sentence this panel used to append, and a control that
          said what it was downloading, are neither of them parts of it. */}
      <p className="text-sm text-muted-foreground">
        ZIP archive{size ? ` · ${size}` : ""}
      </p>
      {downloadHref ? (
        <a href={downloadHref} className="text-sm underline" download>
          Download
        </a>
      ) : null}
    </article>
  );
}
