// The row icon of a ZIP archive in the Artifacts list: the icon the drawing gives
// this package's type, drawn at 17 pixels inside the application's own cell (the
// cell's size and tint stay the application's). It reads nothing but its props,
// requests no host port, fetches nothing and draws the same icon for every object type.
import { FileArchive } from "lucide-react";
import type { ArtifactRendererProps } from "../artifact-renderer-props";

export interface ListRowProps {
  artifact: Pick<ArtifactRendererProps["artifact"], "objectType">;
}

export default function ListRow(_props: ListRowProps) {
  return <FileArchive aria-hidden size={17} strokeWidth={2} data-row-glyph="file-archive" />;
}
