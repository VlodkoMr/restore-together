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

  const FilterOption = ({ title, selected, options, onSelect }) => (
    <div className={`whitespace-nowrap w-1/3 ${title !== "Region" ? "border-l border-gray-200 pl-4" : "pl-1"}`}>
      <small className="block font-medium text-gray-500/80 mb-1">{title}</small>
      <div className="font-medium">
        <Dropdown title="All" options={options} selected={selected} onSelect={onSelect} isSmall={size === "sm"}/>
      </div>
    </div>
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
        className={`w-full relative bg-white mx-auto flex flex-row text-slate-900 
          ${size === "sm" ? "pr-2 pl-6 bg-gray-50 h-14 py-2" : "sm:w-[800px] pl-10 pr-16 rounded-full py-4"}
        `}>
        <FilterOption title="Region"
                      options={regionList}
                      selected={region}
                      onSelect={(id) => {
                        dispatch(setRegion({ id }));
                        if (size === "sm") {
                          navigate(getFacilityUrl(id, facility, status));
                        }
                      }}/>
        <FilterOption title="Facility Type"
                      options={facilityTypeList}
                      selected={facility}
                      onSelect={(id) => {
                        dispatch(setFacility({ id }));
                        if (size === "sm") {
                          navigate(getFacilityUrl(region, id, status));
                        }
                      }}/>
        <FilterOption title="Stage"
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
                    className={`absolute right-4 text-white bg-main transition hover:bg-main/90 hover:text-white focus:ring-4 items-center
                  focus:outline-none focus:ring-main font-medium rounded-full text-sm p-3 text-center inline-flex top-[14px]`}>
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
