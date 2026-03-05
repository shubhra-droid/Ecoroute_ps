import React,{useState} from "react";
import {MapContainer,TileLayer,Marker,Popup,useMapEvents,Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({setStart,setEnd,start,end}){

  useMapEvents({
    click(e){

      if(!start){
        setStart(e.latlng);
      }
      else if(!end){
        setEnd(e.latlng);
      }
    }
  });

  return (
    <>
      {start && (
        <Marker position={start}>
          <Popup>Start Location</Popup>
        </Marker>
      )}

      {end && (
        <Marker position={end}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </>
  );
}

export default function MapSelector(){

  const [start,setStart] = useState(null);
  const [end,setEnd] = useState(null);

  return(

    <div style={{height:"500px",width:"100%"}}>

      <MapContainer
        center={[13.0827,80.2707]}
        zoom={13}
        style={{height:"100%",width:"100%"}}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
        />

        {start && end && (
          <Polyline
            positions={[start,end]}
          />
        )}

      </MapContainer>

      <div style={{marginTop:"10px"}}>

        <p>Start: {start ? `${start.lat}, ${start.lng}` : "Click map"}</p>

        <p>End: {end ? `${end.lat}, ${end.lng}` : "Click map again"}</p>

      </div>

    </div>
  );
}