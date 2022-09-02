import React, { useState, useEffect } from "react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { googleAPIKey, statusColorMap, statusConfig } from '../near/content';
import { getMediaUrl } from '../near/utils';

function FacilitiesMap({ locations, centerCoord, setHighLight, filterItems, google }) {
  const [center, setCenter] = useState();
  const [zoom, setZoom] = React.useState(14)
  const [activeMarker, setActiveMarker] = useState();
  const [activeLocation, setActiveLocation] = useState();
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleAPIKey
  })

  useEffect(() => {
    let coord = centerCoord.split(",");
    setCenter({
      lat: parseFloat(coord[0]),
      lng: parseFloat(coord[1])
    });
  }, [centerCoord]);

  const onLoad = React.useCallback(function callback(map) {
    if (center) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setTimeout(() => setZoom(12), 300);
    }
  }, [center]);

  const handleMarkerClick = (marker, item) => {
    setHighLight(item.token_id);
    setActiveMarker({
      lat: item.lat + 0.005,
      lng: item.lng,
    });
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
      {center && isLoaded && (
        <GoogleMap
          google={google}
          mapContainerStyle={{
            width: '100%',
            height: 'calc(100vh - 160px)'
          }}
          onLoad={onLoad}
          center={center}
          zoom={zoom}
          onClick={onMapClicked}
          options={{
            mapTypeControl: false,
            clickableIcons: false,
            zoomControl: true,
          }}
        >
          {locations.filter(filterItems).map(item => (
            <Marker position={item}
                    key={item.token_id}
                    onClick={(props, marker) => handleMarkerClick(marker, item)}
            />
          ))}

          {activeMarker && (
            <InfoWindow
              position={activeMarker}
              visible={showingInfoWindow}>
              <div className="relative">
                {activeLocation && (
                  <>
                    <a href={`/facility/${activeLocation.token_id}`}>
                      <img src={getMediaUrl(activeLocation.media)} alt="" className="w-64 h-48 object-cover" />
                    </a>
                    <h1 className="w-64 px-4 py-3 text-sm font-medium">
                      <a className="block hover:text-gray-600"
                         href={`/facility/${activeLocation.token_id}`}>{activeLocation.title}</a>
                    </h1>
                    <p
                      className={`absolute left-4 top-4 font-medium rounded-md px-2 py-1 drop-shadow-md  ${statusColorMap[activeLocation.status]}`}>
                      {statusConfig[activeLocation.status]}
                    </p>
                  </>
                )}
              </div>
            </InfoWindow>
          )}


        </GoogleMap>
      )}
    </>
  )
}

export default React.memo(FacilitiesMap)
