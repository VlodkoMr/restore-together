import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Link, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';
import { defaultRegion, facilityTypeConfig, regionsConfig, regionsCoordConfig, statusConfig } from '../near/content';
import FacilitiesMap from '../components/FacilitiesMap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFacility, setRegion, setStatus } from '../store/facilityFilterSlice';
import { Loader } from '../components/basic/Loader';
import { getMediaUrl } from '../near/utils';
import { OneFacility } from '../components/OneFacility';

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
    console.log('result', result);

    setFacilityList(result);
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
                height: 'calc(100vh - 94px)',
              }}>
                <div className="bg-gray-50 pb-2 pt-3 border-b">
                  <Container className="h-14 pt-1 text-sm text-gray-500">
                    {facilityList.length > 0 ? (
                      <p>Total in {regionsConfig[region]}: {facilityList.length}</p>
                    ) : (
                      <p>No facilities in {regionsConfig[region]}</p>
                    )}
                    <Link to="/add-facility" state={{ region: region }}
                          className="block underline mt-0.5 hover:text-blue-500">
                      Add new facility
                    </Link>
                  </Container>
                </div>

                {
                  facilityList.length > 0 && facilityList.filter(filterItems).length > 0 ? (
                    facilityList.filter(filterItems).map(facility => (
                      <Container
                        className={`border-b transition hover:bg-blue-50/30 ${highLight === facility.token_id ? "bg-gray-50" : ""}`}
                        key={facility.token_id}>
                        <OneFacility facility={facility} />
                      </Container>
                    ))
                  ) : (
                    <div className="m-4 text-gray-500">*No facilities</div>
                  )
                }
              </div>

              <div className="w-1/2">
                <div className="bg-gray-50 pb-3 pt-2 relative z-10 border-b">
                  <FacilitiesFilter size="sm" />
                </div>
                <div className="relative z-0">
                  <FacilitiesMap filterItems={filterItems}
                                 centerCoord={centerCoord}
                                 locations={facilityList}
                                 setHighLight={setHighLight} />
                </div>
              </div>

            </div>
          ) : (
            <div className="mt-8">
              <Loader />
            </div>
          )
        }

      </Wrapper>
    </>
  );
};
