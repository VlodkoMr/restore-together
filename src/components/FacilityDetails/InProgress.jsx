import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { OneProposal } from '../OneProposal';
import { MyProposalForm } from '../MyProposalForm';
import { FormInput, FormLabel, Link } from '../../assets/styles/common.style';
import { convertFromYocto } from '../../near/utils';
import Big from 'big.js';
import { Button } from '../basic/Button';

export const FacilityDetailsInProgress = ({ facility, facilityProposals, allPerformers }) => {
  const currentUser = useSelector(state => state.user.account);
  const [proposal, setProposal] = useState();
  // const [currentPerformer, setCurrentPerformer] = useState();

  useEffect(() => {
    facilityProposals.map(proposal => {
      if (proposal.performer_id === facility.performer) {
        setProposal(proposal);
      }
    })
  }, []);

  return (
    <>
      {facility.performer === currentUser.id ? (
        <>
          <div className="flex flex-row">
            <div className="w-4/12">
              <h3 className="text-xl font-medium mb-2">Finances</h3>
              <p>Available: <b>0 / {convertFromYocto(facility.total_invested)} NEAR</b></p>
              <p>Claimed: <b>0 NEAR</b></p>
              <div className="mt-4">
                <Button title="Claim Tokens" noIcon className="border border-red-400 text-red-500" />
              </div>
            </div>
            <div className="w-8/12 ml-10">
              <h3 className="text-xl font-medium mb-2">Work Progress</h3>
              <div className="mr-10">
                <p className="text-gray-500 mb-4">
                  Please, upload your work results and change status to get payments
                  and increase your rating:
                </p>
                <Button title="Update execution progress" noIcon className="border border-red-400 text-red-500" />
                {/*<form className="mt-4">*/}
                {/*  <div className="mb-3">*/}
                {/*    <FormLabel>*/}
                {/*      Description<sup className="text-red-400">*</sup>*/}
                {/*    </FormLabel>*/}
                {/*    <FormInput type="text"*/}
                {/*      // value={title}*/}
                {/*      // onChange={(e) => setTitle(e.target.value)}*/}
                {/*    />*/}
                {/*  </div>*/}
                {/*  <div className="mb-3">*/}
                {/*    <FormLabel>Current Photo<sup className="text-red-400">*</sup></FormLabel>*/}
                {/*    <FormInput type="file"*/}
                {/*               accept="image/*"*/}
                {/*               className="text-sm"*/}
                {/*      // ref={photoInput}*/}
                {/*      // onChange={() => resizeImage()}*/}
                {/*    />*/}
                {/*  </div>*/}
                {/*  <div className="mt-2">*/}
                {/*    <Button title="Add " noIcon />*/}
                {/*  </div>*/}
                {/*</form>*/}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-medium mb-2">Facility Performer</h3>
          {
            proposal && (
              <OneProposal proposal={proposal}
                           canVote={() => false}
                           facility={facility}
                           allPerformers={allPerformers}
              />
            )
          }
        </>
      )}


    </>
  );
};
