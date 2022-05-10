import React, { useEffect, useState } from "react";
import { Header } from '../components/Header';
import { Container, FormLabel, StepCircle, Wrapper } from '../assets/styles/common.style';
import { useLocation } from 'react-router-dom';
import Dropdown from '../components/basic/Dropdown';
import { defaultRegion, facilityTypeConfig, regionsConfig, regionsCoordConfig } from '../near/content';
import { Button } from '../components/basic/Button';
import AddFacilityMap from '../components/AddFacilityMap';
import { init } from '@textile/near-storage';
import { Loader } from '../components/basic/Loader';
import { useSearchParams } from "react-router-dom";
import { convertToTera, convertToYocto, dataURLtoFile } from '../near/utils';

export const AddFacility = ({ currentUser }) => {
    const { state: searchFilters } = useLocation();
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState();
    const [regionList, setRegionList] = useState([]);
    const [facilityTypeList, setFacilityTypeList] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    // Step 1
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [region, setRegion] = useState(defaultRegion);
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
      let step = parseInt(localStorage.getItem('step')) || 1;
      setCurrentStep(step);

      if (step === 3) {
        if (searchParams.get("transactionHashes")) {
          // Success
          let item = await window.contract.get_facility_by_id({
            token_id: localStorage.getItem('addFacilityId')
          });
          setNewItem(item);
          setIsReady(true);
        } else {
          // Failed
          step = 2;
          localStorage.setItem('step', "2");
          setCurrentStep(2);
        }
      }

      if (step === 2) {
        checkStorageDeposit().then(result => {
          if (result) {
            // load data from local storage
            let data = JSON.parse(localStorage.getItem('addFacility'));
            setTitle(data.title);
            setDescription(data.description);
            setRegion(data.region);
            setFacilityType(data.facilityType);
            setMarkerLocation({
              lat: data.lat,
              lng: data.lng
            });
          } else {
            setCurrentStep(1);
            localStorage.setItem('step', "1");
          }
          setIsReady(true);
        })
      } else {
        setIsReady(true);
      }
    }

    const checkStorageDeposit = async (redirect = false) => {
      const storage = await init(window.walletConnection.account());
      const isDeposit = await storage.hasDeposit();
      if (redirect && !isDeposit) {
        await storage.addDeposit();
      }
      return isDeposit;
    }

    const resizeImage = () => {
      let file = photoInput.current.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;

        setTimeout(() => {
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          const canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          setMedia(canvas.toDataURL(file.type));
        }, 300);
      };
      reader.readAsDataURL(file);
    }

    const uploadMediaToIPFS = () => {
      return new Promise(async (resolve, reject) => {
        const storage = await init(window.walletConnection.account());
        const file = dataURLtoFile(media, `${new Date()}.jpg`);
        const { id, cid } = await storage.store(file);
        if (id.length && cid && cid["/"].length) {
          resolve(cid["/"]);
        }
        reject();
      })
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
      } else if (description.length < 20) {
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
        checkStorageDeposit(true).then(() => {
          setCurrentStep(2);
          setIsLoading(false);
        });
      }
    }

    const saveStep2 = async () => {
      if (!photoInput.current.files.length) {
        alert("Please upload current Facility Photo");
      } else {
        setIsLoading(true);
        checkStorageDeposit(true).then(() => {
          uploadMediaToIPFS().then(media => {
            const GAS = convertToTera("200");
            const DEPOSIT = convertToYocto("0.1");
            const tokenId = `${region}-${facilityType}-${new Date().getTime()}`;

            localStorage.setItem('step', "3");
            localStorage.setItem('addFacilityId', tokenId);

            window.contract.add_facility({
              id: tokenId,
              title,
              media,
              description,
              region: parseInt(region),
              facility_type: parseInt(facilityType),
              lat: markerLocation.lat.toString(),
              lng: markerLocation.lng.toString()
            }, GAS, DEPOSIT);
          });
        }).catch(() => {
          alert("Upload to IPFS failed.")
        });
      }
    }

    const goBack = () => {
      // event.preventDefault();
      setCurrentStep(1);
      localStorage.setItem('step', "1");
    }

    const resetForm = () => {
      localStorage.removeItem('addFacility');
      localStorage.removeItem('addFacilityId');
      localStorage.removeItem('step');

      // reload?
    }

    const StepCircle = ({ step }) => (
      <div className="w-1/3 z-10 relative cursor-default">
        <div
          className={`border-2 rounded-full w-12 h-12 mx-auto pt-2 text-xl text-center 
        ${currentStep >= step ? "font-medium text-red-500 bg-red-100 border-red-400" : "text-gray-300 bg-gray-100"}`}>{step}</div>
      </div>
    )

    const StepDescription = ({ step, text }) => (
      <div className="w-1/3">
        <div className={`text-center text-sm mt-1 font-medium ${currentStep >= step ? "text-red-500" : "text-gray-300"}`}>{text}</div>
      </div>
    )

    const stepLineMap = {
      1: "left-16",
      2: "left-[50%]",
      3: "left-[100%]",
    };

    return (
      <Wrapper>
        <Header color="dark" currentUser={currentUser} />

        <Container className="pt-4 w-[520px]">
          <h2 className="text-3xl text-center my-6 font-semibold">Add Facility</h2>

          {isReady ? (
            <>
              <div className="mb-5">
                <div className="flex flex-row relative">
                  <div className="absolute h-1 left-16 right-16 bg-red-400 top-6 z-0">&nbsp;</div>
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
                        Title<sup className="text-red-400">*</sup>
                      </FormLabel>
                      <input type="text"
                             className="border py-1.5 px-2 w-full"
                             value={title}
                             onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-row relative z-10">
                      <div className="mb-4 w-1/2 mr-8">
                        <FormLabel>
                          Region<sup className="text-red-400">*</sup>
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
                          Facility Type<sup className="text-red-400">*</sup>
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
                        Set Location<sup className="text-red-400">*</sup>
                      </FormLabel>
                      <div className="h-[180px]">
                        <AddFacilityMap centerCoord={regionsCoordConfig[region]}
                                        markerLocation={markerLocation}
                                        setMarkerLocation={setMarkerLocation} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <FormLabel>
                        Describe facility details<sup className="text-red-400">*</sup>
                      </FormLabel>
                      <textarea className="border p-2 w-full mb-1 h-20"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}>
                      </textarea>
                    </div>

                    {!isLoading ? (
                      <div className="text-right">
                        <Button title="Next" onClick={() => saveStep1()} />
                      </div>
                    ) : (
                      <Loader />
                    )}
                  </form>
                )}

                {currentStep === 2 && (
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                      <FormLabel>Current Photo<sup className="text-red-400">*</sup></FormLabel>
                      <input type="file"
                             accept="image/*"
                             className="border py-1.5 px-2 w-full text-sm"
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
              {newItem ? (
                <>
                  results...
                  {newItem.token_id} | {newItem.title}
                  <div className="mt-6 text-center">
                    <Button title="Add New Facility" noIcon onClick={() => resetForm()} />
                  </div>
                </>
              ) : (
                <Loader />
              )}
            </>
          )}

        </Container>
      </Wrapper>
    );
  }
;
