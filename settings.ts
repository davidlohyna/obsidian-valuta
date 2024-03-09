import ValutaPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class ValutaSettingTab extends PluginSettingTab {
  plugin: ValutaPlugin;

  constructor(app: App, plugin: ValutaPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

	containerEl.createEl("h2", { text: 'Valuta Plugin - Settings' });

    new Setting(containerEl)
      .setName("Defaul currency")
      .setDesc("Default currency code.")
      .addText((text) =>
        text
          .setPlaceholder("EUR")
          .setValue(this.plugin.settings.defaultCurrency)
          .onChange(async (value) => {
            this.plugin.settings.defaultCurrency = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Update frequency")
      .setDesc("Update frequency of exchange rates in minutes.")
      .addText((text) =>
        text
          .setPlaceholder("30")
          .setValue(this.plugin.settings.updateFrequency)
          .onChange(async (value) => {
            this.plugin.settings.updateFrequency = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
