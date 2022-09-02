import React, { useEffect, useState } from "react";
import Dropdown from '../components/basic/Dropdown';
import AddFacilityMap from '../components/AddFacilityMap';
import { Header } from '../components/Header';
import {
  Container,
  FormInput,
  FormLabel,
  FormTextarea,
  Link,
  Wrapper
} from '../assets/styles/common.style';
import { useLocation } from 'react-router-dom';
import { defaultRegion, facilityTypeConfig, regionsConfig, regionsCoordConfig, statusConfig } from '../near/content';
import { Button } from '../components/basic/Button';
import { Loader } from '../components/basic/Loader';
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  convertToTera,
  convertToYocto,
  getMediaUrl,
  resizeFileImage,
  uploadMediaToIPFS
} from '../near/utils';
import { Footer } from '../components/Footer';

export const AddFacility = () => {
    const navigate = useNavigate();

    const { state: searchFilters } = useLocation();
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState();
    const [regionList, setRegionList] = useState([]);
    const [facilityTypeList, setFacilityTypeList] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    // Step 1
    const [region, setRegion] = useState(defaultRegion);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [facilityType, setFacilityType] = useState("");
    const [markerLocation, setMarkerLocation] = useState({ lat: null, lng: null });

    // Step 2
    const photoInput = React.createRef();
    const [media, setMedia] = useState();

    // Step 3
    const [newItem, setNewItem] = useState();

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

      setTimeout(() => {
        loadCurrentStep();
      }, 100);
    }, []);

    const loadCurrentStep = async () => {
      console.log('loadCurrentStep')
      let step = parseInt(localStorage.getItem('step')) || 1;
      console.log('step', step)
      setCurrentStep(step);

      if (step === 3) {
        if (searchParams.get("transactionHashes")) {
          // Success
          let item = await window.contract.get_facility_by_id({
            token_id: localStorage.getItem('addFacilityId')
          });
          setNewItem(item);
          setIsReady(true);
          resetForm();
        } else {
          // Failed
          step = 2;
          localStorage.setItem('step', "2");
          setCurrentStep(2);
        }
      }

      if (step === 2) {
        let data = JSON.parse(localStorage.getItem('addFacility'));
        setTitle(data.title);
        setDescription(data.description);
        setRegion(data.region);
        setFacilityType(data.facilityType);
        setMarkerLocation({
          lat: data.lat,
          lng: data.lng
        });
        setIsReady(true);
      } else {
        setIsReady(true);
      }
    }

    const resizeImage = () => {
      let file = photoInput.current.files[0];
      resizeFileImage(file).then(result => {
        setMedia(result);
      });
    }

    const saveStep1 = async () => {
      if (!window.walletConnection.isSignedIn()) {
        alert("Please LogIn using NEAR Wallet");
      } else if (title.length < 3) {
        alert("Please provide full title");
      } else if (!region) {
        alert("Please select region");
      } else if (!facilityType) {
        alert("Please select Facility Type");
      } else if (!markerLocation || !markerLocation.lat || !markerLocation.lng) {
        alert("Please set Location using map");
      } else if (description.length < 10) {
        alert("Please provide more details in description");
      } else {
        setIsLoading(true);
        localStorage.setItem('step', "2");
        localStorage.setItem('addFacility', JSON.stringify({
          title,
          region,
          facilityType,
          description,
          lat: markerLocation.lat,
          lng: markerLocation.lng
        }));
        setCurrentStep(2);
        setIsLoading(false);
      }
    }

    const saveStep2 = async () => {
      if (!photoInput.current.files.length) {
        alert("Please upload current Facility Photo");
      } else {
        setIsLoading(true);
        uploadMediaToIPFS(media).then(mediaURL => {
          const GAS = convertToTera("200");
          const DEPOSIT = convertToYocto("0.1");
          const tokenId = `${region}-${facilityType}-${new Date().getTime()}`;

          localStorage.setItem('step', "3");
          localStorage.setItem('addFacilityId', tokenId);

          window.contract.add_facility({
            id: tokenId,
            title,
            media: mediaURL,
            description,
            region: parseInt(region),
            facility_type: parseInt(facilityType),
            lat: markerLocation.lat.toString(),
            lng: markerLocation.lng.toString()
          }, GAS, DEPOSIT);
        });
      }
    }

    const goBack = () => {
      setCurrentStep(1);
      localStorage.setItem('step', "1");
    }

    const resetForm = () => {
      localStorage.removeItem('addFacility');
      localStorage.removeItem('addFacilityId');
      localStorage.removeItem('step');
      navigate("/add-facility");
      localStorage.setItem('step', "1");
    }

    const StepCircle = ({ step }) => (
      <div className="w-1/3 z-10 relative cursor-default">
        <div
          className={`border-2 rounded-full w-12 h-12 mx-auto pt-2 text-xl text-center 
        ${currentStep >= step ? "font-medium text-main bg-blue-100 border-mainLight" : "text-gray-300 bg-gray-100"}`}>{step}</div>
      </div>
    )

    const StepDescription = ({ step, text }) => (
      <div className="w-1/3">
        <div
          className={`text-center text-sm mt-1 font-medium ${currentStep >= step ? "text-main" : "text-gray-300"}`}>{text}</div>
      </div>
    )

    const stepLineMap = {
      1: "left-16",
      2: "left-[50%]",
      3: "left-[100%]",
    };

    return (
      <Wrapper>
        <Header color="dark" />

        <Container className="pt-4 w-[520px]">
          <h2 className="text-3xl text-center my-6 font-semibold">Add Facility</h2>

          {isReady ? (
            <>
              <div className="mb-5">
                <div className="flex flex-row relative">
                  <div className="absolute h-1 left-16 right-16 bg-blue-400 top-6 z-0">&nbsp;</div>
                  <div className={`absolute h-1 right-16 ${stepLineMap[currentStep]} bg-gray-200 top-6 z-0`}>&nbsp;</div>
                  <StepCircle step={1} />
                  <StepCircle step={2} />
                  <StepCircle step={3} />
                </div>
                <div className="flex flex-row">
                  <StepDescription step={1} text="General Info" />
                  <StepDescription step={2} text="Upload Photo" />
                  <StepDescription step={3} text="Done" />
                </div>
              </div>

              <div className="pb-6">
                {currentStep === 1 && (
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <FormLabel>
                        Title<sup className="text-red-300">*</sup>
                      </FormLabel>
                      <FormInput type="text"
                                 value={title}
                                 onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="flex flex-row relative z-10">
                      <div className="mb-4 w-1/2 mr-8">
                        <FormLabel>
                          Region<sup className="text-red-300">*</sup>
                        </FormLabel>
                        <Dropdown border
                                  title="Select Region"
                                  options={regionList}
                                  selected={region}
                                  onSelect={(id) => setRegion(id)}
                        />
                      </div>
                      <div className="mb-4 w-1/2">
                        <FormLabel>
                          Facility Type<sup className="text-red-300">*</sup>
                        </FormLabel>
                        <Dropdown border
                                  title="Select facility type"
                                  options={facilityTypeList}
                                  selected={facilityType}
                                  onSelect={(id) => setFacilityType(id)}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <FormLabel>
                        Set Location (click on map)<sup className="text-red-300">*</sup>
                      </FormLabel>
                      <div className="h-[180px]">
                        <AddFacilityMap centerCoord={regionsCoordConfig[region]}
                                        markerLocation={markerLocation}
                                        setMarkerLocation={setMarkerLocation} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <FormLabel>
                        Describe facility details<sup className="text-red-300">*</sup>
                      </FormLabel>
                      <FormTextarea
                        value={description}
                        maxLength="300"
                        placeholder="Describe short story, current stage and requirements."
                        onChange={(e) => setDescription(e.target.value)}>
                      </FormTextarea>
                    </div>

                    {!isLoading ? (
                      <div className="flex">
                        <div className="w-2/3">
                        </div>
                        <div className="w-1/3 text-right">
                          <Button title="Next" onClick={() => saveStep1()} />
                        </div>
                      </div>
                    ) : (
                      <Loader />
                    )}
                  </form>
                )}

                {currentStep === 2 && (
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                      <FormLabel>Current Photo<sup className="text-red-300">*</sup></FormLabel>
                      <FormInput type="file"
                                 accept="image/*"
                                 className="text-sm"
                                 ref={photoInput}
                                 onChange={() => resizeImage()} />
                    </div>

                    {media && (
                      <div className="mb-4">
                        <img src={media} alt="preview" className="h-80 w-full block object-cover" />
                      </div>
                    )}

                    {!isLoading ? (
                      <div className="flex flex-row justify-between">
                        <Button title="Back"
                                noIcon
                                className="border-2 border-gray-400 text-gray-400 bg-white hover:bg-gray-100"
                                onClick={() => goBack()}
                        />
                        <Button title="Next"
                                onClick={() => saveStep2()}
                        />
                      </div>
                    ) : (
                      <Loader />
                    )}
                  </form>
                )}
              </div>
            </>
          ) : (
            <Loader />
          )}

          {currentStep === 3 && (
            <>
              {newItem && (
                <>
                  <h3 className="text-center text-xl font-semibold">Facility published!</h3>

                  <Link to={`/facility/${newItem.token_id}`} className="my-6 border rounded-lg flex flex-row">
                    <img src={getMediaUrl(newItem.media)} alt="media" className="facility-image rounded-l-lg mr-4" />
                    <div>
                      <h3
                        className="text-lg my-2 whitespace-nowrap text-ellipsis overflow-hidden w-[275px]">{newItem.title}</h3>
                      <p className="text-sm text-gray-500">Region: {regionsConfig[newItem.region]}</p>
                      <p className="text-sm text-gray-500">Status: {statusConfig[newItem.status]}</p>
                      <p className="text-sm text-gray-500">Type: {facilityTypeConfig[newItem.facility_type]}</p>
                    </div>
                  </Link>

                  <div className="mt-8 text-center">
                    <Button title="Add New Facility" noIcon onClick={() => {
                      resetForm();
                      setCurrentStep(1);
                    }} />
                  </div>
                </>
              )}
            </>
          )}

        </Container>

        <Footer color="dark" />
      </Wrapper>
    );
  }
;
