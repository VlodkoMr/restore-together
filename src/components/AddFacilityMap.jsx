import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { googleAPIKey } from '../near/content';

function AddFacilityMap({ centerCoord, google, markerLocation, setMarkerLocation }) {
  const [center, setCenter] = useState();

  useEffect(() => {
    let coord = centerCoord.split(",");
    setCenter({
      lat: coord[0],
      lng: coord[1]
    })
  }, [centerCoord]);

  const onMapClicked = (props, e, marker) => {
    setMarkerLocation({
      lat: marker.latLng.lat(),
      lng: marker.latLng.lng(),
    });
    // setCenter({
    //   lat: marker.latLng.lat(),
    //   lng: marker.latLng.lng()
    // });
  };

  return (
    <>
      {center && (
        <Map
          google={google}
          containerStyle={{
            width: '472px',
            height: '180px'
          }}
          center={center}
          initialCenter={center}
          disableDefaultUI={true}
          zoomControl={true}
          fullscreenControl={true}
          zoom={12}
          onClick={onMapClicked}
        >
          {markerLocation && (
            <Marker position={markerLocation} />
          )}
        </Map>
      )}
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: googleAPIKey
})(AddFacilityMap)
