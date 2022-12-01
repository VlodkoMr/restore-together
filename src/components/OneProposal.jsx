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
  totalUserInvestment,
  isCurrentPerformer
}) => {
  const currentUser = useSelector(state => state.user.account);
  const [companyDetailsVisible, setCompanyDetailsVisible] = useState(false);

  const addVote = async () => {
    await window.contract.vote_for_performer({
      performer_id: proposal.performer_id,
      facility_id: facility.token_id
    }, convertToTera("290"), 1);
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
    <div className={`shadow border border-gray-100 rounded-xl px-8 py-6 relative 
    ${isCurrentPerformer ? "" : "mb-3"} 
    ${proposal.performer_id === currentUser.id ? "bg-yellow-50" : "bg-gray-50"}`}>
      <div
        className="flex flex-row"
        key={proposal.performer_id}>
        {/*<div className="w-16 mr-5">*/}
        {/*  <img src={tmpLogo} alt="" width="w-full" className="rounded-full my-1" />*/}
        {/*</div>*/}
        <div className="w-full">
          <p className="text-md font-medium leading-5">
            <span className="mr-2">{allPerformers[proposal.performer_id].name}</span>

            {allPerformers[proposal.performer_id].is_validated ? (
              <small className="bg-green-100 text-green-500 px-2 py-0.5 rounded font-medium">Verified</small>
            ) : (
              <small className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">Not Verified</small>
            )}
          </p>

          <small className="text-gray-500 mt-2">
            Estimate: <b className="font-medium text-sm">{proposal.estimate_time} days</b>
            <span className="mx-2 text-xl align-sub opacity-50">/</span>
            Budget: <b className="font-medium text-sm">{convertFromYocto(proposal.estimate_amount, 1)} NEAR</b>
            {
              totalUserInvestment && (
                <>
                  <span className="mx-2 text-xl align-sub opacity-50">/</span>
                  Votes: <b>{investedVotesPct() || 0}%</b>
                </>
              )
            }
          </small>
        </div>

        <div className="w-48 text-right">
          {
            canVote() ? (
              <>
                {!userVotedPerformer ? (
                  <button onClick={() => addVote()}
                          className="text-sm mt-2 border-2 border-main text-main px-4 py-1 rounded-md font-medium bg-white hover:bg-blue-50 transition">
                    + VOTE
                  </button>
                ) : (
                  <>
                    {userVotedPerformer === proposal.performer_id && (
                      <div className="text-main font-medium mt-2">VOTED</div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <small className="text-gray-500">
                  {timestampToDate(proposal.created_at)}
                </small>
              </>
            )
          }
        </div>
      </div>

      <hr className="my-3 border-dashed"/>

      <div className="flex flex-row justify-between">
        <p className="mt-2 pr-10" style={{ whiteSpace: "pre-wrap" }}>
          {proposal.text}
        </p>
        <div className="relative">
          {!companyDetailsVisible && (
            <span onClick={() => setCompanyDetailsVisible(true)}
                  className="text-mainLight w-40 text-right text-sm underline cursor-pointer absolute bottom-0 right-0">
              read more
            </span>
          )}
        </div>
      </div>

      <div className={`mt-1 text-sm text-gray-500 ${companyDetailsVisible ? "" : "hidden"}`}>
        About the Company: {allPerformers[proposal.performer_id].description}
      </div>

    </div>

  );
};
