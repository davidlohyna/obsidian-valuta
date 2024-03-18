import { Menu, moment, Notice, Plugin } from "obsidian";
import { DEFAULT_CURRENCY, ExchangeRates, ValutaPluginSettings, ValutaSettingTab } from "./settings";
import { isNumber, round } from "./helpers";



export default class ValutaPlugin extends Plugin {
  settings: ValutaPluginSettings;
  statusBar: HTMLElement;

  async onload() {

    // This loads settings
    await this.loadSettings();

    // This adds setting tab
    this.addSettingTab(new ValutaSettingTab(this.app, this));


	const baseCurrencySetting = this.settings.baseCurrency;
	// This is a post processor
	if (baseCurrencySetting) {
		// Fetch rates on startup if baseCurrency is set
		const exchangeRates = await this.fetchRates(baseCurrencySetting);
		console.log(exchangeRates.base)

		this.registerMarkdownPostProcessor((element, context) => {
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
					} else if (currency.toUpperCase() === baseCurrencySetting) {
						codeblock.replaceWith(amount);
					}
					amount *= exchangeRates.rates[currency.toUpperCase()];
					amount = round(amount, 2);
					codeblock.replaceWith(amount);
				}
			}
		});
	}

    // This is a ribbon icon that returns updates rates and sends a notice
    this.addRibbonIcon("circle-dollar-sign", "Update valuta", async () => {
      // await this.fetchRates();
      await this.loadSettings();
      new Notice("Valuta updated!");
    });

    // This command updates rates quote of currencies
    this.addCommand({
      id: "update-valuta",
      name: "Update valuta",
      callback: async () => {
        try {
          const exchangeRates = await this.fetchRates(baseCurrencySetting);
          if (exchangeRates) {
			await this.loadSettings();
          }
        } catch (error) {
		  new Notice('Error fetching rates');
        }
        new Notice('Valuta updated');
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_CURRENCY, await this.loadData(), new ValutaPlugin());
	console.log('Settings loaded')
  }

  async saveSettings() {
    await this.saveData(this.settings);
	console.log('Settings saved')
  }

  // Fetch rates from API. Rates quote against the Euro by default.
  // Quote against other currencies using the 'from' parameter. (e.g., /latest?from=USD)
  async fetchRates(baseCurrency: string): Promise<ExchangeRates | undefined> {
    const host = 'api.frankfurter.app';

	try {
		const response = await fetch(`https://${host}/latest?from=${baseCurrency}`);
			const rates = await response.json();

		// Work with the data as needed
		// console.log(data);

		// You can return the data or perform further operations here
		return rates;
	} catch (error) {
		// Handle the error as needed
		return undefined;
	}
  }

  public onunload() {
	console.log(`Valuta: version ${this.manifest.version} unloaded.`);
  }
}

