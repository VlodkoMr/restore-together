import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Link, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';
import { defaultRegion, facilityTypeConfig, regionsConfig, regionsCoordConfig, statusConfig } from '../near/content';
import FacilitiesMap from '../components/FacilitiesMap';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFacility, setRegion, setStatus } from '../store/facilityFilterSlice';
import { Loader } from '../components/basic/Loader';
import { getMediaUrl } from '../near/utils';

export const Facilities = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const region = useSelector(state => state.facility.filter.region);
  const [centerCoord, setCenterCoord] = useState(regionsCoordConfig[defaultRegion]);
  const [facilityList, setFacilityList] = useState([]);
  const [highLight, setHighLight] = useState();
  const [isReady, setIsReady] = useState(false);

  const loadRegionFacilities = async () => {
    const result = await window.contract.get_region_facility({
      region: parseInt(region)
    });
    setFacilityList(result);
    setIsReady(true);
  }

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
    loadRegionFacilities();
  }, [searchParams]);

  return (
    <>
      <Wrapper>
        <Header color="dark" width="full" currentUser={currentUser} />

        <div className="flex flex-row">
          <div className="w-1/2 border-r border-r facility-col overflow-y-scroll" style={{
            height: 'calc(100vh - 94px)',
          }}>
            {
              isReady ? (
                <>
                  <div className="bg-gray-50 pb-2 pt-3 border-b">
                    <Container className="h-14 pt-1 text-sm text-gray-500">
                      {facilityList.length > 0 ? (
                        <p>Total in {regionsConfig[region]}: {facilityList.length}</p>
                      ) : (
                        <p>No facilities in {regionsConfig[region]}</p>
                      )}
                      <Link to="/add-facility" state={{ region: region }} className="block underline mt-0.5 hover:text-red-500">
                        Add new facility
                      </Link>
                    </Container>
                  </div>

                  {
                    facilityList.length > 0 ? (
                      facilityList.map(facility => (
                        <Container
                          className={`border-b transition hover:bg-gray-50 ${highLight === facility.token_id ? "bg-gray-50" : ""}`}
                          key={facility.token_id}>

                          <Link className="relative flex flex-row py-4 last:border-b-0" to={`/facility/${facility.token_id}`}>
                            <img src={getMediaUrl(facility.media)} alt="" className="facility-image rounded-xl mr-6" />
                            <div>
                              <h4 className="text-lg my-2 whitespace-nowrap text-ellipsis overflow-hidden facility-title">
                                {facility.title}
                              </h4>
                              <div className="text-sm text-gray-600 flex flex-row">
                                <div className="w-48">
                                  <p>Status: {statusConfig[facility.status]}</p>
                                  <p>Type: {facilityTypeConfig[facility.facilityType]}</p>
                                  {/*<p className="mt-2 underline">open...</p>*/}
                                </div>
                                <div>
                                  <p>Investments: 100 NEAR</p>
                                  <p>Proposals: 2</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </Container>
                      ))
                    ) : (
                      <div className="m-4 text-gray-500">*No facilities</div>
                    )
                  }
                </>
              ) : (
                <div className="mt-8">
                  <Loader />
                </div>
              )
            }
          </div>

          <div className="w-1/2">
            <div className="bg-gray-50 pb-3 pt-2 relative z-10 border-b">
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
