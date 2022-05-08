import React, { useEffect, useState } from "react";
import {
  defaultRegion,
  facilityTypeConfig,
  regionsConfig,
  statusConfig,
} from '../near/content';
import Dropdown from './basic/Dropdown';
import { Link } from '../assets/styles/common.style';
import { useDispatch, useSelector } from 'react-redux';
import { setFacility, setRegion, setStatus } from '../store/facilityFilterSlice';

export const FacilitiesFilter = ({ size }) => {
  const dispatch = useDispatch();
  const region = useSelector(state => state.facility.filter.region);
  const status = useSelector(state => state.facility.filter.status);
  const facility = useSelector(state => state.facility.filter.facility);

  const [regionList, setRegionList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [facilityTypeList, setFacilityTypeList] = useState([]);

  useEffect(() => {
    // Regions List
    let optionsRegionList = [];
    Object.keys(regionsConfig).map(id => {
      optionsRegionList.push({
        id,
        title: regionsConfig[id],
      });
    });
    setRegionList(optionsRegionList);

    // Facility Types List
    let optionsFacilityTypeList = [{
      id: "",
      title: "All"
    }];
    Object.keys(facilityTypeConfig).map(id => {
      optionsFacilityTypeList.push({
        id,
        title: facilityTypeConfig[id],
      });
    });
    setFacilityTypeList(optionsFacilityTypeList);

    // Status List
    let optionsStatusList = [{
      id: "",
      title: "All"
    }];
    Object.keys(statusConfig).map(id => {
      optionsStatusList.push({
        id,
        title: statusConfig[id],
      });
    });
    setStatusList(optionsStatusList);
  }, []);

  const FilterOption = ({ title, selected, options, onSelect }) => (
    <div className="whitespace-nowrap w-1/3">
      <small className="block font-semibold mb-1">{title}</small>
      <div>
        <Dropdown title="All" options={options} selected={selected} onSelect={onSelect} />
      </div>
    </div>
  );

  const getFacilityUrl = () => {
    const searchParams = new URLSearchParams();
    searchParams.append("region", region);
    if (facility) {
      searchParams.append("facility", facility);
    }
    if (status) {
      searchParams.append("status", status);
    }
    return `/facilities?${searchParams.toString()}`
  };

  return (
    <>
      <div
        className={`w-full relative bg-white mx-auto flex flex-row text-slate-900 
          ${size === "sm" ? "pr-12 pl-6 bg-gray-50 h-14 py-2" : "sm:w-[740px] px-10 rounded-full h-16 py-3"}
        `}>
        <FilterOption title="Region"
                      options={regionList}
                      selected={region}
                      onSelect={(id) => dispatch(setRegion({ id }))} />
        <FilterOption title="Facility Type"
                      options={facilityTypeList}
                      selected={facility}
                      onSelect={(id) => dispatch(setFacility({ id }))} />
        <FilterOption title="Status"
                      options={statusList}
                      selected={status}
                      onSelect={(id) => dispatch(setStatus({ id }))} />
        <Link to={getFacilityUrl()}>
          <button type="button"
                  className={`absolute right-2.5 text-white bg-red-500 transition hover:bg-red-600 hover:text-white focus:ring-4 items-center
                  focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-3 text-center inline-flex
                  ${size === "sm" ? "mr-2 top-2" : "top-2.5"}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd">
              </path>
            </svg>
          </button>
        </Link>
      </div>
    </>
  );
};
