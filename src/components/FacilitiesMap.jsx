import React, { useState, useEffect } from "react";
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import { googleAPIKey, statusConfig } from '../near/content';
import { getMediaUrl } from '../near/utils';

function FacilitiesMap({ locations, centerCoord, setHighLight, filterItems, google }) {
  const [center, setCenter] = useState();
  const [activeMarker, setActiveMarker] = useState();
  const [activeLocation, setActiveLocation] = useState();
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);

  useEffect(() => {
    let coord = centerCoord.split(",");
    setCenter({
      lat: coord[0],
      lng: coord[1]
    })
  }, [centerCoord]);

  const handleMarkerClick = (marker, item) => {
    setHighLight(item.id);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
    setActiveLocation(item);
  };

  const onMapClicked = () => {
    setHighLight(null);
    setActiveMarker(null);
    setShowingInfoWindow(false);
    setActiveLocation(null);
  };

  return (
    <>
      {center && (
        <Map
          google={google}
          containerStyle={{
            width: '100%',
            height: 'calc(100vh - 170px)'
          }}
          zoomControl={true}
          fullscreenControl={true}
          center={center}
          initialCenter={center}
          disableDefaultUI={true}
          zoom={12}
          onClick={onMapClicked}
        >
          {locations.filter(filterItems).map(item => (
            <Marker position={item}
                    key={item.token_id}
                    onClick={(props, marker) => handleMarkerClick(marker, item)}
            />
          ))}

          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}>
            <div className="relative">
              {activeLocation && (
                <>
                  <a href={`/facility/${activeLocation.token_id}`}>
                    <img src={getMediaUrl(activeLocation.media)} alt="" className="w-64 h-48 object-cover" />
                  </a>
                  <h1 className="w-64 px-4 py-3 text-sm font-normal">
                    <a className="block hover:text-gray-600" href={`/facility/${activeLocation.token_id}`}>{activeLocation.title}</a>
                  </h1>
                  <p
                    className="absolute left-4 top-4 bg-white/75 font-normal rounded-md px-2 py-1 drop-shadow-md ">
                    {statusConfig[activeLocation.status]}
                  </p>
                </>
              )}
            </div>
          </InfoWindow>

        </Map>
      )}
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: googleAPIKey
})(FacilitiesMap)
