use crate::*;

impl Contract {
    pub(crate) fn linear_claim_amount(&self, facility_id: &TokenId) -> u128 {
        let facility = self.facility.get(facility_id).unwrap();
        let claimed = self.performer_facility_claimed.get(facility_id).unwrap_or(0);

        let mut active_proposal = None;
        let proposals = self.facility_proposals.get(facility_id).unwrap_or(vec![]);
        for proposal in &proposals {
            if &proposal.performer_id == facility.performer.as_ref().unwrap() {
                active_proposal = Some(proposal);
            }
        }

        if active_proposal.is_some() {
            let start_execution = u64::from(facility.start_execution.unwrap());
            let claim_time_seconds = u64::from(active_proposal.unwrap().estimate_time) * 60 * 60 * 24;

            let linear_unlock_amount = facility.total_invested / 2;
            let one_sec_reward = linear_unlock_amount / u128::from(claim_time_seconds);
            let seconds_from_start = u128::from((env::block_timestamp() - start_execution) / 1_000_000_000);
            let unlocked = seconds_from_start * one_sec_reward;

            return linear_unlock_amount + unlocked - claimed;
        } else {
            panic!("Proposal Not found");
        }
    }

    pub(crate) fn is_facility_investor(&self, facility_id: &TokenId, user_id: &AccountId) -> bool {
        let investors = self.facility_investors.get(facility_id).unwrap_or(vec![]);

        let mut investor_exists = false;
        for item in &investors {
            if &item.user_id == user_id {
                investor_exists = true;
            }
        }
        investor_exists
    }
}
