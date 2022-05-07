import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';
import { defaultRegion, regionsCoordConfig } from '../near/content';
import FacilitiesMap from '../components/FacilitiesMap';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

export const Facilities = ({ currentUser }) => {
  const [centerCoord, setCenterCoord] = useState(regionsCoordConfig[defaultRegion]);
  const [facilityList, setFacilityList] = useState([]);

  // const defaultProps = {
  //   center: {
  //     lat: 50.4128268662044,
  //     lng: 30.54055722547036
  //   },
  //   zoom: 11
  // };

  useEffect(() => {
    setFacilityList([{
      id: 1,
      title: "Test 1",
      lat: "50.41",
      lng: "30.52",
      status: "1",
      type: "art",
      media: ""
    }, {
      id: 2,
      title: "Test 2 test 2 test 2",
      lat: "50.39",
      lng: "30.49",
      status: "1",
      type: "art",
      media: ""
    },
    ]);
  }, []);

  return (
    <>
      <Wrapper>
        <Header color="dark" currentUser={currentUser} />

        <div className="flex flex-row">

          <Container className="w-1/2 border-r border-r facility-col pt-6">
            {facilityList.length > 0 ? (
              facilityList.map(facility => (
                <div className="border-b" key={facility.id}>
                  <h4>{facility.title}</h4>
                  <p>Status: {facility.status}</p>
                </div>
              ))
            ) : (
              <>No facilities</>
            )}
          </Container>

          <div className="w-1/2">
            <div className="bg-gray-50 pb-3 pt-2 relative z-10">
              <FacilitiesFilter size="sm" />
            </div>
            <div className="relative z-0">
              <FacilitiesMap centerCoord={centerCoord} locations={facilityList} />
            </div>
          </div>

        </div>
      </Wrapper>
    </>
  );
};
