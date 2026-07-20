// `@cinatra-ai/zip-artifact` — the system-base archive (ZIP) renderer. It ships a `detail`-slot renderer that presents an uploaded ZIP archive as a download shell (the browser cannot render an archive inline; a client-side central-directory listing is deliberately out of scope for the v1 no-content snapshot).
//
// A renderer artifact: it declares its accepted upload MIME set (the required
// MIME-base expansion, epic cinatra#1883 slice A1), a single `detail`-slot v1
// renderer, and a dedicated `objectTypes` claim (`@cinatra-ai/zip-artifact:artifact`) so the
// core upload pipeline can map an accepted MIME to exactly this type (the
// exactly-one-or-refuse resolver in src/lib/artifacts/upload-artifact-type-map).
// The accepted MIME set is DISJOINT from every other required base — the
// DECLARED media type decides the type, never magic byte-sniffing (a .docx is a
// ZIP container on disk, but its declared OOXML media type routes it here, not
// to zip-artifact).
//
// The AUTHORITATIVE manifest is the `cinatra` block in `package.json` (what the
// host install pipeline + the marketplace publish gate read). This module
// re-declares the `artifact` descriptor as a typed value for programmatic use;
// the manifest test keeps the two in agreement.

export {
  type ArtifactRendererProps,
  ARTIFACT_RENDERER_PROPS_API_VERSION,
} from "./artifact-renderer-props";

/** The closed v1 renderer-slot names. This base ships `detail` only. */
export type ArtifactUiSlot = "detail" | "preview";

/** A single slot renderer. v1 requests NO host ports — only these three keys. */
export interface ArtifactUiRenderer {
  entry: string;
  propsApiVersion: number;
  representations?: string[];
}

export interface ArtifactUiManifest {
  abiVersion: 1;
  sdkAbiRange: string;
  renderers: Partial<Record<ArtifactUiSlot, ArtifactUiRenderer>>;
}

export interface ZipArtifactManifest {
  accepts: { file: { mimeTypes: string[] } };
  ui: ArtifactUiManifest;
}

export const zipArtifactManifest: ZipArtifactManifest = {
  accepts: {
    file: {
      mimeTypes: ["application/zip","application/x-zip-compressed"],
    },
  },
  ui: {
    abiVersion: 1,
    sdkAbiRange: "^2.4.0",
    renderers: {
      detail: {
        entry: "./src/renderers/detail.tsx",
        propsApiVersion: 1,
        representations: ["application/zip","application/x-zip-compressed"],
      },
    },
  },
};
