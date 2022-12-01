Restore Together
==================

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See
deployment for notes on how to deploy the project on a live system.

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