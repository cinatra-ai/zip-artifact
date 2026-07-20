import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";

import ZipArtifactDetail, { formatBytes } from "../src/renderers/detail";
import type { ArtifactRendererProps } from "../src/artifact-renderer-props";

afterEach(cleanup);

function props(overrides: {
  download?: string | null;
  title?: string | null;
  size?: number;
}): ArtifactRendererProps {
  return {
    propsApiVersion: 1,
    artifact: {
      id: "art_1",
      title: overrides.title === undefined ? "assets.zip" : overrides.title,
      objectType: "@cinatra-ai/zip-artifact:artifact",
      mime: "application/zip",
      size: overrides.size === undefined ? 5_242_880 : overrides.size,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      ownerLevel: "workspace",
      visibility: "workspace",
      sourceUrl: null,
    },
    representation: { revisionId: "rev_1", mime: "application/zip" },
    urls: {
      preview: null,
      download: overrides.download === undefined ? "/api/artifacts/art_1/download" : overrides.download,
    },
    identity: { kind: "mime", extension: null, basis: null, selectable: false },
    actions: {
      download: overrides.download === undefined ? "/api/artifacts/art_1/download" : overrides.download,
      openInSource: null,
    },
  };
}

describe("formatBytes", () => {
  it("formats byte sizes across unit boundaries and rejects invalid input", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(5_242_880)).toBe("5.0 MB");
    expect(formatBytes(null)).toBeNull();
    expect(formatBytes(-1)).toBeNull();
    expect(formatBytes(Number.NaN)).toBeNull();
  });
});

describe("ZipArtifactDetail — the archive download shell", () => {
  it("renders the archive identity and a download affordance", () => {
    const { container } = render(<ZipArtifactDetail {...props({})} />);
    const shell = container.querySelector('[data-zip-artifact="shell"]');
    expect(shell?.tagName.toLowerCase()).toBe("article");
    expect(shell?.getAttribute("class")).toContain("soft-panel rounded-card");
    expect(shell?.textContent).toContain("ZIP archive");
    expect(shell?.textContent).toContain("5.0 MB");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/api/artifacts/art_1/download");
  });

  it("uses the artifact title as the heading when present, else a generic label", () => {
    const withTitle = render(<ZipArtifactDetail {...props({ title: "release.zip" })} />);
    expect(withTitle.container.textContent).toContain("release.zip");
    cleanup();
    const noTitle = render(<ZipArtifactDetail {...props({ title: null })} />);
    expect(noTitle.container.textContent).toContain("ZIP archive");
  });

  it("does not render an inline frame (a browser cannot render an archive)", () => {
    const { container } = render(<ZipArtifactDetail {...props({})} />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.querySelector("embed")).toBeNull();
  });

  it("NEVER-BLANK: a null download URL still renders the shell without a link", () => {
    const { container } = render(<ZipArtifactDetail {...props({ download: null })} />);
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector('[data-zip-artifact="shell"]')).not.toBeNull();
    expect((container.textContent ?? "").trim().length).toBeGreaterThan(0);
  });

  it("tolerates a malformed snapshot missing urls/actions (never throws, never blank)", () => {
    const malformed = {
      propsApiVersion: 1,
      artifact: { title: null },
    } as unknown as ArtifactRendererProps;
    const { container } = render(<ZipArtifactDetail {...malformed} />);
    expect(container.querySelector('[data-zip-artifact="shell"]')).not.toBeNull();
    expect((container.textContent ?? "").trim().length).toBeGreaterThan(0);
  });
});
