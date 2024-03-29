use crate::*;

impl Contract {
    // Generate random u8 number (0-254)
    pub(crate) fn random_u8(&self, index: usize) -> u8 {
        *env::random_seed().get(index).unwrap()
    }

    // Get random number from 0 to max
    pub(crate) fn random_in_range(&self, index: usize, max: usize) -> u32 {
        if max > 0 {
            let rand_divider = 256 as f64 / (max + 1) as f64;
            let result = self.random_u8(index) as f64 / rand_divider;
            return result as u32;
        }
        0 as u32
    }

    // Convert f64 to yocto NEAR Balance
    pub(crate) fn convert_to_yocto(value: &str) -> Balance {
        let values: Vec<_> = value.split('.').collect();
        let part1 = values[0].parse::<u128>().unwrap() * 10u128.pow(24);
        if values.len() > 1 {
            let power = values[1].len() as u32;
            let part2 = values[1].parse::<u128>().unwrap() * 10u128.pow(24 - power);
            part1 + part2
        } else {
            part1
        }
    }

    // Convert u64 to yocto NEAR Gas
    pub(crate) fn to_tera(&self, tokens: u64) -> Gas {
        (tokens * 10u128.pow(12) as u64).into()
    }

    // Check contract owner
    // pub(crate) fn assert_contract_owner(&self, owner_id: AccountId) {
    // if env::predecessor_account_id() != owner_id {
    //     panic!("You can't call this method!");
    // }
    // }

    // Check contract manager
    // pub(crate) fn assert_contract_manager(&self) {
    //     if !self.management_accounts.contains(&env::predecessor_account_id()) {
    //         panic!("You can't call this method!");
    //     }
    // }
}
