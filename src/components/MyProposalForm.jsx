import React, { useState } from "react";
import { Button } from './basic/Button';
import { convertToTera, convertToYocto } from '../near/utils';

export const MyProposalForm = ({ facility_id }) => {
  const [proposalText, setProposalText] = useState("");
  const [proposalTime, setProposalTime] = useState("");
  const [proposalBudget, setProposalBudget] = useState("");

  const addProposal = async (event) => {
    event.preventDefault();

    if (proposalText.length < 10) {
      alert("Please describe your proposal");
    } else if (proposalTime.length < 1 || parseInt(proposalTime) < 1) {
      alert("Please provide time estimate");
    } else if (proposalBudget.length < 1 || parseFloat(proposalBudget) < 1) {
      alert("Please provide budget estimate");
    } else {
      window.contract.add_facility_proposal({
        facility_id,
        text: proposalText,
        time: parseInt(proposalTime),
        budget: convertToYocto(proposalBudget),
      }, convertToTera("100"), 1);
    }
  };

  return (
    <form onSubmit={addProposal}
          className="flex flex-row relative mb-3 lg:w-3/4 w-full">
      {/*<div className="w-[52px] mr-5">*/}
      {/*  <img src={tmpLogo} alt="" width="w-full" className="rounded-full mt-1" />*/}
      {/*</div>*/}
      <div className="w-full relative">
        <textarea className="border p-2 w-full mb-1 h-20"
                  placeholder="Describe your proposal: what work will be done to restore or maintain, what experience you have, provide time planning and financial estimate details."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}>ʼ
        </textarea>

        <div className="flex flex-row justify-between">
          <div>
            <input type="number" className="border px-2 mt-1 py-1.5 w-[90px] mr-2"
                   min={1}
                   value={proposalTime}
                   onChange={(e) => setProposalTime(e.target.value)}
                   placeholder="Time"/>
            <span className="text-gray-600">days</span>
            <input type="number" className="border px-2 ml-10 py-1.5 w-[90px] mr-2"
                   min={1}
                   value={proposalBudget}
                   onChange={(e) => setProposalBudget(e.target.value)}
                   placeholder="Budget"/>
            <span className="text-gray-600">NEAR</span>
          </div>

          <Button title="Add Proposal" size="xs" noIcon/>
        </div>

      </div>
    </form>
  );
};
