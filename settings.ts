import ValutaPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export interface ValutaPluginSettings {
  baseCurrency: string;
}

export const DEFAULT_SETTINGS: Partial<ValutaPluginSettings> = {
  baseCurrency: "EUR",
};

export const ALL_EMOJIS: Record<string, string> = {
  ":eur:": "💶",
  ":usd:": "💵",
  ":gbp:": "💷",
};

// API query settings
export interface ExchangeRates {
    amount: number;
    base:   string;
    date:   Date;
    rates:  { [key: string]: number };
}

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
      .setName("Base currency")
      .setDesc("Base currency code of choice. Example: EUR or eur")
      .addText((text) =>
        text
          .setPlaceholder("EUR")
          .setValue(this.plugin.settings.baseCurrency)
          .onChange(async (value) => {
            this.plugin.settings.baseCurrency = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
