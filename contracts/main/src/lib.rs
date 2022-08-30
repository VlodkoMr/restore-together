use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, BorshStorageKey, Balance, AccountId, Timestamp, Promise, log, Gas, serde_json::json, setup_alloc, assert_one_yocto};
use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::json_types::{U128};
use std::collections::HashMap;
use near_sdk::serde_json::Value as JsonValue;

mod utils;
mod internal;

setup_alloc!();

// #[ext_contract(ext_self)]
// pub trait ExtSelf {
//     fn callback_near_wrapped(
//         performer_id: String,
//         memo_title: String,
//         votes_total_invest: Balance,
//         estimate_time: u32,
//     );
// }

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
    pub start_execution: Option<Timestamp>,
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
pub struct FacilityExecutionProgress {
    pub performer_id: PerformerId,
    pub media: String,
    pub description: String,
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
    PerformerFacilityClaimed,
    FacilityByRegion,
    FacilityInvestors,
    InvestorFacilities,
    InvestorNft,
    FacilityProposals,
    FacilityExecutionProgress,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    // pub owner_id: AccountId,
    management_accounts: Vec<AccountId>,
    contract_nft: AccountId,

    performers: UnorderedMap<PerformerId, Performer>,
    performer_facilities: LookupMap<PerformerId, Vec<TokenId>>,
    performer_facility_claimed: LookupMap<TokenId, Balance>,

    facility_count: u32,
    facility: LookupMap<TokenId, Facility>,
    facility_by_region: LookupMap<u8, Vec<TokenId>>,
    facility_investors: LookupMap<TokenId, Vec<FacilityInvestment>>,
    facility_proposals: LookupMap<TokenId, Vec<FacilityProposal>>,
    facility_execution_progress: LookupMap<TokenId, Vec<FacilityExecutionProgress>>,
    investor_facilities: LookupMap<AccountId, Vec<TokenId>>,

    investor_nft_count: u32,
    investor_nft: LookupMap<AccountId, Vec<TokenId>>,

}

