use crate::*;

impl Contract {
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
