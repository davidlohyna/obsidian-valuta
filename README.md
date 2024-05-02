# Obsidian Valuta
## Description
Obsidian Valuta is a convenient plugin designed to enhance the functionality of a markdown-based note-taking app [Obsidian](https://obsidian.md). It seamlessly integrates with the [Frankfurter API](https://www.frankfurter.app) to provide users with up-to-date currency conversion rates. With Obsidian Valuta, users can quickly access conversion rates directly within their notes, simplifying tasks like budgeting for international travel or managing expenses across different currencies. This intuitive integration streamlines the workflow, allowing users to make informed financial decisions without leaving the Obsidian environment.
### Features
* **Currency Conversion**: Convert currency values within your notes effortlessly using a simple [syntax](#usage).
* **Real-Time Exchange Rates**: Fetches up-to-date exchange rates from the [Frankfurter API](https://www.frankfurter.app/).
* **Customisable Base Currency**: Tailor the plugin to your needs by selecting your preferred base currency for conversions.
## Installation
You can install the plugin from Community Plugins tab inside your Obsidian. Make sure the plugin is enabled.
## Usage
Once Valuta is installed and enabled, you can seamlessly integrate currency conversions into your notes using the following syntax:

```
`CURRENCY_CODE:AMOUNT`
```
Replace CURRENCY_CODE with the desired currency code (e.g., USD, EUR) and AMOUNT with the numeric value you wish to convert. The plugin will automatically process this syntax and display the converted currency value from your base currency.

The following code will convert 100 of your base currency to US dollars.
```
`USD:100`
```

The syntax is case insensitive (i.e., the following syntax is equally valid).
```
`usd:100`
```

**Note:** Base currency is set to EUR by default and you can change it inside the plugin settings. Make sure to restart or reload Obsidian (using "Reload without saving" command) to see the changes.
