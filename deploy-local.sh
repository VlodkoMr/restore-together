#!/bin/bash
set -e

# CONTRACT_ID=$(<neardev/dev-account)
# NEAR_ID=vlodkow.testnet
# near deploy --accountId "$CONTRACT_ID" --wasmFile out/main.wasm
# or use dev-deploy:

NEAR_ID=test.near
local_near dev-deploy out/main.wasm --accountId "$NEAR_ID"

local_near create-account nft."$CONTRACT_ID" --masterAccount "$CONTRACT_ID" --initialBalance 5
local_near deploy --accountId nft."$CONTRACT_ID" --wasmFile out/nft.wasm

# Init
echo "--- Init Contracts:"
local_near call nft.$CONTRACT_ID new_default_meta '{"owner_id":"'$NEAR_ID'"}' --accountId $NEAR_IDlocal_near call nft.$CONTRACT_ID new_default_meta '{"owner_id":"'$NEAR_ID'"}' --accountId $NEAR_ID
