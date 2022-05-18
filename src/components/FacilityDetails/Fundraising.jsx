import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { OneProposal } from '../OneProposal';
import { MyProposalForm } from '../MyProposalForm';
import { Link } from '../../assets/styles/common.style';
import { convertFromYocto } from '../../near/utils';
import Big from 'big.js';

export const FacilityDetailsFundraising = ({ facility, facilityProposals, facilityInvestments, allPerformers }) => {
  const currentUser = useSelector(state => state.user.account);
  const [userVotedPerformer, setUserVotedPerformer] = useState(null);
  const [totalUserInvestment, setTotalUserInvestment] = useState({});

  useEffect(() => {
    let totalInvestments = {};
    facilityInvestments.map(investment => {
      if (!totalInvestments[investment.user_id]) {
        totalInvestments[investment.user_id] = new Big(0);
      }
      totalInvestments[investment.user_id] = totalInvestments[investment.user_id].plus(investment.amount);
    });
    setTotalUserInvestment(totalInvestments);

    facilityProposals.map(proposal => {
      if (proposal.votes.indexOf(currentUser.id) !== -1) {
        setUserVotedPerformer(proposal.performer_id);
      }
    });
  }, []);

  const canVote = () => {
    if (!currentUser.id) {
      return false;
    }
    return facilityInvestments.filter(item => item.user_id === currentUser.id).length > 0;
  }

  const canAddProposal = () => {
    if (!currentUser.id) {
      return false;
    }
    return facilityProposals.filter(item => item.performer_id === currentUser.id).length === 0;
  }

  return (
    <>
      <h3 className="text-xl font-medium mb-2">Proposals</h3>
      {
        facilityProposals.length > 0 ? facilityProposals.map(proposal => (
          <OneProposal proposal={proposal}
                       canVote={canVote}
                       facility={facility}
                       totalUserInvestment={totalUserInvestment}
                       userVotedPerformer={userVotedPerformer}
                       allPerformers={allPerformers}
                       key={proposal.performer_id}
          />
        )) : (
          <div className="text-gray-500 text-sm">
            *No Proposals
          </div>
        )
      }

      {
        canAddProposal() && (
          <>
            <h3 className="font-medium mb-2 mt-10">Add your proposal:</h3>
            {
              currentUser.performer ? (
                <MyProposalForm facility_id={facility.token_id} key={facility.token_id} />
              ) : (
                <>
                  <p className="text-gray-500 pb-10">To add new proposal, please register{" "}
                    <Link to="/my" className="underline">Performer Account</Link>.</p>
                </>
              )
            }
          </>
        )
      }

    </>
  );
};
