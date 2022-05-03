import bg from "../assets/images/bg2.jpg";
import bgTop from "../assets/images/bg-top.png";

import React, { useState, useEffect } from "react";
import { facilityList, regionsConfig, statusList } from '../near/content';
import { Header } from '../components/Header';
import Dropdown from '../components/basic/Dropdown';

export const Homepage = ({ currentUser, isReady }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [region, setRegion] = useState("Kyiv Oblast");
  const [regionList, setRegionList] = useState([]);

  useEffect(() => {
    // Regions
    let optionsRegionList = [];
    Object.keys(regionsConfig).map(region => {
      optionsRegionList.push({
        id: region,
        title: region,
      });
    });
    setRegionList(optionsRegionList);
  }, []);

  const FilterOption = ({ title, options }) => (
    <div className="whitespace-nowrap w-1/3">
      <small className="block font-semibold mb-1">{title}</small>
      <div className="inline-block">
        <Dropdown title="All" options={options} />
      </div>
    </div>
  );

  return (
    <>
      <div className="absolute z-0 w-full h-full" style={{
        background: `url(${bg}) top center`, backgroundSize: `cover`
      }}>&nbsp;</div>
      <div className="absolute z-0 w-full h-full" style={{
        background: `url(${bgTop}) top center`, backgroundSize: `cover`, animation: `bgOpacity 15s 5 3s`
      }}>&nbsp;</div>
      <div className="top-gradient">&nbsp;</div>

      <div className="container mx-auto relative z-1 text-white">
        <Header />

        <div className="w-1/2 bg-white h-16 mx-auto rounded-full px-10 py-3 flex flex-row text-slate-900">
          <FilterOption title="Region" options={regionList} />
          <FilterOption title="Facility Type" options={facilityList} />
          <FilterOption title="Status" options={statusList} />
          <button type="button"
                  className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd">
              </path>
            </svg>
          </button>
        </div>
      </div>

    </>
  );
};
