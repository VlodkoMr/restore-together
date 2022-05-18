import React, { useState } from 'react';
import { convertFromYocto, convertToTera, timestampToDate } from '../near/utils';
import { useSelector } from 'react-redux';
import verified_icon from '../assets/images/verify.png';
import pending_icon from '../assets/images/pending.png';

export const OneProposal = ({
  facility,
  proposal,
  canVote,
  allPerformers,
  userVotedPerformer,
  totalUserInvestment
}) => {
  const currentUser = useSelector(state => state.user.account);
  const [companyDetailsVisible, setCompanyDetailsVisible] = useState(false);

  const addVote = async () => {
    await window.contract.vote_for_performer({
      performer_id: proposal.performer_id,
      facility_id: facility.token_id
    }, convertToTera("100"), 1);
  }

  const investedVotesPct = () => {
    let total = 0;
    proposal.votes.map(user => {
      if (totalUserInvestment[user]) {
        total += parseFloat(convertFromYocto(totalUserInvestment[user], 2));
      }
    });
    return parseInt(total / parseFloat(convertFromYocto(facility.total_invested)) * 100);
  }

  return (
    <div className="shadow border border-gray-100 rounded-lg px-8 py-6 relative mb-3">
      <div
        className="flex flex-row"
        key={proposal.performer_id}>
        {/*<div className="w-16 mr-5">*/}
        {/*  <img src={tmpLogo} alt="" width="w-full" className="rounded-full my-1" />*/}
        {/*</div>*/}
        <div className="w-full">
          <p className="text-lg font-medium leading-5">
            <span className="mr-4">{allPerformers[proposal.performer_id].name}</span>
          </p>
          <small className="text-gray-500 mt-2">
            Estimate Time: <b>{proposal.estimate_time} days</b>
            <span className="mx-1.5">·</span>
            Budget: <b>{convertFromYocto(proposal.estimate_amount, 1)} NEAR</b>
            {
              totalUserInvestment && (
                <>
                  <span className="mx-1.5">·</span>
                  Votes: {investedVotesPct()}%
                </>
              )
            }
          </small>
          <p className="mt-2" style={{ whiteSpace: "pre-wrap" }}>
            {proposal.text}
          </p>
        </div>
        <div className="w-48 text-right">
          <small className="text-gray-500">
            {timestampToDate(proposal.created_at)}
          </small>

          {
            canVote() && (
              <>
                {!userVotedPerformer ? (
                  <button onClick={() => addVote()}
                          className="text-sm mt-3 border-2 border-red-500 text-red-600 px-4 py-1 rounded-md font-medium hover:bg-red-50 transition">
                    + VOTE
                  </button>
                ) : (
                  <>
                    {userVotedPerformer === proposal.performer_id && (
                      <div className="text-red-600 font-medium mt-2">VOTED</div>
                    )}
                  </>

                )}
              </>
            )
          }
        </div>
      </div>

      <hr className="my-3 " />

      <div className="text-sm flex flex-row justify-between">
        <div className="">
          <span className="mr-2">Company Status:</span>
          {allPerformers[proposal.performer_id].is_validated ? (
            <>
              <img src={verified_icon} alt="verified" title="verified" className="inline w-5 mr-1" />
              <span>Verified</span>
            </>
          ) : (
            <>
              <img src={pending_icon} alt="pending" title="pending" className="inline w-5 mr-1" />
              <span className="text-gray-500">Not Verified</span>
            </>
          )}
        </div>
        <div>
          {!companyDetailsVisible && (
            <span onClick={() => setCompanyDetailsVisible(true)}
                  className="text-red-500 underline cursor-pointer">
              read more
            </span>
          )}
        </div>
      </div>

      <div className={`mt-1 text-sm text-gray-500 ${companyDetailsVisible ? "" : "hidden"}`}>
        {allPerformers[proposal.performer_id].description}
      </div>

    </div>

  );
};
