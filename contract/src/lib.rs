/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, BorshStorageKey, Balance, AccountId, Timestamp, setup_alloc};
use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::collections::{LookupMap, LookupSet, UnorderedMap};

setup_alloc!();

type PerformerId = u32;

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Facility {
    pub token_id: TokenId,
    pub title: String,
    pub description: String,
    pub media: String,
    pub region: u8,
    pub facility_type: u8,
    pub status: u8,
    pub lat: String,
    pub lng: String,
    pub total_invested: Balance,
    pub total_investors: u32,
    pub is_validated: bool,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct FacilityInvestment {
    pub user_id: AccountId,
    pub amount: Balance,
    pub timestamp: Timestamp,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Performer {
    pub id: PerformerId,
    pub name: String,
    pub media: String,
    pub description: String,
    pub rating: u8, // 1 - 10
    pub is_validated: bool,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct FacilityProposal {
    pub performer_id: PerformerId,
    pub estimate_amount: Balance,
    pub estimate_time: u32,
    pub text: String,
    pub votes: UnorderedMap<AccountId, PerformerId>,
}


#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Performers,
    Facility,
    FacilityByRegion,
    FacilityInvestors,
    FacilityProposals,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct RestoreTogether {
    owner_id: AccountId,
    management_accounts: Vec<AccountId>,
    performers: UnorderedMap<PerformerId, Performer>,
    facility: LookupMap<TokenId, Facility>,
    facility_by_region: LookupMap<u8, TokenId>,
    facility_investors: LookupMap<TokenId, Vec<FacilityInvestment>>,
    facility_proposals: LookupMap<TokenId, Vec<FacilityProposal>>,
}

impl Default for RestoreTogether {
    fn default() -> Self {
        Self {
            owner_id: env::predecessor_account_id(),
            management_accounts: vec![],
            performers: UnorderedMap::new(StorageKeys::Performers),
            facility: LookupMap::new(StorageKeys::Facility),
            facility_by_region: LookupMap::new(StorageKeys::FacilityByRegion),
            facility_investors: LookupMap::new(StorageKeys::FacilityInvestors),
            facility_proposals: LookupMap::new(StorageKeys::FacilityProposals),
        }
    }
}

#[near_bindgen]
impl RestoreTogether {}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    // fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
    //     VMContext {
    //         current_account_id: "alice_near".to_string(),
    //         signer_account_id: "bob_near".to_string(),
    //         signer_account_pk: vec![0, 1, 2],
    //         predecessor_account_id: "carol_near".to_string(),
    //         input,
    //         block_index: 0,
    //         block_timestamp: 0,
    //         account_balance: 0,
    //         account_locked_balance: 0,
    //         storage_usage: 0,
    //         attached_deposit: 0,
    //         prepaid_gas: 10u64.pow(18),
    //         random_seed: vec![0, 1, 2],
    //         is_view,
    //         output_data_receivers: vec![],
    //         epoch_height: 19,
    //     }
    // }
    //
    // #[test]
    // fn set_then_get_greeting() {
    //     let context = get_context(vec![], false);
    //     testing_env!(context);
    //     let mut contract = Welcome::default();
    //     contract.set_greeting("howdy".to_string());
    //     assert_eq!(
    //         "howdy".to_string(),
    //         contract.get_greeting("bob_near".to_string())
    //     );
    // }
    //
    // #[test]
    // fn get_default_greeting() {
    //     let context = get_context(vec![], true);
    //     testing_env!(context);
    //     let contract = Welcome::default();
    //     // this test did not call set_greeting so should return the default "Hello" greeting
    //     assert_eq!(
    //         "Hello".to_string(),
    //         contract.get_greeting("francis.near".to_string())
    //     );
    // }
}
