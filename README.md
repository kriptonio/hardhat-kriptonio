# hardhat-kriptonio

[Kriptonio](https://kriptonio.com/) plugin for [Hardhat](https://hardhat.org)

This plugin allows you to upload compiled hardhat smart contract artifacts to Kriptonio. On kriptonio side new smart contract will be created with attached artifacts, which you can afterward deploy and manage via kriptonio.

## Installation

```bash
npm install @kriptonio/hardhat-kriptonio
```

Import the plugin in your `hardhat.config.js`:

```js
require('@kriptonio/hardhat-kriptonio');
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import '@kriptonio/hardhat-kriptonio';
```

## Configuration

This plugin adds new configuration option in your hardhat config file, called `kriptonio`.

| option                 | Description                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accessToken (required) | Kriptonio organization level access token. You can find it in your [settings page](https://app.kriptonio.com/settings/access-tokens).                                       |
| blockchain (required)  | Blockchain where your smart contract will be deployed. Currently supported values for this fields are `polygon`, `ethereum` and `bsc`.                                      |
| contract (required)    | Smart contract name which you want to upload to kriptonio                                                                                                                   |
| wallet (required)      | Address of kriptonio wallet to use with this smart contract. This wallet will allow you to interact with your smart contract, and will be used for paying transaction fees. |
| name (optional)        | Name of kriptonio smart contract project to be created. Defaults to contract name.                                                                                          |

Example of configuration via hardhat.config.ts

```js
const config: HardhatUserConfig = {
  kriptonio: {
    name: 'My Token on Kriptonio',
    contract: 'MyERC20',
    accessToken: '<kriptonio-access-token>',
    wallet: '<wallet-address>',
    blockchain: 'polygon',
  },
  /** ...the rest of hardhat.config config file  */
};
```

## Usage

This plugin adds the `kriptonio-upload` task to Hardhat:

If you are providing configuration via CLI arguments

```bash
npx hardhat kriptonio-upload --contract <contract-name> --access-token <kriptonio-access-token> --wallet <wallet-address> --blockchain <blockchain-type, eg: polygon>
```

If you are providing configuration via hardhat.config file

```bash
npx hardhat kriptonio-upload
```
