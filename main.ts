import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  MarkdownPostProcessorContext,
  TFile,
} from "obsidian";

// ── Settings ────────────────────────────────────────────────────────────────

interface BacklinkBadgeSettings {
  enabled: boolean;
  minCount: number;
  badgeClass: string;
}

const DEFAULT_SETTINGS: BacklinkBadgeSettings = {
  enabled: true,
  minCount: 1,
  badgeClass: "backlink-badge",
};

// ── Plugin ──────────────────────────────────────────────────────────────────

export default class BacklinkBadgePlugin extends Plugin {
  settings: BacklinkBadgeSettings = DEFAULT_SETTINGS;

  /**
   * Reverse index: target path → number of distinct source files that link to it.
   */
  private backlinkCounts: Map<string, number> = new Map();

  async onload(): Promise<void> {
    await this.loadSettings();

    // Build the index once metadata is ready, then refresh on every change.
    this.registerEvent(
      this.app.metadataCache.on("resolved", () => {
        this.rebuildIndex();
      })
    );

    // Register the reading-mode post-processor.
    this.registerMarkdownPostProcessor(
      (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        this.postProcess(el, ctx);
      }
    );

    this.addSettingTab(new BacklinkBadgeSettingTab(this.app, this));
  }

  // ── Index ───────────────────────────────────────────────────────────────

  private rebuildIndex(): void {
    const counts = new Map<string, number>();
    const resolved = this.app.metadataCache.resolvedLinks;

    // resolvedLinks is { [sourcePath]: { [targetPath]: linkCount } }
    for (const sourcePath in resolved) {
      const targets = resolved[sourcePath];
      for (const targetPath in targets) {
        counts.set(targetPath, (counts.get(targetPath) ?? 0) + 1);
      }
    }

    this.backlinkCounts = counts;
  }

  getBacklinkCount(path: string): number {
    return this.backlinkCounts.get(path) ?? 0;
  }

  // ── Post-processor ──────────────────────────────────────────────────────

  private postProcess(
    el: HTMLElement,
    _ctx: MarkdownPostProcessorContext
  ): void {
    if (!this.settings.enabled) return;

    // Obsidian renders internal links as <a class="internal-link" …>
    const links = el.querySelectorAll<HTMLAnchorElement>("a.internal-link");

    for (const link of Array.from(links)) {
      // Already processed (e.g. re-render)
      if (link.querySelector(`.${this.settings.badgeClass}`)) continue;

      const href = link.getAttr("href");
      if (!href) continue;

      // Resolve the link text to a file path (strips heading / block refs).
      const cleanHref = href.split("#")[0];
      const file = this.app.metadataCache.getFirstLinkpathDest(
        cleanHref,
        _ctx.sourcePath
      );
      if (!file) continue;

      const count = this.getBacklinkCount(file.path);
      if (count < this.settings.minCount) continue;

      const badge = document.createElement("sup");
      badge.addClass(this.settings.badgeClass);
      badge.textContent = String(count);
      link.appendChild(badge);
    }
  }

  // ── Settings persistence ────────────────────────────────────────────────

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}

// ── Settings Tab ────────────────────────────────────────────────────────────

class BacklinkBadgeSettingTab extends PluginSettingTab {
  plugin: BacklinkBadgePlugin;

  constructor(app: App, plugin: BacklinkBadgePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Backlink Badge Settings" });

    new Setting(containerEl)
      .setName("Enable badges")
      .setDesc("Toggle backlink count badges on or off.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enabled).onChange(async (val) => {
          this.plugin.settings.enabled = val;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Minimum count")
      .setDesc(
        "Only show the badge when the backlink count is at least this number."
      )
      .addText((text) =>
        text
          .setPlaceholder("1")
          .setValue(String(this.plugin.settings.minCount))
          .onChange(async (val) => {
            const n = parseInt(val, 10);
            if (!isNaN(n) && n >= 0) {
              this.plugin.settings.minCount = n;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Badge CSS class")
      .setDesc(
        "CSS class applied to each badge element. Change this to use your own styles."
      )
      .addText((text) =>
        text
          .setPlaceholder("backlink-badge")
          .setValue(this.plugin.settings.badgeClass)
          .onChange(async (val) => {
            this.plugin.settings.badgeClass = val.trim() || "backlink-badge";
            await this.plugin.saveSettings();
          })
      );
  }
}
