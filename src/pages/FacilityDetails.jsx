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
import { convertFromYocto, convertToTera, convertToYocto, getMediaUrl, timestampToDate } from '../near/utils';
import Big from 'big.js';
import { FacilityDetailsFundraising } from '../components/FacilityDetails/Fundraising';
import { FacilityDetailsInProgress } from '../components/FacilityDetails/InProgress';

export const FacilityDetails = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.account);
  let { id } = useParams();
  const [facility, setFacility] = useState();
  const [facilityInvestments, setFacilityInvestments] = useState([]);
  const [facilityProposals, setFacilityProposals] = useState([]);
  const [isReady, setIsReady] = useState();
  const [investAmount, setInvestAmount] = useState("");
  const [allPerformers, setAllPerformers] = useState({});

  const facilityPromise = new Promise(async (resolve) => {
    let result = await window.contract.get_facility_by_id({
      token_id: id
    });
    resolve(result);
  });

  const facilityInvestmentPromise = new Promise(async (resolve) => {
    let result = await window.contract.get_facility_investment({
      token_id: id
    });
    resolve(result);
  });
  const facilityProposalsPromise = new Promise(async (resolve) => {
    let result = await window.contract.get_facility_proposals({
      token_id: id
    })
    resolve(result);
  });

  const allPerformersPromise = new Promise(async (resolve) => {
    let result = await window.contract.get_all_performers();
    resolve(result);
  });

  const loadFacilityData = async () => {
    setIsReady(false);

    Promise.all([facilityPromise, facilityInvestmentPromise, facilityProposalsPromise, allPerformersPromise]).then(result => {
      console.log(result)
      setFacility(result[0]);
      setFacilityInvestments(result[1]);
      setFacilityProposals(result[2]);
      setAllPerformers(result[3]);
      setIsReady(true);
    });
  }

  useEffect(() => {
    loadFacilityData();
  }, []);

  const getFacilityCoordString = () => {
    return `${facility.lat},${facility.lng}`;
  }

  const isMyInvestments = () => {
    return facilityInvestments.filter(item => item.user_id === currentUser.id).length > 0
  }

  const userTotalInvested = () => {
    let result = new Big(0);
    facilityInvestments
      .filter(item => item.user_id === currentUser.id)
      .map(item => {
        result = result.plus(item.amount.toString());
      });
    return result.toFixed();
  }

  const handleInvest = async () => {
    if (!currentUser.id) {
      alert("Please, LogIn for investment");
      return;
    }
    if (parseFloat(investAmount) > 0) {
      const deposit = convertToYocto(investAmount);
      await window.contract.add_investment({
        token_id: id
      }, convertToTera("280"), deposit);
    }
  }
  const claimNFT = async () => {
    console.log(facility.media)
    await window.contract.mint_investor_nft({
      facility_id: id,
      media_url: facility.media
    }, convertToTera("120"), convertToYocto("0.0075"))
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

            <div className="bg-gray-50 border-b text-sm text-gray-400">
              <Container className="relative">
                <div className="py-3">
                  <Link className="hover:underline hover:text-blue-400" to="/">Home</Link> &raquo;
                  <Link className="hover:underline hover:text-blue-400 ml-1" to="/facility">Facilities</Link> &raquo;
                  <Link className="hover:underline hover:text-blue-400 ml-1"
                        to={`/facility?region=${facility.region}`}>{regionsConfig[facility.region]}</Link>
                </div>

                <div className="absolute right-6 top-2">
                  <FacebookShareButton url="/" className="opacity-70 hover:opacity-100 transition">
                    <FacebookIcon size={28} round={true} />
                  </FacebookShareButton>
                  <TwitterShareButton url="/" className="opacity-70 hover:opacity-100 transition mx-1.5">
                    <TwitterIcon size={28} round={true} />
                  </TwitterShareButton>
                  <TelegramShareButton url="/" className="opacity-70 hover:opacity-100 transition">
                    <TelegramIcon size={28} round={true} />
                  </TelegramShareButton>
                </div>
              </Container>
            </div>

            <Container className="flex flex-row mt-4 pt-2">
              <div className="w-9/12 mr-14">
                <h1 className="flex flex-row justify-between mt-1">
                  <div className="text-2xl font-medium">{facility.title}</div>
                  <div className="mt-2">
                    {facility.total_invested > 0 && (
                      <>
                        <span className="text-gray-400 text-sm">Total Invested:</span>
                        <b className="text-gray-500 ml-1 text-xl">
                          {convertFromYocto(facility.total_invested, 1)} NEAR
                        </b>
                      </>
                    )}
                  </div>
                </h1>

                <div className="text-gray-400 text-sm">
                  {facilityTypeConfig[facility.facility_type]}
                  <span className="mx-2">·</span>
                  Stage: {statusConfig[facility.status]}
                </div>
                <p className="mt-5" style={{ whiteSpace: "pre-wrap" }}>{facility.description}</p>

                <hr className="my-6 block" />
                {
                  facility.status === "Fundraising" ? (
                    <FacilityDetailsFundraising
                      facility={facility}
                      facilityProposals={facilityProposals}
                      facilityInvestments={facilityInvestments}
                      allPerformers={allPerformers}
                    />
                  ) : (
                    <FacilityDetailsInProgress
                      facility={facility}
                      facilityProposals={facilityProposals}
                      allPerformers={allPerformers}
                    />
                  )
                }
              </div>

              <div className="w-3/12 min-w-[320px]">
                <div className="border rounded-xl shadow-md mt-2 overflow-hidden">
                  <img src={getMediaUrl(facility.media)} alt="" className="w-full shadow-md max-h-64 object-cover" />

                  <div className="p-5">
                    <h3 className="text-lg uppercase font-medium text-center mb-5">My Investment</h3>

                    <div className="text-sm my-3">
                      {
                        !isMyInvestments() ? (
                          <div className="text-sm text-gray-400 text-center">
                            *no investments
                          </div>
                        ) : facilityInvestments
                          .filter(item => item.user_id === currentUser.id)
                          .map((item, index) => (
                            <div className="flex flex-row my-2 mx-5" key={item.timestamp}>
                              <div className="w-1/2">{index + 1}. {timestampToDate(item.timestamp)}</div>
                              <div className="w-1/2 text-right">
                                <div>{convertFromYocto(item.amount)} NEAR</div>
                                {/*<div className="text-blue-500">cancel</div>*/}
                              </div>
                            </div>
                          ))
                      }
                    </div>

                    {
                      facility.status === 'Fundraising' && (
                        <div className="m-5 text-center flex flex-row">
                          <input type="number"
                                 min="0.1"
                                 step="0.1"
                                 className="p-2.5 border rounded-l-lg text-base border-blue-400 border-r-transparent focus:outline-0 inline-block w-full"
                                 onChange={(e) => setInvestAmount(e.target.value)}
                                 placeholder="NEAR Amount" />
                          <Button title="Invest" noIcon roundedClass="rounded-r-lg" onClick={() => handleInvest()} />
                        </div>
                      )
                    }

                    {
                      isMyInvestments() && facility.status === 'Completed' && (
                        <div className="text-center my-3">
                          <Button title="Claim MY NFT" noIcon onClick={() => claimNFT()} />
                        </div>
                      )
                    }

                    {
                      isMyInvestments() && (
                        <>
                          <hr />
                          <div className="flex flex-row m-5 mb-0 font-medium">
                            <div className="w-1/2">Total</div>
                            <div className="w-1/2 text-right">
                              {userTotalInvested() > 0 ? (
                                <>{convertFromYocto(userTotalInvested(), 1)} NEAR</>
                              ) : (
                                <>0 NEAR</>
                              )}
                            </div>
                          </div>
                        </>
                      )
                    }

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
