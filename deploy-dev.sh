#!/bin/bash
set -e

if [ ${#NEAR_ID} -eq 0 ]
then
  read -p "Enter NEAR_ID: " NEAR_ID
fi

# CONTRACT_ID=______.testnet
# NEAR_ID=vlodkow.testnet
# near deploy --accountId "$CONTRACT_ID" --wasmFile out/main.wasm
# or use dev-deploy:

near dev-deploy out/main.wasm --accountId "$NEAR_ID"

CONTRACT_ID=$(<neardev/dev-account)

near create-account nft."$CONTRACT_ID" --masterAccount "$CONTRACT_ID" --initialBalance 5
near deploy --accountId nft."$CONTRACT_ID" --wasmFile out/nft.wasm

# Init
echo "--- Init Contracts:"
near call nft.$CONTRACT_ID new_default_meta '{"owner_id":"'$NEAR_ID'"}' --accountId $NEAR_ID
