{
  "id": "1f7bad5a",
  "title": "Build 'Link Backlink Counter Badge' Obsidian plugin",
  "tags": [],
  "status": "done",
  "created_at": "2026-02-19T18:19:36.121Z"
}

## Spec
- Scaffold a new Obsidian plugin project (package.json, tsconfig, manifest.json, main.ts, styles.css)
- Use a MarkdownPostProcessor to append a superscript badge after each [[wikilink]] in reading mode showing the number of backlinks to that note
- Build a reverse index from app.metadataCache.resolvedLinks on 'resolved' event and cache it
- Settings tab: toggle on/off, minimum count threshold to display badge, CSS class for styling
- Keep it lightweight — no popups, no extra panels, just the superscript number
- Use TypeScript, follow Obsidian plugin sample conventions
- Build should work with 'npm run build'
- Write a README.md with install/usage instructions
- Mark the todo done when complete
