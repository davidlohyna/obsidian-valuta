# Obsidian Valuta
#### Video Demo: <https://youtu.be/ME1pWumbu90>
## Description
Obsidian Valuta is a convenient plugin designed to enhance the functionality of a markdown-based note-taking app [Obsidian](https://obsidian.md). It seamlessly integrates with the [Frankfurter API](https://www.frankfurter.app) to provide users with up-to-date currency conversion rates. With Obsidian Valuta, users can quickly access conversion rates directly within their notes, simplifying tasks like budgeting for international travel or managing expenses across different currencies. This intuitive integration streamlines the workflow, allowing users to make informed financial decisions without leaving the Obsidian environment.

### Features
* **Currency Conversion**: Convert currency values within your notes effortlessly using a simple [syntax](#usage).
* **Real-Time Exchange Rates**: Fetches up-to-date exchange rates from the [Frankfurter API](https://www.frankfurter.app/).
* **Customisable Base Currency**: Tailor the plugin to your needs by selecting your preferred base currency for conversions.

## Understanding
#### styles.css
Adds styling to the text inside settings.ts
#### currency-codes.ts
This file exports array of available currency codes for API call. The reason for them being hard coded is a design choice, as it is simpler in combination to load and save functions inside main.ts and settings.ts.
#### helpers.ts
Functions inside this file ensure that main.ts runs as intended.
- `isNum()` takes a string and returns `true` if its value is numeric and `false` if not,
- `round()` takes number as input and rounds it to two decimals.

These need to be made manually as there is no in-built function in Typescript for that.

#### settings.ts
Top section of the file imports necessary modules and classes from other files and from the Obsidian API. Specifically, it imports CURRENCY_CODES from currency-codes.ts file, the ValutaPlugin class from the main.ts file, and various classes (App, PluginSettingTab, and Setting) from the Obsidian API.

Moreover, the file defines two interfaces which are exported for further use in main.ts.
1. ValutaSettings, which describes the structure of the settings used by the Valuta plugin and currently only includes one property `baseCurrency` (Which represents the base currency for exchange rates).
2. ValutaData, which describes the structure of data returned by the API used for fetching exchange rates.

Additionally, a constant DEFAULT_SETTINGS sets the default base currency to "EUR".

Continuing on, a class ValutaSettingTab is defined, which extends PluginSettingTab provided by Obsidian for creating plugin settings tabs. It also includes a constructor that takes app and plugin as parameters and assigns them to the class properties.

A method display() within the ValutaSettingTab class starts by clearing the content of the settings tab and adding a CSS class to the container element.

Next line creates a `<h2>` element within the settings tab container with the text "Valuta Plugin - Settings".

The following chunk of code creates a new setting within the container element. It sets the name of the setting and provides a description. Next, it adds a dropdown menu to the setting for selecting the base currency. It iterates over CURRENCY_CODES array imported at top of the file to populate the dropdown options. It sets the initial value of the dropdown to the plugin's current base currency setting and defines an onChange event handler to update the base currency setting when the dropdown value changes.

Last block creates a `<p>` element within the settings tab container with a class `valuta-setting-important`, which is styled inside style.css and provides a disclaimer to users.

#### main.ts
Conveniantly, main.ts imports necessary modules and classes. It imports Plugin from Obsidian, DEFAULT_SETTINGS, ValutaData, ValutaSettings, and ValutaSettingTab from the settings.ts file, and isNumber and round functions from the helpers.ts file.

Main code starts with a class ValutaPlugin that extends Plugin provided by Obsidian. It includes a property settings of type ValutaSettings, representing the settings used by the Valuta plugin.

An asynchronous method onload() which is called when the plugin is loaded, contains the essence of the plugin. It
- awaits the loading of plugin settings with `await this.loadSettings();` function,
- adds a setting tab for the plugin using the `ValutaSettingTab` class defined in the `settings.ts` file,
- fetches data using the `fetchData()` method, passing the base currency from plugin settings.
    - This method fetches exchange rate data asynchronously from an API based on the provided base currency and with the help of ValutaData interface defined in settings.ts. It handles any errors that occur during the fetch operation or returns data as json.

Next, markdown post processing is implemented using `registerMarkdownPostProcessor`. It ensures that the plugin syntax as written in markdown, is processed correctly and shows the values the user desires. It loops through all codeblocks (defined as \`text\` in markdown) inside a note, trims the \` around the text and stores it inside a variable.

Then, it validates whether the variable contains syntactically correct value (Refer to [Usage](#usage)) for the plugin's further actions. If so, it separates the `CURRENCY_CODE` and `AMOUNT` to get correct convertion rates against the default currency defined by user and to calculate the final value.

It also adds a layer of validation so that if user writes incorrect currency code, the plugin does not process the codeblock and if the amount is not numeric, it processes the codeblock as 'Invalid amound'. Additionally, if user tries to exchange the amount to the same currency as is their base currency, the plugin returns the amount as is, without any changes.

### Other files
The plugin contains additional files that come from Obsidian Sample Plugin [template](https://github.com/obsidianmd/obsidian-sample-plugin). These allow for quick plugin set up and ensure correct usage. For further reference visit [Obsidian Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) on how to build a plugin.
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
