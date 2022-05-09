import React, { useEffect, useState } from "react";
import { Header } from '../components/Header';
import { Container, FormLabel, Wrapper } from '../assets/styles/common.style';
import { useLocation } from 'react-router-dom';
import Dropdown from '../components/basic/Dropdown';
import { defaultRegion, facilityTypeConfig, regionsConfig, regionsCoordConfig } from '../near/content';
import { Button } from '../components/basic/Button';
import AddFacilityMap from '../components/AddFacilityMap';

export const AddFacility = ({ currentUser }) => {
  const { state: searchFilters } = useLocation();
  const [region, setRegion] = useState(defaultRegion);
  const [facilityType, setFacilityType] = useState();
  const [regionList, setRegionList] = useState([]);
  const [facilityTypeList, setFacilityTypeList] = useState([]);

  useEffect(() => {
    if (searchFilters) {
      setRegion(searchFilters.region)
    }

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
  }, []);

  return (
    <Wrapper>
      <Header color="dark" currentUser={currentUser} />

      <Container className="pt-6 w-[520px]">
        <h2 className="text-3xl text-center my-6 font-semibold">Add Facility</h2>
        <div className="mb-3">
          <FormLabel>Title</FormLabel>
          <input type="text" className="border py-1.5 px-2 w-full" />
        </div>
        <div className="flex flex-row relative z-10">
          <div className="mb-3 w-1/2 mr-8">
            <FormLabel>Region</FormLabel>
            <Dropdown border title="Select Region" options={regionList} selected={region} onSelect={(id) => setRegion(id)} />
          </div>
          <div className="mb-3 w-1/2">
            <FormLabel>Facility Type</FormLabel>
            <Dropdown border title="Select facility type" options={facilityTypeList} selected={facilityType} onSelect={(id) => setFacilityType(id)} />
          </div>
        </div>
        <div className="mb-3">
          <FormLabel>Set Location</FormLabel>
          <div className="h-[180px]">
            <AddFacilityMap centerCoord={regionsCoordConfig[region]} />
          </div>
        </div>
        <div className="mb-3">
          <FormLabel>Current Photo</FormLabel>
          <input type="file" className="border py-1.5 px-2 w-full" />
        </div>
        <div className="mb-2">
          <FormLabel>Describe more details</FormLabel>
          <textarea className="border p-2 w-full mb-1 h-28"> </textarea>
        </div>
        <div className="text-left">
          <Button title="Submit" />
        </div>

      </Container>
    </Wrapper>
  );
};
