import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

function OneFacilityMap({ locations, centerCoord, google }) {
  const [center, setCenter] = useState();

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
            height: '180px'
          }}
          center={center}
          initialCenter={center}
          disableDefaultUI={true}
          zoom={14}
        >
          {locations.map(item => (
            <Marker position={item} key={item.id} />
          ))}
        </Map>
      )}
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyABJhkerDplCjq7Een9GZgE3JtI3XxuRqw"
})(OneFacilityMap)
