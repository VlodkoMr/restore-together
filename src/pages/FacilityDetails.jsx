import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Link, Wrapper } from '../assets/styles/common.style';
import { facilityTypeConfig, regionsConfig, statusConfig } from '../near/content';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/basic/Button';
import OneFacilityMap from '../components/OneFacilityMap';
import { useParams } from "react-router-dom";

import {
  FacebookIcon,
  FacebookShareButton, TelegramIcon,
  TelegramShareButton, TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { Loader } from '../components/basic/Loader';
import { MyProposalForm } from '../components/MyProposalForm';
import { convertFromYocto, convertToTera, convertToYocto, getMediaUrl, timestampToDate } from '../near/utils';
import Big from 'big.js';
import { OneProposal } from '../components/OneProposal';

export const FacilityDetails = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.account);
  let { id } = useParams();
  const [facility, setFacility] = useState();
  const [facilityInvestments, setFacilityInvestments] = useState([]);
  const [facilityProposals, setFacilityProposals] = useState([]);
  const [isReady, setIsReady] = useState();
  const [investAmount, setInvestAmount] = useState("");

  const loadFacility = async () => {
    setIsReady(false);
    const facility = await window.contract.get_facility_by_id({
      token_id: id
    });
    const investments = await window.contract.get_facility_investment({
      token_id: id
    });
    const proposals = await window.contract.get_facility_proposals({
      token_id: id
    });
    console.log(proposals)

    setFacility(facility);
    setFacilityInvestments(investments);
    setFacilityProposals(proposals);
    setIsReady(true);
  }

  useEffect(() => {
    loadFacility();
  }, []);

  const getFacilityCoordString = () => {
    return `${facility.lat},${facility.lng}`;
  }

  const userTotalInvested = () => {
    let result = new Big(0);
    console.log('currentUser', currentUser)
    facilityInvestments
      .filter(item => item.user_id === currentUser.id)
      .map(item => {
        result = result.plus(item.amount.toString());
      });
    return result.toFixed();
  }

  const handleInvest = async () => {
    if (parseFloat(investAmount) > 0) {
      const deposit = convertToYocto(investAmount);
      await window.contract.add_investment({
        token_id: id
      }, convertToTera("80"), deposit);
    }
  }

  return (
    <>
      <Wrapper>
        <Header color="dark" />

        {isReady ? (
          <>
            <div className="bg-gray-50 h-[180px]">
              <OneFacilityMap centerCoord={getFacilityCoordString()} locations={[facility]} />
            </div>

            <div className="bg-gray-50 border-b text-sm text-gray-500">
              <Container className="relative">
                <div className="py-3">
                  <Link className="hover:underline hover:text-red-400" to="/">Home</Link> &raquo;
                  <Link className="hover:underline hover:text-red-400 ml-1" to="/facility">Facilities</Link> &raquo;
                  <Link className="hover:underline hover:text-red-400 ml-1"
                        to={`/facility?region=${facility.region}`}>{regionsConfig[facility.region]}</Link>
                </div>

                <div className="absolute right-6 top-1.5">
                  <FacebookShareButton url="/">
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                  <TwitterShareButton url="/" className="mx-1">
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                  <TelegramShareButton url="/">
                    <TelegramIcon size={32} round={true} />
                  </TelegramShareButton>
                </div>
              </Container>
            </div>

            <Container className="flex flex-row mt-4 pt-2">
              <div className="w-9/12 mr-14">
                <h1 className="text-2xl font-medium mt-1">{facility.title}</h1>

                <div className="text-gray-500 text-sm">
                  {facilityTypeConfig[facility.facility_type]}
                  <span className="mx-2">·</span>
                  Stage: {statusConfig[facility.status]}
                </div>
                <p className="mt-5">{facility.description}</p>

                <hr className="my-5 block" />

                <h3 className="text-xl font-medium mb-2">Proposals</h3>
                {
                  facilityProposals.length > 0 ? facilityProposals.map(proposal => (
                    <OneProposal proposal={proposal} key={proposal.p} />
                  )) : (
                    <div className="text-gray-500">
                      *No Proposals
                    </div>
                  )
                }

                <h3 className="font-medium mb-2 mt-10">Add Proposal</h3>
                {
                  currentUser.performer ? (
                    <MyProposalForm facility_id={facility.token_id} key={facility.token_id} />
                  ) : (
                    <>
                      <p className="text-gray-500">To add new proposal, please register{" "}
                        <Link to="/my" className="underline">Performer Account</Link>.</p>
                    </>
                  )
                }

              </div>

              <div className="w-3/12 min-w-[320px]">
                <div className="border rounded-xl shadow-md mt-2 overflow-hidden">
                  <img src={getMediaUrl(facility.media)} alt="" className="w-full shadow-md" />

                  <div className="p-5">
                    <h3 className="text-lg uppercase font-medium text-center mb-5">My Investment</h3>

                    <div className="text-sm my-3">
                      {
                        facilityInvestments
                          .filter(item => item.user_id === currentUser.id)
                          .map((item, index) => (
                            <div className="flex flex-row my-2 mx-5" key={item.timestamp}>
                              <div className="w-1/2">{index + 1}. {timestampToDate(item.timestamp)}</div>
                              <div className="w-1/2 text-right">
                                <div>{convertFromYocto(item.amount)} NEAR</div>
                                {/*<div className="text-red-500">cancel</div>*/}
                              </div>
                            </div>
                          ))
                      }
                    </div>

                    <div className="m-5 text-center flex flex-row">
                      <input type="number"
                             min="0.1"
                             step="0.1"
                             className="p-2.5 border rounded-l-lg text-base border-r-transparent focus:outline-0 inline-block w-full"
                             onChange={(e) => setInvestAmount(e.target.value)}
                             placeholder="NEAR Amount" />
                      <Button title="Invest" noIcon roundedClass="rounded-r-lg" onClick={() => handleInvest()} />
                    </div>
                    <hr />
                    <div className="flex flex-row m-5 mb-0 font-medium">
                      <div className="w-1/2">Total</div>
                      <div className="w-1/2 text-right">{convertFromYocto(userTotalInvested(), 1)} NEAR</div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </>
        ) : (
          <div className="mt-8">
            <Loader />
          </div>
        )}
      </Wrapper>
    </>
  );
};
