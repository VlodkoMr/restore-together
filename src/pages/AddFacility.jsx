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
  const [regionList, setRegionList] = useState([]);
  const [facilityTypeList, setFacilityTypeList] = useState([]);

  const photoInput = React.createRef();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState(defaultRegion);
  const [facilityType, setFacilityType] = useState("");
  const [markerLocation, setMarkerLocation] = useState();

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

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(photoInput.current.files[0].name);

    if (title.length < 3) {
      alert("Please provide full title");
    } else if (!region) {
      alert("Please select region");
    } else if (!facilityType) {
      alert("Please select Facility Type");
    } else if (!markerLocation) {
      alert("Please set Location using map");
    } else if (!photoInput.current.files.length) {
      alert("Please upload current Facility Photo");
    } else if (description.length < 20) {
      alert("Please provide more details in description");
    } else {
      console.log("OK");
    }

  }

  return (
    <Wrapper>
      <Header color="dark" currentUser={currentUser} />

      <Container className="pt-6 w-[520px]">
        <h2 className="text-3xl text-center my-6 font-semibold">Add Facility</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <FormLabel>Title<sup className="text-red-400">*</sup></FormLabel>
            <input type="text" className="border py-1.5 px-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-row relative z-10">
            <div className="mb-4 w-1/2 mr-8">
              <FormLabel>Region<sup className="text-red-400">*</sup></FormLabel>
              <Dropdown border title="Select Region" options={regionList} selected={region} onSelect={(id) => setRegion(id)} />
            </div>
            <div className="mb-4 w-1/2">
              <FormLabel>Facility Type<sup className="text-red-400">*</sup></FormLabel>
              <Dropdown border title="Select facility type" options={facilityTypeList} selected={facilityType} onSelect={(id) => setFacilityType(id)} />
            </div>
          </div>
          <div className="mb-4">
            <FormLabel>Set Location<sup className="text-red-400">*</sup></FormLabel>
            <div className="h-[180px]">
              <AddFacilityMap centerCoord={regionsCoordConfig[region]} markerLocation={markerLocation} setMarkerLocation={setMarkerLocation} />
            </div>
          </div>
          <div className="mb-4">
            <FormLabel>Current Photo<sup className="text-red-400">*</sup></FormLabel>
            <input type="file" accept="image/*" className="border py-1.5 px-2 w-full text-sm" ref={photoInput} />
          </div>
          <div className="mb-3">
            <FormLabel>Describe more details<sup className="text-red-400">*</sup></FormLabel>
            <textarea className="border p-2 w-full mb-1 h-28" value={description} onChange={(e) => setDescription(e.target.value)}> </textarea>
          </div>
          <div className="text-left">
            <Button title="Submit" />
          </div>
        </form>

      </Container>
    </Wrapper>
  );
};
