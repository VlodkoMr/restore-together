import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { googleAPIKey } from '../near/content';

function OneFacilityMap({ locations, centerCoord, google }) {
  const [center, setCenter] = useState();
  const [zoom, setZoom] = React.useState(14);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleAPIKey
  });

  useEffect(() => {
    let coord = centerCoord.split(",");
    setCenter({
      lat: parseFloat(coord[0]),
      lng: parseFloat(coord[1])
    })
  }, [centerCoord]);

  const onLoad = React.useCallback(function callback(map) {
    if (center) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setTimeout(() => setZoom(12), 300);
    }
  }, [center]);

  return (
    <>
      {center && isLoaded && (
        <GoogleMap
          google={google}
          mapContainerStyle={{
            width: '100%',
            height: '180px'
          }}
          center={center}
          onLoad={onLoad}
          options={{
            draggable: false,
            disableDefaultUI: true,
            clickableIcons: false
          }}
          zoom={zoom}
        >
          {locations.map(item => (
            <Marker position={item} key={item.token_id} />
          ))}
        </GoogleMap>
      )}
    </>
  )
}

export default React.memo(OneFacilityMap)
