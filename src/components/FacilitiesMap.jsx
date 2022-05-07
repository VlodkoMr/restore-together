import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

function FacilitiesMap({ locations, centerCoord, google }) {
  const [center, setCenter] = useState();

  // useEffect(() => {
  // }, [locations]);

  useEffect(() => {
    let coord = centerCoord.split(",");
    setCenter({
      lat: coord[0],
      lng: coord[1]
    })
  }, [centerCoord]);

  return (
    <>
      {center && (
        <Map
          google={google}
          containerStyle={{
            width: '100%',
            height: 'calc(100vh - 176px)'
          }}
          center={center}
          initialCenter={center}
          zoom={11}
          disableDefaultUI={true}
        >
          {locations.map(marker => (
            <Marker position={marker} key={marker.id} />
          ))}
        </Map>
      )}
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyABJhkerDplCjq7Een9GZgE3JtI3XxuRqw"
})(FacilitiesMap)