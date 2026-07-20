// Archive (ZIP) detail renderer (slot `detail`).
//
// A browser cannot render a ZIP archive inline, and the v1 renderer snapshot
// carries only host-authorized URLs — never the archive bytes — so a
// client-side central-directory LISTING would require the renderer to fetch and
// parse the archive itself. That is beyond the sibling bases' passive-URL depth
// (audio/video/image/pdf all hand a URL to a native element and never
// fetch/parse), so it is deliberately out of scope here: the faithful minimal
// renderer is a typed download SHELL — the archive's identity, its size, and a
// download affordance.
//
// v1 renderer: requests NO host ports; renders ONLY from the host-supplied
// authorized snapshot (`ArtifactRendererProps`).
//
// NEVER-BLANK: the shell always renders the archive identity; the download link
// appears only when the host authorized one, but the panel is never empty.

import type { ReactElement } from "react";

import type { ArtifactRendererProps } from "../artifact-renderer-props";

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
  const downloadHref = props.actions?.download ?? props.urls?.download ?? null;
  const title = props.artifact?.title ?? null;
  const size = formatBytes(props.artifact?.size);
  const heading = title ?? "ZIP archive";

  return (
    <article
      className="soft-panel rounded-card overflow-hidden p-6"
      data-zip-artifact="shell"
    >
      <p className="text-sm font-medium">{heading}</p>
      <p className="text-sm text-muted-foreground">
        ZIP archive{size ? ` · ${size}` : ""}. Download to open its contents.
      </p>
      {downloadHref ? (
        <a href={downloadHref} className="text-sm underline" download>
          Download the archive
        </a>
      ) : null}
    </article>
  );
}
