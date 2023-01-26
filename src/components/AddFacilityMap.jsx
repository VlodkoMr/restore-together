import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { googleAPIKey } from '../near/content';

function AddFacilityMap({ centerCoord, google, markerLocation, setMarkerLocation }) {
  const [center, setCenter] = useState();
  const [zoom, setZoom] = React.useState(14);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleAPIKey
  });

  const onLoad = React.useCallback(function callback(map) {
    if (center) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setTimeout(() => setZoom(12), 300);
    }
  }, [center]);

  useEffect(() => {
    if (centerCoord) {
      let coord = centerCoord.split(",");
      setCenter({
        lat: parseFloat(coord[0]),
        lng: parseFloat(coord[1])
      })
    }
  }, [centerCoord]);

  const onMapClicked = (props) => {
    setMarkerLocation({
      lat: parseFloat(props.latLng.lat()),
      lng: parseFloat(props.latLng.lng()),
    });
  };

  return (
    <>
      {center && isLoaded && (
        <GoogleMap
          google={google}
          mapContainerStyle={{
            width: '472px',
            height: '180px'
          }}
          center={center}
          onLoad={onLoad}
          zoom={zoom}
          options={{
            controlSize: true,
            fullscreenControl: true,
            clickableIcons: false
          }}
          onClick={onMapClicked}
        >
          {markerLocation.lat && (
            <Marker position={markerLocation}/>
          )}
        </GoogleMap>
      )}
    </>
  )
}

export default React.memo(AddFacilityMap)
