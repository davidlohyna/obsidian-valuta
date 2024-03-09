import { Menu, moment, Notice, Plugin } from "obsidian";
import { ValutaSettingTab } from "./settings";

interface ValutaPluginSettings {
  defaultCurrency: string;
  updateFrequency: integer;
}

const DEFAULT_SETTINGS: Partial<ValutaPluginSettings> = {
  defaultCurrency: "EUR",
  updateFrequency: "30",
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

    this.statusBar = this.addStatusBarItem();

    this.updateStatusBar();

    this.registerInterval(
      window.setInterval(() => this.updateStatusBar(), 1000)
    );


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

    // This is a command in palette that reutrns a notice

    this.addCommand({
      id: "update-currency-rates",
      name: "Update currency rates",
      callback: () => {
		new Notice("Currency rates updated!");
      },
    });

    // This is a ribbon icon that returns a notice

    this.addRibbonIcon("circle-dollar-sign", "Update currency rates", () => {
		new Notice("Currency rates updated!")
		});
  }

  updateStatusBar() {
    this.statusBar.setText(moment().format("H:mm:ss"));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
