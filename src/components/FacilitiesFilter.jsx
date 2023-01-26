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
import { useNavigate } from "react-router-dom";
import { setFacility, setRegion, setStatus } from '../store/facilityFilterSlice';

export const FacilitiesFilter = ({ size }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [regionList, setRegionList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [facilityTypeList, setFacilityTypeList] = useState([]);

  const region = useSelector(state => state.facility.filter.region);
  const status = useSelector(state => state.facility.filter.status);
  const facility = useSelector(state => state.facility.filter.facility);

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

  const FilterOption = ({ title, size, selected, options, onSelect }) => (
    <label className={`block whitespace-nowrap md:w-1/3 rounded-lg py-1 px-2 md:px-0 md:py-0 mb-2 md:mb-0
    ${size === "sm" ? "" : "bg-white/90"}
    ${title !== "Region" ? "border-l border-gray-200 md:pl-4" : "md:pl-1"}`}>
      <small className="block font-medium text-gray-500/80 mb-1">{title}</small>
      <span className="font-medium block">
        <Dropdown title="All" options={options} selected={selected} onSelect={onSelect} isSmall={size === "sm"}/>
      </span>
    </label>
  );

  const getFacilityUrl = (_region, _facility, _status) => {
    const searchParams = new URLSearchParams();
    searchParams.append("region", _region || region);
    if (_facility) {
      searchParams.append("facility", _facility);
    }
    if (_status) {
      searchParams.append("status", _status);
    }
    return `/facility?${searchParams.toString()}`
  };

  return (
    <>
      <div
        className={`w-full relative mx-auto text-slate-900 
          ${size === "sm"
          ? "pr-2 md:pl-6 pl-2 bg-gray-50 h-14 py-2 flex flex-row"
          : "md:bg-white sm:w-[800px] pl-10 pr-10 md:pr-16 md:rounded-full py-4 md:flex md:flex-row"}
        `}>
        <FilterOption title="Region"
                      options={regionList}
                      selected={region}
                      size={size}
                      onSelect={(id) => {
                        dispatch(setRegion({ id }));
                        if (size === "sm") {
                          navigate(getFacilityUrl(id, facility, status));
                        }
                      }}/>
        <FilterOption title="Facility Type"
                      size={size}
                      options={facilityTypeList}
                      selected={facility}
                      onSelect={(id) => {
                        dispatch(setFacility({ id }));
                        if (size === "sm") {
                          navigate(getFacilityUrl(region, id, status));
                        }
                      }}/>
        <FilterOption title="Stage"
                      size={size}
                      options={statusList}
                      selected={status}
                      onSelect={(id) => {
                        dispatch(setStatus({ id }));
                        if (size === "sm") {
                          navigate(getFacilityUrl(region, facility, id));
                        }
                      }}/>

        {size !== "sm" && (
          <Link to={getFacilityUrl(region, facility, status)}>
            <button type="button"
                    className={`md:absolute right-4 text-white bg-main transition hover:bg-main/90 hover:text-white focus:ring-4 items-center
                  focus:outline-none focus:ring-main font-medium rounded-full text-sm px-6 py-3 md:px-3 text-center inline-flex top-[14px]`}>
              <span className={"text-base mr-2 inline md:hidden"}>Search</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd">
                </path>
              </svg>
            </button>
          </Link>
        )}

      </div>
    </>
  );
};
