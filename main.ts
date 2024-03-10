import { Menu, moment, Notice, Plugin } from "obsidian";
import { ValutaSettingTab } from "./settings";
import { ExchangeRates } from "./exchange-rates"

interface ValutaPluginSettings {
  defaultCurrency: string;
}

const DEFAULT_SETTINGS: Partial<ValutaPluginSettings> = {
  defaultCurrency: "EUR",
};

const ALL_EMOJIS: Record<string, string> = {
  ":eur:": "💶",
  ":usd:": "💵",
  ":gbp:": "💷",
};

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
    this.addRibbonIcon("circle-dollar-sign", "Update rates", async () => {
      await this.fetchAndHandleRates();
      new Notice("Rates updated!");
    });

    // This command updates rates quote of currencies
    this.addCommand({
      id: "update-rates",
      name: "Update rates",
      callback: async () => {
        try {
          const result = await this.fetchRates();
          if (result) {
            this.handleFetchedRates(result);
          }
        } catch (error) {
          console.error('Error fetching or handling data:', error);
        }
        new Notice("Rates updated!");
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
      const result = await this.fetchRates();
      if (result) {
        this.handleFetchedRates(result);
      }
    } catch (error) {
      console.error('Error fetching or handling data:', error);
    }
  }

  // Fetch rates from API. Rates quote against the Euro by default.
  // Quote against other currencies using the 'from' parameter. (e.g., /latest?from=USD)
  async fetchRates(): Promise<ExchangeRates | undefined> {
    const host = 'api.frankfurter.app';

    try {
      const response = await fetch(`https://${host}/latest`);
      const data = await response.json();

      // Work with the data as needed
      // console.log(data);

      // You can return the data or perform further operations here
      return data as ExchangeRates;
    } catch (error) {
      console.error('Error fetching data:', error);
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

