import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

function AddFacilityMap({ centerCoord, google }) {
  const [center, setCenter] = useState();
  const [tmpMarker, setTmpMarker] = useState();

  useEffect(() => {
    let coord = centerCoord.split(",");
    setCenter({
      lat: coord[0],
      lng: coord[1]
    })
  }, [centerCoord]);

  const onMapClicked = (props, e, marker) => {
    setTmpMarker({
      lat: marker.latLng.lat(),
      lng: marker.latLng.lng(),
    });
    setCenter({
      lat: marker.latLng.lat(),
      lng: marker.latLng.lng()
    });
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
          {tmpMarker && (
            <Marker position={tmpMarker} />
          )}
        </Map>
      )}
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyABJhkerDplCjq7Een9GZgE3JtI3XxuRqw"
})(AddFacilityMap)
