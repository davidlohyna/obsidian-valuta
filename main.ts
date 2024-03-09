import { Menu, Notice, Plugin } from "obsidian";
import { ExampleSettingTab } from "./settings";

interface ExamplePluginSettings {
  dateFormat: string;
  timeFormat: string;
}

const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
  dateFormat: "YYYY-MM-DD",
  timeFormat: "HH:mm",
};

export default class ExamplePlugin extends Plugin {
  settings: ExamplePluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new ExampleSettingTab(this.app, this));

    // This is a command in palette that send a message to console

    this.addCommand({
      id: "print-greeting-to-console",
      name: "Print greeting to console",
      callback: () => {
        console.log("Hey, you!");
      },
    });

    // This is a ribbon icon that has a contex menu

    this.addRibbonIcon("dice", "Open menu", (event) => {
      const menu = new Menu();

      // This is a context menu icon

      menu.addItem((item) =>
        item
          .setTitle("Copy")
          .setIcon("documents")
          .onClick(() => {
            new Notice("Copied");
          })
      );

      // This is a context menu icon

      menu.addItem((item) =>
        item
          .setTitle("Paste")
          .setIcon("paste")
          .onClick(() => {
            new Notice("Pasted");
          })
      );

      // This triggers the event on mouse click

      menu.showAtMouseEvent(event);
    });

    // This adds a file menu event

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        menu.addItem((item) => {
          item
            .setTitle("Print file path 👈")
            .setIcon("document")
            .onClick(async () => {
              new Notice(file.path);
            });
        });
      })
    );

    // this add a editor menu event

    this.registerEvent(
        this.app.workspace.on("editor-menu", (menu, editor, view) => {
          menu.addItem((item) => {
            item
              .setTitle("Print file path 👈")
              .setIcon("document")
              .onClick(async () => {
                new Notice(view.file.path);
              });
          });
        })
      );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
