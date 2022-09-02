import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Link, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';
import { defaultRegion, regionsConfig, regionsCoordConfig } from '../near/content';
import FacilitiesMap from '../components/FacilitiesMap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFacility, setRegion, setStatus } from '../store/facilityFilterSlice';
import { Loader } from '../components/basic/Loader';
import { OneFacility } from '../components/OneFacility';
import { transformFacility } from '../near/utils';
import { Footer } from '../components/Footer';

export const Facilities = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const region = useSelector(state => state.facility.filter.region);
  const [centerCoord, setCenterCoord] = useState(regionsCoordConfig[defaultRegion]);
  const [facilityList, setFacilityList] = useState([]);
  const [highLight, setHighLight] = useState();
  const [isReady, setIsReady] = useState(false);

  const loadRegionFacilities = async (currentRegion) => {
    const result = await window.contract.get_region_facility({
      region: parseInt(currentRegion)
    });

    const items = result.map(item => transformFacility(item));

    setFacilityList(items);
    setIsReady(true);
  }

  useEffect(() => {
    let currentRegion = region;
    if (searchParams.has('region')) {
      currentRegion = searchParams.get('region');
      dispatch(setRegion({ id: currentRegion }));
    }
    if (searchParams.has('status')) {
      dispatch(setStatus({ id: searchParams.get('status') }));
    }
    if (searchParams.has('facility')) {
      dispatch(setFacility({ id: searchParams.get('facility') }));
    }
  }, [searchParams]);

  useEffect(() => {
    setCenterCoord(regionsCoordConfig[region]);
    loadRegionFacilities(region);
  }, [region]);

  const filterItems = (item) => {
    let result = true;
    if (searchParams.has('status')) {
      result = item.status === searchParams.get('status');
    }
    if (searchParams.has('facility')) {
      result = item.facility_type.toString() === searchParams.get('facility');
    }
    return result;
  }

  return (
    <>
      <Wrapper>
        <Header color="dark" width="full" />

        {
          isReady ? (
            <div className="flex flex-row">
              <div className="w-1/2 border-r border-r facility-col overflow-y-scroll" style={{
                height: 'calc(100vh - 158px)',
              }}>
                <div className="bg-gray-50 pb-2 pt-2 border-b z-10 relative">
                  <FacilitiesFilter size="sm" />
                </div>

                <Container className="py-3 text-sm text-gray-500">
                  {facilityList.length > 0 ? (
                    <p className="text-right font-semibold">Total in {regionsConfig[region]}: {facilityList.length}</p>
                  ) : (
                    <p>No facilities in {regionsConfig[region]}</p>
                  )}
                </Container>

                {
                  facilityList.length > 0 && facilityList.filter(filterItems).length > 0 ? (
                    facilityList.filter(filterItems).map(facility => (
                      <Container key={facility.token_id}>
                        <OneFacility facility={facility} />
                      </Container>
                      // <Container
                      //   className={`border-b transition hover:bg-blue-50/30 ${highLight === facility.token_id ? "bg-gray-50" : ""}`}
                      //   key={facility.token_id}>
                      //   <OneFacility facility={facility} />
                      // </Container>
                    ))
                  ) : (
                    <div className="m-4 text-gray-500">*No facilities</div>
                  )
                }
              </div>

              <div className="w-8/12">
                <div className="relative z-0">
                  <FacilitiesMap filterItems={filterItems}
                                 centerCoord={centerCoord}
                                 locations={facilityList}
                                 setHighLight={setHighLight}
                  />
                </div>
              </div>

            </div>
          ) : (
            <div className="mt-8">
              <Loader />
            </div>
          )
        }

        <Footer width="full" color="dark" />
      </Wrapper>
    </>
  );
};
