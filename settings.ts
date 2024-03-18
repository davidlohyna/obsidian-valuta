import ValutaPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export interface ValutaPluginSettings {
  baseCurrency: string;
}

// export const DEFAULT_SETTINGS: Partial<ValutaPluginSettings> = {
//   baseCurrency: "USD",
// };


// API query settings
export interface ExchangeRates {
    amount: number;
    base:   string;
    date:   Date;
    rates:  { [key: string]: number };
}

export interface Valuta {
  amount: number;
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
	this.containerEl.addClass('tasks-settings');

	containerEl.createEl("h2", { text: 'Valuta Plugin - Settings' });

    new Setting(containerEl)
      .setName("Base currency")
      .setDesc("Base currency code of choice")
      .addText((currencyCode) =>
        currencyCode
          .setPlaceholder("e.g., EUR, eur")
          .setValue(this.plugin.settings.baseCurrency)
          .onChange(async (value) => {
            this.plugin.settings.baseCurrency = value;
            await this.plugin.saveSettings();
          })
      );

	containerEl.createEl('p', {
	  cls: 'tasks-setting-important',
	  text: 'Changing base currency requires a restart/reload of Obsidian.',
	});
  }
}
