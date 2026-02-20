# Backlink Badge

A lightweight Obsidian plugin that appends a superscript badge after each `[[wikilink]]` in **reading mode**, showing the number of notes that link to the target note.

![demo](https://img.shields.io/badge/backlinks-42-blue?style=flat-square)

## Features

- **Superscript badge** next to every internal link in reading mode
- **Automatic** – recalculates whenever Obsidian resolves metadata
- **Configurable** – toggle on/off, set a minimum count threshold, and customise the CSS class
- **Zero overhead** – no extra panels, popups, or sidebars

## Installation

### Manual

1. Clone or download this repository into your vault's `.obsidian/plugins/backlink-badge/` directory.
2. Install dependencies and build:

   ```bash
   npm install
   npm run build
   ```

3. In Obsidian, go to **Settings → Community Plugins**, enable **Backlink Badge**.

### From Obsidian Community Plugins (coming soon)

Search for "Backlink Badge" in the Community Plugins browser and click **Install**.

## Usage

Open any note in **reading mode**. Every `[[wikilink]]` will have a small superscript number showing how many other notes link to the target note.

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Enable badges | `true` | Master on/off toggle |
| Minimum count | `1` | Only show the badge when the backlink count ≥ this value |
| Badge CSS class | `backlink-badge` | CSS class on the `<sup>` element – override for custom styling |

### Custom Styling

Add a CSS snippet in your vault (`.obsidian/snippets/`) to override the badge look:

```css
.backlink-badge {
  background-color: var(--text-accent);
  color: white;
  font-size: 0.6em;
  padding: 0.15em 0.4em;
  border-radius: 4px;
}
```

## Development

```bash
npm install
npm run dev    # watch mode (auto-rebuild on save)
npm run build  # production build
```


## Inspiration

This plugin was built in response to a request by u/JellyBOMB in [this Reddit thread](https://www.reddit.com/r/ObsidianMD/comments/1r8vw0w/anyone_have_a_plugin_request/) — a minimal backlink count badge on wikilinks.

## License

MIT
