Restore Together
==================



Getting Started
=============

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how
to deploy the project on a live system.

### Prerequisites

```
NodeJS 16+
NEAR-CLI
```

### Install

```
yarn install
```

### Build Smart-contracts

```
yarn build:contracts
```

Run Testnet
=============

#### Deploy Smart-contracts:

```
yarn dev:deploy:contract
```

#### Start frontend:

```
yarn start
```

Now you'll have a local development environment backed by the NEAR TestNet!

Local Development
=============

More details: https://docs.near.org/docs/tools/kurtosis-localnet

### Prerequisites

```
NodeJS 14+
Docker
NEAR-CLI
Kurtosis CLI
```

### Install

```
kurtosis engine start
curl -o ~/launch-local-near-cluster.sh https://raw.githubusercontent.com/kurtosis-tech/near-kurtosis-module/master/launch-local-near-cluster.sh -L
chmod u+x ~/launch-local-near-cluster.sh
```

#### 1. Launch Kurtosis NEAR Module:

```
~/launch-local-near-cluster.sh
```

Check command output and use instructions to import alias and env settings.

#### 2. Replace your env settings in .env.local

#### 3. Import test.near master account:

Replace WALLET_URL and SECRET_KEY (test.near secret_key) and open URL:
_WALLET_URL_/auto-import-secret-key#test.near/_SECRET_KEY_

#### 4. Login in console using master account:

```
local_near login
```

#### 5. Deploy to localnet:

Manually run commands from file deploy-local.sh.

#### 6. Start frontend

```
yarn local
```

Deploy
=============

Every smart contract in NEAR has its [own associated account][NEAR accounts]. When you run `yarn dev`, your smart contract gets deployed to the live NEAR
TestNet with a throwaway account. When you're ready to make it permanent, here's how.


Step 1: Create an account for the contract
------------------------------------------

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your
contract to `zomland.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `zomland.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

   near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

   near create-account zomland.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet

Step 2: set contract name in code
---------------------------------

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'zomland.YOUR-NAME.testnet'

Step 3: deploy!
---------------

One command:

    yarn deploy

As you can see in `package.json`, this does two things:

1. builds & deploys smart contract to NEAR TestNet
2. builds & deploys frontend code to GitHub using [gh-pages]. This will only work if the project already has a repository set up on GitHub. Feel free to modify
   the `deploy` script in `package.json` to deploy elsewhere.
