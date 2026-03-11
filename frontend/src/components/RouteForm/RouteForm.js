import React, { useState } from "react";
import { getRoute } from "../../services/api";

const getCoordinates = async (place) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
  );
  const data = await res.json();

  if (data && data.length > 0) {
    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  }
  return null;
};

function RouteForm({ setRouteData }) {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("car");

  const handleSubmit = async () => {
    const start = await getCoordinates(source);
    const end = await getCoordinates(destination);

    console.log("Start:", start);
    console.log("End:", end);

    if (start && end) {
      // Backend expects start: { lat, lng } but getCoordinates returns { lat, lon }
      const startPayload = { lat: start.lat, lng: start.lon };
      const endPayload = { lat: end.lat, lng: end.lon };

      const data = await getRoute(
        startPayload,
        endPayload,
        mode
      );

      setRouteData(data);
    } else {
      alert("Could not find coordinates for the provided locations. Please try again.");
    }
  };

  return (
    <div style={{padding:"30px"}}>

      <h2>Enter Route</h2>

      <input
        type="text"
        placeholder="Enter Source City"
        value={source}
        onChange={(e)=>setSource(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Destination City"
        value={destination}
        onChange={(e)=>setDestination(e.target.value)}
      />

      <select
        value={mode}
        onChange={(e)=>setMode(e.target.value)}
      >
        <option value="car">Car</option>
        <option value="bike">Bike</option>
        <option value="walk">Walk</option>
      </select>

      <button onClick={handleSubmit}>
        Find Route
      </button>

    </div>
  );
}

export default RouteForm;