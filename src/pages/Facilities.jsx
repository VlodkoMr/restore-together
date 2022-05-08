import React, { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Container, Link, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';
import { defaultRegion, regionsConfig, regionsCoordConfig } from '../near/content';
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
      facilityType: "art",
      media: "https://etnoxata.com.ua/image/catalog/stat3/06_2016/08_06_16/03.jpg"
    }, {
      id: 2,
      title: `30 украинских памятников`,
      lat: "50.39",
      lng: "30.49",
      status: "1",
      facilityType: "art",
      media: "https://pustunchik.ua/uploads/school/cache/old/interesting/Navkolo-svitu/Pamyatnyky-Ukr/3.jpg"
    }, {
      id: 3,
      title: `Some other test x 123`,
      lat: "50.42",
      lng: "30.51",
      status: "1",
      facilityType: "art",
      media: "https://zakarpattya.net.ua/postimages/pub/2015/05/1-80-92-61.jpg"
    }, {
      id: 4,
      title: `Тест 321`,
      lat: "50.30",
      lng: "30.40",
      status: "1",
      facilityType: "art",
      media: "https://tn.fishki.net/26/upload/post/201407/23/1287454/8_3.jpg"
    },
    ]);
  }, [searchParams]);

  return (
    <>
      <Wrapper>
        <Header color="dark" currentUser={currentUser} />

        <div className="flex flex-row">

          <div className="w-1/2 border-r border-r facility-col pt-4 overflow-y-scroll" style={{
            height: 'calc(100vh - 92px)',
          }}>
            <Container className="h-14 mt-1 border-b text-sm text-gray-600">
              {facilityList.length > 0 ? (
                <p>Total in {regionsConfig[region]}: {facilityList.length}</p>
              ) : (
                <p>No facilities in {regionsConfig[region]}</p>
              )}
              <Link to="/add-facility" state={{ region: region }}
                    className="underline hover:text-red-500">
                Add new facility
              </Link>
            </Container>

            {facilityList.length > 0 ? (
              facilityList.map(facility => (
                <Container
                  className={`relative flex flex-row border-b py-4 last:border-b-0 hover:bg-gray-50 cursor-pointer
                  ${highLight === facility.id ? "bg-gray-50" : ""}`}
                  key={facility.id}>

                  <img src={facility.media} alt="" className="facility-image rounded-xl mr-6" />
                  <div>
                    <h4 className="text-lg my-2 whitespace-nowrap text-ellipsis overflow-hidden facility-title">
                      {facility.title}
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>Status: {facility.status}</p>
                      <p>Type: {facility.facilityType}</p>
                      <p>Investments: 100 NEAR</p>
                    </div>
                  </div>
                </Container>
              ))
            ) : (
              <>No facilities</>
            )}
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
