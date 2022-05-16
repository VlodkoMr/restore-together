import tmpLogo from '../assets/images/tmp.jpg';
import React from 'react';
import { convertFromYocto, timestampToDate } from '../near/utils';

export const OneProposal = ({ proposal }) => {

  return (
    <div
      className="flex flex-row shadow border border-gray-100 rounded-lg px-8 py-6 relative mb-3"
      key={proposal.performer_id}>
      {/*<div className="w-16 mr-5">*/}
      {/*  <img src={tmpLogo} alt="" width="w-full" className="rounded-full my-1" />*/}
      {/*</div>*/}
      <div className="w-full">
        <p className="text-lg font-medium leading-4">{proposal.performer_id}</p>
        <small className="text-gray-500">
          Time: {proposal.estimate_time} days
          <span className="mx-1.5">·</span>
          Budget: {convertFromYocto(proposal.estimate_amount, 1)} NEAR
          {/*<span className="mx-1.5">·</span>*/}
          {/*Votes: 10%*/}
        </small>
        <p className="mt-2">
          {proposal.text}
        </p>
      </div>
      <div className="w-48 text-right">
        <small className="text-gray-500">
          {timestampToDate(proposal.created_at)}
        </small>
        <div className="text-red-600 font-medium mt-2">VOTED</div>
        {/*<button className="text-sm mt-2 border-2 border-red-500 text-red-600 px-4 py-1 rounded-md font-medium hover:bg-red-50 transition">*/}
        {/*  ADD VOTE*/}
        {/*</button>*/}
      </div>
    </div>
  );
};
