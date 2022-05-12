use std::fmt;
// use std::str::FromStr;
// use std::string::ParseError;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, BorshStorageKey, Balance, AccountId, Timestamp, setup_alloc};
use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::serde::{Deserialize, Serialize};

mod utils;

setup_alloc!();

type PerformerId = u32;

#[derive(Debug, PartialEq, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub enum FacilityStatus {
    Fundraising,
    InProgress,
    Completed,
    Issue,
}
//
// impl fmt::Display for FacilityStatus {
//     fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
//         match self {
//             FacilityStatus::Fundraising => write!(f, "1"),
//             FacilityStatus::InProgress => write!(f, "2"),
//             FacilityStatus::Completed => write!(f, "3"),
//             FacilityStatus::Issue => write!(f, "4"),
//         }
//     }
// }
//
// impl FromStr for FacilityStatus {
//     type Err = ParseError;
//
//     fn from_str(s: &str) -> Result<Self, Self::Err> {
//         Ok(match s {
//             "1" => FacilityStatus::Fundraising,
//             "2" => FacilityStatus::InProgress,
//             "3" => FacilityStatus::Completed,
//             "4" => FacilityStatus::Issue,
//             _ => panic!("Wrong metadata")
//         })
//     }
// }

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Facility {
    pub token_id: TokenId,
    pub title: String,
    pub description: String,
    pub media: String,
    pub region: u8,
    pub facility_type: u8,
    pub lat: String,
    pub lng: String,
    pub status: FacilityStatus,
    pub total_invested: Balance,
    pub total_investors: u32,
    pub is_validated: bool,
    pub performer: Option<PerformerId>,
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
    pub rating: u8,
    pub is_validated: bool,
}

#[derive(Debug, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct FacilityProposal {
    pub performer_id: PerformerId,
    pub estimate_amount: Balance,
    pub estimate_time: u32,
    pub text: String,
    pub votes: Vec<AccountId>,
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
pub struct Contract {
    owner_id: AccountId,
    management_accounts: Vec<AccountId>,
    performers: UnorderedMap<PerformerId, Performer>,

    facility: LookupMap<TokenId, Facility>,
    facility_count: u32,
    facility_by_region: LookupMap<u8, Vec<TokenId>>,
    facility_investors: LookupMap<TokenId, Vec<FacilityInvestment>>,
    facility_proposals: LookupMap<TokenId, Vec<FacilityProposal>>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            owner_id: env::predecessor_account_id(),
            management_accounts: vec![],
            performers: UnorderedMap::new(StorageKeys::Performers),
            facility_count: 0,
            facility: LookupMap::new(StorageKeys::Facility),
            facility_by_region: LookupMap::new(StorageKeys::FacilityByRegion),
            facility_investors: LookupMap::new(StorageKeys::FacilityInvestors),
            facility_proposals: LookupMap::new(StorageKeys::FacilityProposals),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn add_facility(&mut self, id: String, title: String, region: u8, facility_type: u8, media: String, lat: String, lng: String, description: String) {
        self.assert_contract_owner(self.owner_id.to_string());
        if env::attached_deposit() != Contract::convert_to_yocto("0.1") {
            panic!("Please attach o.1 NEAR to create new Facility")
        }
        if self.facility.contains_key(&id) {
            panic!("Facility ID already exists");
        }

        let facility = Facility {
            token_id: id.to_string(),
            title,
            description,
            media,
            region,
            facility_type,
            lat,
            lng,
            status: FacilityStatus::Fundraising,
            total_invested: 0,
            total_investors: 0,
            is_validated: false,
            performer: None,
        };
        self.facility.insert(&id, &facility);
        self.facility_count += 1;

        let mut region_facilities = self.facility_by_region.get(&region).unwrap_or(vec![]);
        region_facilities.push(id.to_string());
        self.facility_by_region.insert(&region, &region_facilities);
    }

    pub fn get_facility_by_id(&self, token_id: TokenId) -> Facility {
        self.facility.get(&token_id).unwrap()
    }

    pub fn get_region_facility(&self, region: u8) -> Vec<Facility> {
        let region_facilities = self.facility_by_region.get(&region).unwrap_or(vec![]);
        region_facilities.into_iter()
            .flat_map(|token_id| self.facility.get(&token_id))
            .collect()
    }
}

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
