// use std::fmt;
// use std::str::FromStr;
// use std::string::ParseError;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, BorshStorageKey, Balance, AccountId, Timestamp, setup_alloc};
use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::json_types::U128;

mod utils;

setup_alloc!();

type PerformerId = AccountId;

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
    pub owner_id: AccountId,
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
    pub total_proposals: u32,
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
    pub phone: String,
    pub media: Option<String>,
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
    pub created_at: Timestamp,
    pub votes: Vec<AccountId>,
}

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Performers,
    Facility,
    FacilityByRegion,
    FacilityInvestors,
    InvestorFacilities,
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
    investor_facilities: LookupMap<AccountId, Vec<TokenId>>,
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
            investor_facilities: LookupMap::new(StorageKeys::InvestorFacilities),
            facility_proposals: LookupMap::new(StorageKeys::FacilityProposals),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn add_facility(&mut self, id: String, title: String, region: u8, facility_type: u8, media: String, lat: String, lng: String, description: String) {
        // self.assert_contract_owner(self.owner_id.to_string());
        let account_id = env::predecessor_account_id();
        if env::attached_deposit() != Contract::convert_to_yocto("0.1") {
            panic!("Please attach o.1 NEAR to create new Facility")
        }
        if self.facility.contains_key(&id) {
            panic!("Facility ID already exists");
        }

        let facility = Facility {
            owner_id: account_id.to_string(),
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
            total_proposals: 0,
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

    pub fn get_facilities_by_id(&self, token_id_list: Vec<TokenId>) -> Vec<Facility> {
        token_id_list.iter().map(|token_id| self.facility.get(token_id).unwrap()).collect()
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
        let account_id = env::predecessor_account_id();

        let mut facility = self.facility.get(&token_id).unwrap();
        let investors = self.facility_investors.get(&token_id).unwrap_or(vec![]);
        facility.total_invested += deposit;

        let mut investor_exists = false;
        for item in &investors {
            if item.user_id == account_id.to_string() {
                investor_exists = true;
            }
        }
        if !investor_exists {
            facility.total_investors += 1;
        }

        self.facility.remove(&token_id);
        self.facility.insert(&token_id, &facility);

        let mut facility_investors = self.facility_investors.get(&token_id).unwrap_or(vec![]);
        facility_investors.push(FacilityInvestment {
            user_id: env::predecessor_account_id().to_string(),
            amount: deposit,
            timestamp: env::block_timestamp(),
        });
        self.facility_investors.insert(&token_id, &facility_investors);

        let mut investor_facilities = self.investor_facilities.get(&account_id).unwrap_or(vec![]);
        if !investor_facilities.contains(&token_id) {
            investor_facilities.push(token_id.to_string());
        }
        self.investor_facilities.insert(&account_id, &investor_facilities);
    }

    pub fn get_facility_investment(&self, token_id: TokenId) -> Vec<FacilityInvestment> {
        self.facility_investors.get(&token_id).unwrap_or(vec![])
    }

    pub fn get_facility_proposals(&self, token_id: TokenId) -> Vec<FacilityProposal> {
        self.facility_proposals.get(&token_id).unwrap_or(vec![])
    }

    pub fn get_user_info(&self, account_id: AccountId) -> (bool, Option<Performer>) {
        let is_manager = self.management_accounts.contains(&account_id);
        let performer = match self.performers.get(&account_id) {
            Some(performer) => Some(performer),
            None => None,
        };
        (is_manager, performer)
    }

    pub fn get_investor_facilities(&self, account_id: AccountId) -> Vec<Facility> {
        let id_list = self.investor_facilities.get(&account_id).unwrap_or(vec![]);
        id_list.iter().map(|token_id| self.facility.get(&token_id).unwrap()).collect()
    }

    // ------------ Performer ------------

    #[payable]
    pub fn create_performer_account(&mut self, name: String, phone: String, description: String) {
        assert!(name.len() > 2, "Please fill Company Name");
        assert!(phone.len() > 5, "Please fill Company Phone");
        assert!(description.len() > 9, "Please fill Description");
        assert_eq!(env::attached_deposit(), Contract::convert_to_yocto("0.1"), "Please attach 0.1 NEAR for registration");

        let account_id = env::predecessor_account_id();
        match self.performers.get(&account_id) {
            Some(_p) => panic!("You already register performer account"),
            None => (),
        };

        let performer = Performer {
            id: account_id.to_string(),
            name,
            phone,
            media: None,
            description,
            rating: 0,
            is_validated: false,
        };
        self.performers.insert(&account_id, &performer);
    }

    pub fn add_facility_proposal(&mut self, facility_id: TokenId, text: String, time: u32, budget: U128) {
        let account_id = env::predecessor_account_id();
        let mut proposals = self.facility_proposals.get(&facility_id).unwrap_or(vec![]);

        for item in &proposals {
            if item.performer_id == account_id.to_string() {
                panic!("You can add only one proposal for facility");
            }
        }

        proposals.push(FacilityProposal {
            performer_id: account_id.to_string(),
            estimate_amount: budget.0,
            estimate_time: time,
            text,
            created_at: env::block_timestamp(),
            votes: vec![],
        });
        self.facility_proposals.insert(&facility_id, &proposals);

        let mut facility = self.facility.get(&facility_id).unwrap();
        facility.total_proposals += 1;
        self.facility.remove(&facility_id);
        self.facility.insert(&facility_id, &facility);
    }
}
