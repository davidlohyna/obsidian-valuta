import { CURRENCY_CODES } from "./currency-codes"
import { ValutaPlugin } from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export interface ValutaSettings {
  baseCurrency: string;
}

export const DEFAULT_SETTINGS: Partial<ValutaPlugin> = {
	baseCurrency: "EUR",
}

// API query interface
export interface ValutaData {
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
	this.containerEl.addClass('tasks-settings');

	containerEl.createEl("h2", { text: 'Valuta Plugin - Settings' });

    new Setting(containerEl)
      .setName("Base currency")
	  // TODO: fix Desc
      .setDesc("Currency that plugin rates quote against")
	  .addDropdown((dropdown) => {
		CURRENCY_CODES.forEach(currencyCode => {
			dropdown.addOption(currencyCode, currencyCode);
			});
		dropdown
			.setValue(this.plugin.settings.baseCurrency)
			.onChange(async (value) => {
				// Handle the change in value here
				console.log('Base currency:', value);
				this.plugin.settings.baseCurrency = value;
				await this.plugin.saveSettings();
			})
	  });
	containerEl.createEl('p', {
	  cls: 'tasks-setting-important',
	  text: 'To see latest exchange rates or to apply changes after changing the base currency, you need to restart or reload Obsidian (via "Reload without saving" command).',
	});
  }
}
