import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';
import { defaultRegion, regionsCoordConfig } from '../near/content';
import FacilitiesMap from '../components/FacilitiesMap';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFacility, setRegion, setStatus } from '../store/facilityFilterSlice';

export const Facilities = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const region = useSelector(state => state.facility.filter.region);
  const [centerCoord, setCenterCoord] = useState(regionsCoordConfig[defaultRegion]);
  const [facilityList, setFacilityList] = useState([]);
  const [highLight, setHighLight] = useState();

  useEffect(() => {
    if (searchParams.has('region')) {
      let id = searchParams.get('region');
      dispatch(setRegion({ id }));
    }
    if (searchParams.has('status')) {
      dispatch(setStatus({ id: searchParams.get('status') }));
    }
    if (searchParams.has('facility')) {
      dispatch(setFacility({ id: searchParams.get('facility') }));
    }

    setCenterCoord(regionsCoordConfig[region]);

    setFacilityList([{
      id: 1,
      title: `Test ${new Date()}`,
      lat: "50.41",
      lng: "30.52",
      status: "1",
      type: "art",
      media: ""
    }, {
      id: 2,
      title: `V2 ${new Date()}`,
      lat: "50.39",
      lng: "30.49",
      status: "1",
      type: "art",
      media: ""
    },
    ]);
  }, [searchParams]);

  return (
    <>
      <Wrapper>
        <Header color="dark" currentUser={currentUser} />

        <div className="flex flex-row">

          <Container className="w-1/2 border-r border-r facility-col pt-6">
            {facilityList.length > 0 ? (
              facilityList.map((facility, index) => (
                <div className={`border-b ${highLight === index ? "bg-gray-50" : ""}`} key={facility.id}>
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
              <FacilitiesMap centerCoord={centerCoord} locations={facilityList} setHighLight={setHighLight} />
            </div>
          </div>

        </div>
      </Wrapper>
    </>
  );
};
