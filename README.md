# Archive

The system archive handler for the Cinatra artifact library. It recognizes uploaded ZIP archives (`application/zip`, `application/x-zip-compressed`) and files them in the library under a dedicated archive type, so a `.zip` you attach in chat or upload to `/artifacts` lands correctly typed instead of being refused.

Install from the Cinatra marketplace by searching for "Archive" and clicking **Add**. No credentials or configuration are required; the type is active immediately for all workspace members. Opening an archive shows its identity and size with a download affordance — a browser cannot render an archive inline, so the detail view is a clear download shell, never a blank panel.

## Works with

- Cinatra chat — attach a `.zip` archive directly in any thread
- The artifact library — open any archive item to download it

## Capabilities

- Accept ZIP uploads (`application/zip`, `application/x-zip-compressed`) as a dedicated artifact type
- Present the archive identity and size with a download affordance
- Never a blank view — the shell always renders the archive
