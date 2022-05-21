use std::collections::HashMap;
use near_sdk::json_types::{U128};
use near_sdk_sim::{call, to_yocto, view};

use main::{LandType, Zombie};

use crate::utils::{claim_land, claim_zombies, init};
use nft_zombie::JsonToken;

#[test]
fn mint_zombies() {
    let (_, main_contract, _, _, zombie_contract, alice) = init();
    let land = claim_land(&main_contract, &alice, LandType::Small);

    // Check zombie claim time
    let zombie_claim_time: HashMap<String, u64> = view!(
        main_contract.zombie_claim_time(
            alice.valid_account_id(),
            1000000000000000000.into()
        )
    ).unwrap_json();
    assert_eq!(&0, zombie_claim_time.get(&land.token_id).unwrap());

    // Claim zombies
    let zombies = claim_zombies(&main_contract, &alice, land.token_id.to_string(), land.land_type);
    assert_eq!(1, zombies.len());

    // Check metadata
    let metadata_result: Vec<JsonToken> = view!(
        zombie_contract.nft_tokens_for_owner(alice.account_id(), Some(U128::from(0)), Some(5 as u64))
    ).unwrap_json();
    assert_eq!(metadata_result.len(), 1);
    assert_eq!(metadata_result[0].owner_id, alice.account_id());
    assert_eq!(metadata_result[0].metadata.title.as_ref().unwrap(), &"Zombie #1".to_string());

    // Check total zombies count
    let total_zombie_count: u32 = view!(
        main_contract.minted_zombies_count()
    ).unwrap_json();
    assert_eq!(1, total_zombie_count);

    // Check zombie claim time after mint
    let zombie_claim_time: HashMap<String, u64> = view!(
        main_contract.zombie_claim_time(
            alice.valid_account_id(),
            1000000000000000000.into()
        )
    ).unwrap_json();
    assert_ne!(&0, zombie_claim_time.get(&land.token_id).unwrap());
}

#[test]
fn mint_second_zombie_error() {
    let (_, main_contract, _, _, _, alice) = init();
    let land = claim_land(&main_contract, &alice, LandType::Small);

    // First Claim
    claim_zombies(&main_contract, &alice, land.token_id.to_string(), land.land_type);

    // Second claim - expect error
    let zombie_claim_result = call!(
        alice,
        main_contract.mint_free_zombie_nft(land.token_id.to_string()),
        deposit = to_yocto("0.01")
    );
    assert!(!zombie_claim_result.is_ok());
}

#[test]
fn user_kill_zombie() {
    let (_, main_contract, ft_contract, _, _, alice) = init();
    let land = claim_land(&main_contract, &alice, LandType::Large);

    // Mint zombies on large land (8 zombies)
    claim_zombies(&main_contract, &alice, land.token_id.to_string(), land.land_type);

    let (total_count, user_zombies): (String, Vec<Zombie>) = view!(
        main_contract.user_zombies(alice.account_id(), 1.into(), 40.into(), None, None)
    ).unwrap_json();
    assert_eq!(total_count, 8.to_string());
    assert_eq!(user_zombies.len(), 8);

    // Kill zombie
    let kill_tokens_result: String = call!(
        alice,
        main_contract.zombie_kill(user_zombies[0].token_id.to_string()),
        deposit=1
    ).unwrap_json();

    // Check user zombies count
    let (total_count, user_zombies): (String, Vec<Zombie>) = view!(
        main_contract.user_zombies(alice.account_id(), 1.into(), 40.into(), None, None)
    ).unwrap_json();
    assert_eq!(total_count, 7.to_string());
    assert_eq!(user_zombies.len(), 7);

    // Check ft token balance
    let user_balance: String = view!(
        ft_contract.ft_balance_of(alice.valid_account_id())
    ).unwrap_json();
    assert_eq!(kill_tokens_result, user_balance);

    // Check Killed zombie count
    let killed_total_count: u32 = view!(
        main_contract.killed_zombies_count()
    ).unwrap_json();
    assert_eq!(1, killed_total_count);
}
