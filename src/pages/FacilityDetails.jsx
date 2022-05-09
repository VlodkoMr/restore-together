import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Btn, Container, Link, Wrapper } from '../assets/styles/common.style';
import { defaultRegion, facilityTypeConfig, regionsConfig, regionsCoordConfig, statusConfig } from '../near/content';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/basic/Button';
import OneFacilityMap from '../components/OneFacilityMap';
import tmpLogo from '../assets/images/tmp.jpg';
import {
  FacebookIcon,
  FacebookShareButton, TelegramIcon,
  TelegramShareButton, TwitterIcon,
  TwitterShareButton,
} from "react-share";

export const FacilityDetails = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [facility, setFacility] = useState();

  useEffect(() => {
    setFacility({
      id: 1,
      title: `Test ${new Date()}`,
      region: 10,
      lat: "50.41",
      lng: "30.52",
      status: "1",
      facilityType: "art",
      media: "https://etnoxata.com.ua/image/catalog/stat3/06_2016/08_06_16/03.jpg"
    });
  }, []);

  const getFacilityCoordString = () => {
    return `${facility.lat},${facility.lng}`;
  }

  return (
    <>
      <Wrapper>
        <Header color="dark" currentUser={currentUser} />

        {facility ? (
          <>
            <div className="bg-gray-50 h-[180px]">
              <OneFacilityMap centerCoord={getFacilityCoordString()} locations={[facility]} />
            </div>

            <div className="bg-gray-50 border-b text-sm text-gray-500">
              <Container className="relative">
                <div className="py-3">
                  <Link className="hover:underline hover:text-red-400" to="/">Home</Link> &raquo;
                  <Link className="hover:underline hover:text-red-400 ml-1" to="/facility">Facilities</Link> &raquo;
                  <Link className="hover:underline hover:text-red-400 ml-1" to={`/facility?region=${facility.region}`}>{regionsConfig[facility.region]}</Link>
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
              <div className="w-2/3 mr-10">
                <h1 className="text-2xl font-medium">Some page super title name</h1>

                <div className="text-gray-600 text-sm">
                  {facilityTypeConfig[facility.facilityType]} <span className="mx-1">·</span> Stage: {statusConfig[facility.status]}
                </div>
                <p className="mt-5">Some text...</p>

                <hr className="my-5 block" />

                <h3 className="text-xl font-medium mb-2">Proposals</h3>
                <div className="flex flex-row shadow border border-gray-100 rounded-lg px-5 py-4 relative mb-3">
                  <div className="w-16 mr-5">
                    <img src={tmpLogo} alt="" width="w-full" className="rounded-full my-1" />
                  </div>
                  <div>
                    <p className="text-lg font-medium leading-4">Company Name</p>
                    <small className="text-gray-500">
                      Time: 10 days
                      <span className="mx-1.5">·</span>
                      Price: 100 NEAR
                      <span className="mx-1.5">·</span>
                      Votes: 10%</small>
                    <p className="mt-2">
                      Some text...Some text...Some text...Some text...Some text...Some text...Some text...Some text...Some
                    </p>
                  </div>
                  <div className="w-48 text-right">
                    <small className="text-gray-500">07/22/2022</small>
                    <div className="text-red-600 font-medium mt-2">VOTED</div>
                    {/*<button className="text-sm mt-2 border-2 border-red-500 text-red-600 px-4 py-1 rounded-md font-medium hover:bg-red-50 transition">*/}
                    {/*  ADD VOTE*/}
                    {/*</button>*/}
                  </div>
                </div>

                <h3 className="text-xl font-medium mb-2 mt-6">Add Proposal</h3>
                <div className="flex flex-row px-5 py-4 relative mb-3 shadow border border-gray-100 rounded-lg">
                  <div className="w-[52px] mr-5">
                    <img src={tmpLogo} alt="" width="w-full" className="rounded-full mt-1" />
                  </div>
                  <div className="w-full relative">
                    <textarea className="border p-2 w-full mb-1" placeholder="Describe your proposal"> </textarea>
                    <input type="number" className="border px-2 mt-1 py-1.5 w-[90px] mr-2" placeholder="Time" />
                    <span className="text-gray-600">days</span>
                    <input type="number" className="border px-2 ml-10 py-1.5 w-[90px] mr-2" placeholder="Budget" />
                    <span className="text-gray-600">NEAR</span>
                    <Button title="Add Proposal" size="xs" noIcon className="absolute right-0" />
                  </div>
                </div>

              </div>

              <div className="w-1/3">
                <div className="border rounded-xl shadow-md mt-2 overflow-hidden">
                  <img src={facility.media} alt="" className="w-full shadow-md" />

                  <div className="p-5">
                    <h3 className="text-lg uppercase font-medium text-center mb-5">My Investment</h3>


                    <div className="flex flex-row my-3 mx-5">
                      <div className="w-1/2">1. 29/07/2022</div>
                      <div className="w-1/2 text-right">5 NEAR</div>
                    </div>
                    <div className="flex flex-row my-3 mx-5">
                      <div className="w-1/2">2. 30/07/2022</div>
                      <div className="w-1/2 text-right">5 NEAR</div>
                    </div>
                    <div className="m-5 text-center">
                      <input type="number" className="p-2.5 border rounded-l-lg text-base border-r-transparent focus:outline-0" placeholder="NEAR Amount" />
                      <Button title="Invest" roundedClass="rounded-r-lg" className="ml-[-2px]" />
                    </div>
                    <hr />
                    <div className="flex flex-row m-5 mb-0 font-medium">
                      <div className="w-1/2">Total</div>
                      <div className="w-1/2 text-right">10 NEAR</div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </>
        ) : (
          <>loading...</>
        )}
      </Wrapper>
    </>
  );
};
