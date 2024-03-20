import { Menu, moment, Notice, Plugin } from "obsidian";
import { DEFAULT_CURRENCY, CurrencyExchangeData, ValutaSettings, ValutaSettingTab } from "./settings";
import { isNumber, round } from "./helpers";


export default class ValutaPlugin extends Plugin {
  settings: ValutaSettings;
  statusBar: HTMLElement;

  async onload() {
	
    // This loads settings
    await this.loadSettings();

    // This adds setting tab
    this.addSettingTab(new ValutaSettingTab(this.app, this));

	// Fetch rates 
	const exchangeRates = await this.fetchData(this.settings.baseCurrency);
	// This is a post processor
	this.registerMarkdownPostProcessor( async (element, context) => {
		const codeblocks = element.findAll("code");

		for (let codeblock of codeblocks) {
			const text = codeblock.innerText.trim();

			// Ensure to check codeblocks with correct plugin syntax only
			if (text[3] === ":" && isNumber(text[4])) {
				const currency: string = text.substring(0, text.indexOf(':'));

				// Validate whether amount is numberic
				let amount: string  = text.substring(4);
				if (!isNumber(amount)) {
					codeblock.replaceWith('Invalid amount');
				} else if (currency.toUpperCase() === this.settings.baseCurrency) {
					codeblock.replaceWith(amount);
				}

				amount *= exchangeRates[currency.toUpperCase()];
				amount = round(amount, 2);
				codeblock.replaceWith(amount);
			}
		}
	});
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_CURRENCY, await this.loadData(), new ValutaPlugin());
	console.log('Settings loaded')
  }

  async saveSettings() {
    await this.saveData(this.settings);
	// await this.fetchData(this.settings.baseCurrency);
	console.log('Settings saved')
  }

  // Fetch rates from API
  async fetchData(baseCurrency: string): Promise<CurrencyExchangeData | undefined> {
    const host = 'api.frankfurter.app';

	try {
		const response = await fetch(`https://${host}/latest?from=${baseCurrency}`);
			const data = await response.json();

		// Work with the data as needed
		// console.log(data);

		// Returns rates quote against base currency
		console.log(data);
		return data.rates;
	} catch (error) {
		// Handle the error as needed
		return undefined;
	}
  }

  public onunload() {
	console.log(`Valuta: version ${this.manifest.version} unloaded.`);
  }
}

