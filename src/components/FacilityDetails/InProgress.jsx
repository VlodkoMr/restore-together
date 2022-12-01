import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { OneProposal } from '../OneProposal';
import { FormInput, FormLabel, FormTextarea, Link } from '../../assets/styles/common.style';
import {
  convertFromYocto,
  convertToTera,
  getMediaUrl,
  resizeFileImage,
  timestampToDate,
  uploadMediaToIPFS
} from '../../near/utils';
import Big from 'big.js';
import { Button } from '../basic/Button';
import { Popup } from '../basic/Popup';
import { Loader } from '../basic/Loader';

export const FacilityDetailsInProgress = ({ facility, facilityProposals, allPerformers, isMyInvestments, myFeedback }) => {
  const currentUser = useSelector(state => state.user.account);
  const [proposal, setProposal] = useState();
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [executionProgress, setExecutionProgress] = useState("");
  const [progressPopupVisible, setProgressPopupVisible] = useState(false);
  const [canClaimAmount, setCanClaimAmount] = useState("0");
  const [claimedAmount, setClaimedAmount] = useState("0");

  // Execution Progress form
  const photoInput = React.createRef();
  const [media, setMedia] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (localStorage.getItem('showUpdatePopup')) {
      localStorage.removeItem('showUpdatePopup');
      setDescription(localStorage.getItem('temporaryDescription') || "");
      setProgressPopupVisible(true);
    }

    facilityProposals.map(proposal => {
      if (proposal.performer_id === facility.performer) {
        setProposal(proposal);
      }
    });

    loadExecutionProgress();
  }, []);

  const loadExecutionProgress = async () => {
    let progress = await window.contract.get_execution_progress({
      facility_id: facility.token_id
    });
    setExecutionProgress(progress);

    let claim_amount = await window.contract.get_available_tokens_amount({
      facility_id: facility.token_id
    });
    setClaimedAmount(claim_amount[0]);
    setCanClaimAmount(claim_amount[1]);
  }

  const claimTokens = async () => {
    setIsClaimLoading(true);
    window.contract.performer_claim_tokens({
      facility_id: facility.token_id
    }).then(() => {
      window.document.location.reload();
    });
  }

  const setCompletedStatus = async () => {
    window.contract.performer_set_completed({
      facility_id: facility.token_id
    });
  }

  const startUpdateProgress = () => {
    localStorage.setItem('showUpdatePopup', '1');
    setProgressPopupVisible(true);
  }

  const resizeImage = () => {
    let file = photoInput.current.files[0];
    resizeFileImage(file).then(result => {
      setMedia(result);
    });
  }

  const addExecutionProgress = () => {
    if (description.length < 10) {
      alert("Please fill Description details")
    } else {
      setIsLoading(true);
      localStorage.setItem('temporaryDescription', description);
      localStorage.setItem('showUpdatePopup', "1");
      localStorage.removeItem('showUpdatePopup');
      localStorage.removeItem('temporaryDescription');

      uploadMediaToIPFS(media).then(mediaURL => {
        const GAS = convertToTera("200");
        const DEPOSIT = 1;

        window.contract.add_execution_progress({
          media: mediaURL,
          description,
          facility_id: facility.token_id,
        }, GAS, DEPOSIT);
      });
    }
  }

  return (
    <>
      {facility.performer === currentUser.id && (
        <>
          <div className="flex flex-row">
            {
              canClaimAmount > 0 && (
                <div className="w-4/12">
                  <h3 className="text-xl font-medium mb-2">Finances</h3>
                  <p>
                    Available: <b className="font-medium">
                    <span className="text-xl">{convertFromYocto(canClaimAmount, 2)}</span>
                    /
                    {convertFromYocto(facility.total_invested)} NEAR
                  </b>
                  </p>
                  <p>Claimed: <b className="font-medium">{convertFromYocto(claimedAmount)} NEAR</b></p>

                  <div className="mt-4">
                    {isClaimLoading ? (
                      <div className="mt-2 w-1/2">
                        <Loader/>
                      </div>
                    ) : (
                      <Button title="Claim Tokens"
                              noIcon
                              disabled={parseFloat(convertFromYocto(canClaimAmount, 2)) === 0}
                              className="border border-main text-main bg-blue-50/40 hover:border-main hover:text-main/90"
                              onClick={() => claimTokens()}
                      />
                    )}
                  </div>
                </div>
              )
            }

            <div className="w-8/12 ml-10 mb-10">
              <h3 className="text-xl font-medium mb-2">Work Progress</h3>
              {
                facility.status === "InProgress" ? (
                  <div className="mr-10">
                    <p className="text-gray-500 mb-4">
                      Please, upload your work results and change status to get payments
                      and increase your rating.
                    </p>
                    <Button title="Update execution progress"
                            onClick={() => startUpdateProgress()}
                            noIcon
                            className="border border-main text-main bg-blue-50/40 hover:border-main/90 hover:text-main/90"/>

                    {executionProgress.length > 0 && (
                      <Button title="Completed"
                              onClick={() => setCompletedStatus()}
                              noIcon
                              className="ml-4 border border-red-400 text-red-400 bg-red-50/40 hover:border-red-500 hover:text-red-600"
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    Status: <b className="text-lg font-medium">{facility.status}</b>
                  </div>
                )
              }
            </div>
          </div>
        </>
      )}

      <h3 className="text-xl font-medium mb-2">Facility Performer</h3>
      {proposal && (
        <OneProposal proposal={proposal}
                     canVote={() => false}
                     facility={facility}
                     allPerformers={allPerformers}
                     isCurrentPerformer={true}
                     isMyInvestments={isMyInvestments}
                     myFeedback={myFeedback}
        />
      )}

      {executionProgress.length > 0 && (
        <>
          <div className="mb-8 shadow border border-gray-100 bg-gray-50/20 rounded-b-xl p-8 mt-[-10px]">
            <h3 className="mb-2 font-medium text-xl">
              Execution Progress
            </h3>
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6 ">
              {
                executionProgress.map((result, index) => (
                    <div className="overflow-hidden shadow-lg border border-gray-200 rounded-xl"
                         key={index}>
                      <img src={getMediaUrl(result.media)} alt="result"
                           className="block h-64 w-full object-cover bg-gray-50"
                      />
                      <div className="text-sm p-6">
                        <b className="text-lg">{timestampToDate(result.timestamp)}</b>
                        <p className="mt-2 max-h-24 overflow-y-auto text-gray-500">{result.description}</p>
                      </div>
                    </div>
                  )
                )
              }
            </div>
          </div>
        </>
      )
      }

      <Popup
        title="Update Execution Progress"
        popupVisible={progressPopupVisible}
        setPopupVisible={setProgressPopupVisible}
      >
        <form className="mt-2 w-3/4 block mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <FormLabel className="text-left">
              Photo<sup className="text-red-300">*</sup>
            </FormLabel>
            <FormInput type="file"
                       accept="image/*"
                       className="text-sm"
                       ref={photoInput}
                       onChange={() => resizeImage()}
            />
          </div>

          <div className="mb-3">
            <FormLabel className="text-left">
              Description<sup className="text-red-300">*</sup>
            </FormLabel>
            <FormTextarea
              placeholder="Provide work and progress details"
              value={description}
              maxlength={500}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-2 text-right">
            {!isLoading ? (
              <Button title="Save" onClick={() => addExecutionProgress()}/>
            ) : (
              <Loader/>
            )}
          </div>
        </form>
      </Popup>
    </>
  );
};
