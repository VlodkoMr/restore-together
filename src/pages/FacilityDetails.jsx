import Big from 'big.js';
import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Link, Wrapper } from '../assets/styles/common.style';
import { facilityTypeConfig, regionsConfig, statusColorMap, statusConfig } from '../near/content';
import { useSelector } from 'react-redux';
import { Button } from '../components/basic/Button';
import OneFacilityMap from '../components/OneFacilityMap';
import nftMinted from '../assets/images/verify.png';
import { useParams } from "react-router-dom";
import { Loader } from '../components/basic/Loader';
import { convertFromYocto, convertToTera, convertToYocto, getMediaUrl, timestampToDate, transformFacility } from '../near/utils';
import { FacilityDetailsFundraising } from '../components/FacilityDetails/Fundraising';
import { FacilityDetailsInProgress } from '../components/FacilityDetails/InProgress';
import { Footer } from '../components/Footer';

export const FacilityDetails = () => {
  let { id } = useParams();
  const currentUser = useSelector(state => state.user.account);
  const [facility, setFacility] = useState();
  const [facilityInvestments, setFacilityInvestments] = useState([]);
  const [facilityProposals, setFacilityProposals] = useState([]);
  const [isReady, setIsReady] = useState();
  const [investAmount, setInvestAmount] = useState("");
  const [allPerformers, setAllPerformers] = useState({});
  const [isInvestorNftMinted, setIsInvestorNftMinted] = useState(false);

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

  const isInvestorNftMintedPromise = new Promise(async (resolve) => {
    if (currentUser.id) {
      let result = await window.contract.is_investor_nft_minted({
        facility_id: id,
        account_id: currentUser.id
      });
      console.log('isInvestorNftMintedPromise result', result)
      resolve(result);
    } else {
      resolve();
    }
  });

  const loadFacilityData = async () => {
    setIsReady(false);

    Promise.all([facilityPromise, facilityInvestmentPromise, facilityProposalsPromise, allPerformersPromise, isInvestorNftMintedPromise]).then(result => {
      setFacility(transformFacility(result[0]));
      setFacilityInvestments(result[1]);
      setFacilityProposals(result[2]);
      setAllPerformers(result[3]);
      setIsInvestorNftMinted(result[4]);
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
    await window.contract.mint_investor_nft({
      facility_id: id
    }, convertToTera("160"), convertToYocto("0.009"))
  }

  return (
    <>
      <Wrapper>
        <Header color="dark"/>

        <main className="mb-auto">
          {isReady ? (
            <>
              <div className="bg-gray-50 border-t-2 h-[180px] mt-[-1px]">
                <OneFacilityMap centerCoord={getFacilityCoordString()} locations={[facility]}/>
              </div>

              <div className="bg-gray-50 border-b text-sm text-gray-500">
                <Container className="relative">
                  <div className="py-3">
                    <Link className="hover:underline hover:text-main/90" to="/">Home</Link> &raquo;
                    <Link className="hover:underline hover:text-main/90 ml-1" to="/facility">Facilities</Link> &raquo;
                    <Link className="hover:underline hover:text-main/90 ml-1"
                          to={`/facility?region=${facility.region}`}>{regionsConfig[facility.region]}</Link>
                  </div>
                </Container>
              </div>

              <Container className="flex flex-row mt-4 pt-2 pb-6">
                <div className="w-9/12 mr-14">
                  <h1 className="flex flex-row justify-between relative mb-1">
                    <div className="text-2xl font-medium uppercase">{facility.title}</div>

                    <div className="font-medium absolute right-0 top-8">
                      <b className="text-gray-500 ml-1 text-xl" title="Invested Total">
                        {facility.total_invested > 0 ? convertFromYocto(facility.total_invested, 1) : 0} NEAR
                      </b>
                    </div>
                  </h1>

                  <div className="text-gray-500/90 text-sm">
                    <small className={`px-2 py-1 font-medium text-sm rounded ${statusColorMap[facility.status]}`}>
                      {statusConfig[facility.status]}
                    </small>
                    <span className="text-3xl leading-3 align-sub mx-2 opacity-50">&#11825;</span>
                    <span className="font-medium">{facilityTypeConfig[facility.facility_type]}</span>
                    <span className="text-3xl leading-3 align-sub mx-2 opacity-50">&#11825;</span>
                    <span className="font-medium">
                      {facility.total_invested > 0 ? `Investors: ${facility.total_investors}` : "No investors (for now)"}
                    </span>
                  </div>

                  <hr className="mt-4"/>
                  <p className="mt-6" style={{ whiteSpace: "pre-wrap" }}>{facility.description}</p>

                  <hr className="my-6 block"/>
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
                  <div className="border border-gray-200 rounded-xl shadow-lg mt-2 overflow-hidden">
                    <img src={getMediaUrl(facility.media)} alt="" className="w-full shadow-md max-h-64 object-cover"/>

                    <div className="p-5">
                      <h3 className="text-lg uppercase font-medium text-center mb-5">My Investment</h3>

                      {isMyInvestments() ? (
                        <div className="text-sm my-3">
                          {facilityInvestments
                            .filter(item => item.user_id === currentUser.id)
                            .map((item, index) => (
                              <div className="flex flex-row my-2 mx-5" key={item.timestamp}>
                                <div className="w-1/2 text-gray-500">
                                  {index + 1}. {timestampToDate(item.timestamp)}
                                </div>
                                <div className="w-1/2 text-right text-gray-500">
                                  <b className="font-medium">{convertFromYocto(item.amount)} NEAR</b>
                                  {/*<div className="text-main">cancel</div>*/}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center">*No investments</div>
                      )}


                      {facility.status === 'Fundraising' && (
                        <div className="m-5 text-center flex flex-row">
                          <input type="number"
                                 min="1"
                                 step="1"
                                 className="p-2.5 border rounded-l-lg text-base border-2 border-grey-600/90 border-r-transparent
                               focus:outline-0 inline-block w-full"
                                 onChange={(e) => setInvestAmount(e.target.value)}
                                 placeholder="NEAR Amount"/>
                          <Button title="Invest"
                                  noIcon
                                  roundedClass="rounded-r-lg"
                                  className={"border-transparent bg-main hover:bg-main/90 ml-[-2px]"}
                                  onClick={() => handleInvest()}/>
                        </div>
                      )}

                      {isMyInvestments() && (
                        <>
                          <hr/>
                          <div className="flex flex-row m-5 mb-0 font-medium">
                            <div className="w-1/2">Total</div>
                            <div className="w-1/2 text-right">
                              {userTotalInvested() > 0 ? convertFromYocto(userTotalInvested(), 1) : 0} NEAR
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>


                  {isMyInvestments() && (
                    <div className="border border-gray-200 rounded-xl shadow-lg bg-white my-4 overflow-hidden text-center p-6">
                      {!isInvestorNftMinted ? (
                        <div>
                          <p className="mb-4 text-gray-500">You can claim your NFT as investor that support Ukraine!</p>
                          <Button title="Claim MY NFT" noIcon onClick={() => claimNFT()}/>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 my-6">
                          <img src={nftMinted} alt="minted" className="w-7 h-7 inline align-middle mr-2"/>
                          Your unique NFT Minted.
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </Container>
            </>
          ) : (
            <div className="mt-8">
              <Loader/>
            </div>
          )}
        </main>

        <Footer color="dark"/>
      </Wrapper>
    </>
  );
};
