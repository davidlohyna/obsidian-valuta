import { Menu, moment, Notice, Plugin } from "obsidian";
import { ALL_EMOJIS, DEFAULT_SETTINGS, ExchangeRates, ValutaPluginSettings, ValutaSettingTab } from "./settings";


export default class ValutaPlugin extends Plugin {
  settings: ValutaPluginSettings;
  statusBar: HTMLElement;

  async onload() {

    // This loads settings
    await this.loadSettings();

    // This adds setting tab
    this.addSettingTab(new ValutaSettingTab(this.app, this));

    // Fetch rates on startup
    await this.fetchAndHandleRates();

    // This is a post processor
    this.registerMarkdownPostProcessor((element, context) => {
      const codeblocks = element.findAll("code");

      for (let codeblock of codeblocks) {
        const text = codeblock.innerText.trim();
        if (text[0] === ":" && text[text.length - 1] === ":") {
          const emojiEl = codeblock.createSpan({
            text: ALL_EMOJIS[text] ?? text,
          });
          codeblock.replaceWith(emojiEl);
        }
      }
    });

    // This is a ribbon icon that returns updates rates and sends a notice
    this.addRibbonIcon("circle-dollar-sign", "Update valuta", async () => {
      await this.fetchAndHandleRates();
      new Notice("Valuta updated!");
    });

    // This command updates rates quote of currencies
    this.addCommand({
      id: "update-valuta",
      name: "Update valuta",
      callback: async () => {
        try {
          const result = await this.fetchRates(this.settings.baseCurrency);
          if (result) {
            this.handleFetchedRates(result);
          }
        } catch (error) {
          console.error('Error fetching or handling rates:', error);
        }
        new Notice("Valuta updated!");
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // Fetch and handle rates using fetchRates() and handleFetchedRates()
  async fetchAndHandleRates(): Promise<void> {
    try {
      const result = await this.fetchRates(this.settings.baseCurrency);
      if (result) {
        this.handleFetchedRates(result);
      }
    } catch (error) {
      console.error('Error fetching or handling rates:', error);
    }
  }

  // Fetch rates from API. Rates quote against the Euro by default.
  // Quote against other currencies using the 'from' parameter. (e.g., /latest?from=USD)
  async fetchRates(baseCurrency: string): Promise<ExchangeRates | undefined> {
    const host = 'api.frankfurter.app';

    try {
      const response = await fetch(`https://${host}/latest?from=${baseCurrency}`);
      const data = await response.json();

      // Work with the data as needed
      // console.log(data);

      // You can return the data or perform further operations here
      return data as ExchangeRates;
    } catch (error) {
      console.error('Error fetching rates:', error);
      // Handle the error as needed
      return undefined;
    }
  }

  handleFetchedRates(data: ExchangeRates): void {
    // Your logic to handle the fetched data within your Obsidian plugin
    console.log(data);
    // Update Obsidian UI or perform any other necessary actions
  }
}