impl Default for Contract {
    fn default() -> Self {
        Self {
            // owner_id: env::predecessor_account_id(),
            management_accounts: vec![],
            contract_nft: format!("nft.{}", env::current_account_id()),

            performers: UnorderedMap::new(StorageKeys::Performers),
            performer_facilities: LookupMap::new(StorageKeys::Performers),
            performer_facility_claimed: LookupMap::new(StorageKeys::PerformerFacilityClaimed),

            facility_count: 0,
            facility: LookupMap::new(StorageKeys::Facility),
            facility_by_region: LookupMap::new(StorageKeys::FacilityByRegion),
            facility_investors: LookupMap::new(StorageKeys::FacilityInvestors),
            facility_proposals: LookupMap::new(StorageKeys::FacilityProposals),
            facility_execution_progress: LookupMap::new(StorageKeys::FacilityExecutionProgress),
            investor_facilities: LookupMap::new(StorageKeys::InvestorFacilities),

            investor_nft_count: 0,
            investor_nft: LookupMap::new(StorageKeys::InvestorNft),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn add_facility(&mut self, id: String, title: String, region: u8, facility_type: u8, media: String, lat: String, lng: String, description: String) {
        assert_eq!(env::attached_deposit(), Contract::convert_to_yocto("0.1"), "Requires attached deposit of exactly 0.1 NEAR");

        // self.assert_contract_owner(self.owner_id.to_string());
        let account_id = env::predecessor_account_id();
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
            start_execution: None,
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
        facility.total_invested += deposit;

        let investor_exists = self.is_facility_investor(&token_id, &account_id);
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

        // If user already voted, check proposal & update facility status
        let proposals = self.facility_proposals.get(&token_id).unwrap_or(vec![]);

        let mut user_voted_performer = None;
        for proposal in &proposals {
            if proposal.votes.contains(&account_id) {
                user_voted_performer = Some(proposal.performer_id.to_string());
            }
        }
        if user_voted_performer.is_some() {
            self.check_facility_status_by_voting(facility, user_voted_performer.unwrap());
        }
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
        assert_eq!(env::attached_deposit(), Contract::convert_to_yocto("0.25"), "Please attach 0.25 NEAR for registration");

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

    #[payable]
    pub fn add_facility_proposal(&mut self, facility_id: TokenId, text: String, time: u32, budget: U128) {
        assert_one_yocto();
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

    pub fn get_all_performers(&self) -> HashMap<PerformerId, Performer> {
        self.performers.iter().collect()
    }

    // Change facility status if much requirements: enough budget and 51% votes by invested amount
    fn check_facility_status_by_voting(&mut self, mut facility: Facility, performer_id: PerformerId) {
        let proposals = self.facility_proposals.get(&facility.token_id).unwrap_or(vec![]);
        let facility_investors = self.facility_investors.get(&facility.token_id).unwrap_or(vec![]);

        // check status
        for proposal in &proposals {
            // Need to cover estimated budget
            if proposal.estimate_amount <= facility.total_invested {
                let mut votes_total_invest = 0;
                for user_id in &proposal.votes {
                    for investor in &facility_investors {
                        if investor.user_id == user_id.to_string() {
                            votes_total_invest += investor.amount;
                        }
                    }
                }

                // Need 51% votes
                if votes_total_invest >= (facility.total_invested * 51) / 100 {
                    self.facility.remove(&facility.token_id);

                    facility.status = FacilityStatus::InProgress;
                    facility.performer = Some(performer_id.to_string());
                    self.facility.insert(&facility.token_id, &facility);

                    // add facility to performer list
                    let mut performer_facilities = self.performer_facilities.get(&performer_id).unwrap_or(vec![]);
                    performer_facilities.push(facility.token_id.to_string());
                    self.performer_facilities.insert(&performer_id, &performer_facilities);

                    // log!("votes_total_invest = {}", votes_total_invest.to_string());
                    //
                    // // wrap NEAR tokens and create stream
                    // pub const XCC_GAS: Gas = 30_000_000_000_000;
                    // Promise::new("wrap.testnet".to_string()).function_call(
                    //     b"near_deposit".to_vec(),
                    //     json!({}).to_string().as_bytes().to_vec(),
                    //     votes_total_invest,
                    //     XCC_GAS,
                    // ).then(
                    //     ext_self::callback_near_wrapped(
                    //         performer_id.to_string(),
                    //         facility.title.to_string(),
                    //         votes_total_invest,
                    //         proposal.estimate_time,
                    //         &env::current_account_id(),
                    //         0,
                    //         XCC_GAS * 2,
                    //     )
                    // );
                }
            }
        }
    }

    // #[private]
    // pub fn callback_near_wrapped(
    //     &mut self,
    //     performer_id: String, memo_title: String, votes_total_invest: Balance, estimate_time: u32,
    // ) {
    //     let msg = json!({
    //         "Create":  json!({
    //             "request": json!({
    //                 "owner_id": env::current_account_id(),
    //                 "receiver_id": performer_id.to_string(),
    //                 "tokens_per_sec": "100000000000000000000",
    //             })
    //         }),
    //     });
    //
    //     pub const XCC_GAS: Gas = 30_000_000_000_000;
    //     Promise::new("wrap.testnet".to_string()).function_call(
    //         b"ft_transfer_call".to_vec(),
    //         json!({
    //             "amount": votes_total_invest.to_string(),
    //             "receiver_id": "streaming-r-v2.dcversus.testnet".to_string(),
    //             "memo": memo_title.to_string(),
    //             "msg": msg.to_string(),
    //         }).to_string().as_bytes().to_vec(),
    //         1,
    //         XCC_GAS,
    //     );
    // }

    #[payable]
    pub fn vote_for_performer(&mut self, performer_id: PerformerId, facility_id: TokenId) {
        assert_one_yocto();
        let user_id = env::predecessor_account_id();
        let facility = self.facility.get(&facility_id).unwrap();
        if facility.status != FacilityStatus::Fundraising {
            panic!("Voting period ends.");
        }

        // Check if user is investor
        let is_investor = self.is_facility_investor(&facility_id, &user_id);
        if !is_investor {
            panic!("You can't vote, no investments.");
        }

        // Check if user already vote
        let proposals = self.facility_proposals.get(&facility_id).unwrap_or(vec![]);
        let proposals = proposals.into_iter().map(|mut proposal| {
            if proposal.votes.contains(&user_id) {
                panic!("Sorry, you already voted.");
            }
            // Add user vote
            if proposal.performer_id == performer_id {
                proposal.votes.push(user_id.to_string());
            }
            proposal
        }).collect();
        self.facility_proposals.insert(&facility_id, &proposals);

        self.check_facility_status_by_voting(facility, performer_id);
    }

    pub fn get_performer_facilities(&self, account_id: PerformerId) -> Vec<Facility> {
        let performer_facilities = self.performer_facilities.get(&account_id).unwrap_or(vec![]);
        performer_facilities.iter().map(|token_id| self.facility.get(&token_id).unwrap()).collect()
    }

    #[payable]
    pub fn add_execution_progress(&mut self, media: String, description: String, facility_id: TokenId) {
        let performer = env::predecessor_account_id();
        let facility = self.facility.get(&facility_id).unwrap();
        if facility.performer.unwrap() != performer {
            panic!("You don't have permission for this facility");
        }
        let mut progress = self.facility_execution_progress.get(&facility_id).unwrap_or(vec![]);
        let new_progress = FacilityExecutionProgress {
            performer_id: performer.to_string(),
            media,
            description,
            timestamp: env::block_timestamp(),
        };
        progress.push(new_progress);
        self.facility_execution_progress.insert(&facility_id, &progress);
    }

    pub fn get_execution_progress(&self, facility_id: TokenId) -> Vec<FacilityExecutionProgress> {
        self.facility_execution_progress.get(&facility_id).unwrap_or(vec![])
    }

    pub fn get_available_tokens_amount(&self, facility_id: TokenId) -> (Balance, Balance) {
        let facility = self.facility.get(&facility_id).unwrap();
        let claimed = self.performer_facility_claimed.get(&facility_id).unwrap_or(0);
        if claimed == 0 {
            return (0, facility.total_invested / 2);
        }
        (claimed, self.linear_claim_amount(&facility_id))
    }

    pub fn performer_claim_tokens(&mut self, facility_id: TokenId) {
        let mut facility = self.facility.get(&facility_id).unwrap();
        if facility.performer != Some(env::predecessor_account_id()) {
            panic!("You don't have access to Claim");
        }

        let claimed = self.performer_facility_claimed.get(&facility_id).unwrap_or(0);
        let can_claim;
        if claimed == 0 {
            can_claim = facility.total_invested / 2;

            // Start linear unlock
            self.facility.remove(&facility_id);
            facility.start_execution = Some(env::block_timestamp());
            self.facility.insert(&facility_id, &facility);
        } else {
            can_claim = self.linear_claim_amount(&facility_id);
        }

        if can_claim > 0 {
            self.performer_facility_claimed.insert(&facility_id, &(claimed + can_claim));
            Promise::new(env::predecessor_account_id()).transfer(can_claim);
        } else {
            panic!("No tokens to Claim");
        }
    }

    pub fn performer_set_completed(&mut self, facility_id: TokenId) {
        let mut facility = self.facility.get(&facility_id).unwrap();
        if facility.performer != Some(env::predecessor_account_id()) {
            panic!("You don't have access to this Facility");
        }

        self.facility.remove(&facility_id);
        facility.status = FacilityStatus::Completed;
        self.facility.insert(&facility_id, &facility);
    }

    pub fn is_investor_nft_minted(&self, facility_id: TokenId, account_id: AccountId) -> bool {
        let investor_nft_list = self.investor_nft.get(&account_id).unwrap_or(vec![]);
        investor_nft_list.contains(&facility_id)
    }

    #[payable]
    pub fn mint_investor_nft(&mut self, facility_id: TokenId, media_url: String) -> JsonValue {
        let facility = self.facility.get(&facility_id).unwrap();
        let user_id = env::predecessor_account_id();

        // Check investor
        let is_investor = self.is_facility_investor(&facility_id, &user_id);
        if !is_investor {
            panic!("You can't mint NFT.");
        }

        let mut investor_nft_list = self.investor_nft.get(&user_id).unwrap_or(vec![]);
        if investor_nft_list.contains(&facility_id) {
            panic!("You already mint NFT for this facility");
        }

        investor_nft_list.push(facility_id.to_string());
        self.investor_nft.insert(&user_id, &investor_nft_list);
        self.investor_nft_count += 1;

        // Create new NFT
        let metadata: JsonValue = json!({
            "token_id": self.investor_nft_count.to_string(),
            "receiver_id": user_id.to_string(),
            "token_metadata": {
                "title": facility.title,
                "media": media_url.to_string(),
                "copies": 1
            }
        });

        let mint_gas: Gas = self.to_tera(80);
        Promise::new(self.contract_nft.to_string()).function_call(
            b"nft_mint".to_vec(),
            metadata.to_string().as_bytes().to_vec(),
            env::attached_deposit(),
            mint_gas,
        );

        metadata
    }
}
