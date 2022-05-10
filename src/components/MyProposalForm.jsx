import React, { useEffect, useState } from "react";
import { Button } from './basic/Button';
import tmpLogo from '../assets/images/tmp.jpg';

export const MyProposalForm = () => {
  const [proposalText, setProposalText] = useState("");
  useEffect(() => {
    console.log('...')
    //
    // console.log(storage)
  }, []);

  return (
    <div className="flex flex-row px-5 py-4 relative mb-3 shadow border border-gray-100 rounded-lg">
      <div className="w-[52px] mr-5">
        <img src={tmpLogo} alt="" width="w-full" className="rounded-full mt-1" />
      </div>
      <div className="w-full relative">
        <textarea className="border p-2 w-full mb-1"
                  placeholder="Describe your proposal"
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}>
        </textarea>
        <input type="number" className="border px-2 mt-1 py-1.5 w-[90px] mr-2" placeholder="Time" />
        <span className="text-gray-600">days</span>
        <input type="number" className="border px-2 ml-10 py-1.5 w-[90px] mr-2" placeholder="Budget" />
        <span className="text-gray-600">NEAR</span>
        <Button title="Add Proposal" size="xs" noIcon className="absolute right-0" />
      </div>
    </div>
  );
};
