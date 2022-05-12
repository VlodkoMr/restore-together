// use std::fmt;
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
    // owner_id: AccountId,
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
            // owner_id: env::predecessor_account_id(),
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
        // self.assert_contract_owner(self.owner_id.to_string());
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

    #[payable]
    pub fn add_investment(&mut self, token_id: TokenId) {
        let deposit = env::attached_deposit();
        let mut facility = self.facility.get(&token_id).unwrap();
        facility.total_invested += deposit;
        self.facility.remove(&token_id);
        self.facility.insert(&token_id, &facility);

        let mut facility_investors = self.facility_investors.get(&token_id).unwrap_or(vec![]);
        facility_investors.push(FacilityInvestment {
            user_id: env::predecessor_account_id().to_string(),
            amount: deposit,
            timestamp: env::block_timestamp(),
        });
        self.facility_investors.insert(&token_id, &facility_investors);
    }

    pub fn get_facility_investment(&self, token_id: TokenId) -> Vec<FacilityInvestment> {
        self.facility_investors.get(&token_id).unwrap_or(vec![])
    }
}
