#!/bin/bash
set -e

CONTRACT_ID=restore-together.near
NEAR_ID=vlodkow.near

NEAR_ENV=mainnet near deploy "$CONTRACT_ID" ./out/main.wasm --masterAccount "$NEAR_ID"

NEAR_ENV=mainnet near create-account nft."$CONTRACT_ID" --masterAccount "$CONTRACT_ID" --initialBalance 4
NEAR_ENV=mainnet near deploy nft."$CONTRACT_ID" ./out/nft.wasm

# Init
echo "--- Init Contracts:"
NEAR_ENV=mainnet near call nft.$CONTRACT_ID new_default_meta '{"owner_id":"'$NEAR_ID'"}' --accountId $NEAR_ID
