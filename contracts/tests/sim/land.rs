use std::collections::HashMap;
use near_sdk::json_types::{U128};
use near_sdk_sim::{call, to_yocto, view};

use main::{Land, LandType};

use crate::utils::{claim_land, init};
use nft_land::JsonToken;

#[test]
fn mint_lands() {
    let (_, main_contract, _, land_contract, _, alice) = init();

    // Small Land - test owner
    let small_land = claim_land(&main_contract, &alice, LandType::Small);
    let medium_land = claim_land(&main_contract, &alice, LandType::Medium);
    let large_land = claim_land(&main_contract, &alice, LandType::Large);

    assert_eq!(small_land.last_zombie_claim, 0);
    assert_eq!(small_land.token_id.to_string().chars().nth(0).unwrap().to_string(), "s".to_string());
    assert_eq!(small_land.land_type, LandType::Small);
    assert_eq!(small_land.sale_price, None);
    assert_eq!(medium_land.land_type, LandType::Medium);
    assert!(large_land.token_id.to_string().len() > 5);

    // Check metadata
    let metadata_result: Vec<JsonToken> = view!(
        land_contract.nft_tokens_for_owner(alice.account_id(), Some(U128::from(0)), Some(5 as u64))
    ).unwrap_json();
    assert_eq!(metadata_result.len(), 3);
    assert_eq!(metadata_result[0].owner_id, alice.account_id());
    assert_eq!(metadata_result[0].metadata.title.as_ref().unwrap(), &"Small Land #1".to_string());

    // Check user lands count
    let user_lands: Vec<Land> = view!(
        main_contract.user_lands(alice.valid_account_id())
    ).unwrap_json();
    assert_eq!(3, user_lands.len());

    // Check total lands count
    let total_lands: HashMap<String, u32> = view!(
        main_contract.total_lands_count()
    ).unwrap_json();
    assert_eq!(&1, total_lands.get("Small").unwrap());
    assert_eq!(&1, total_lands.get("Medium").unwrap());
    assert_eq!(&1, total_lands.get("Large").unwrap());
}

#[test]
fn mint_second_small_land_error() {
    let (_, main_contract, _, _, _, alice) = init();

    claim_land(&main_contract, &alice, LandType::Small);

    // Claim second land - should return error
    let small_land_result_err = call!(
        alice,
        main_contract.mint_land_nft(),
        to_yocto("0.01"),
        near_sdk_sim::DEFAULT_GAS
    );
    assert!(!small_land_result_err.is_ok());
}

