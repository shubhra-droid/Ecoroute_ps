import React, { useState } from "react";
import { getRoute } from "../../services/api";

function RouteForm({ setRouteData }) {

  const [startLat, setStartLat] = useState("");
  const [startLon, setStartLon] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLon, setEndLon] = useState("");
  const [mode, setMode] = useState("car");

  const handleSubmit = async () => {

    const data = await getRoute(
      startLat,
      startLon,
      endLat,
      endLon,
      mode
    );

    setRouteData(data);
  };

  return (
    <div style={{padding:"30px"}}>

      <h2>Enter Route</h2>

      <input
        placeholder="Start Latitude"
        value={startLat}
        onChange={(e)=>setStartLat(e.target.value)}
      />

      <input
        placeholder="Start Longitude"
        value={startLon}
        onChange={(e)=>setStartLon(e.target.value)}
      />

      <input
        placeholder="End Latitude"
        value={endLat}
        onChange={(e)=>setEndLat(e.target.value)}
      />

      <input
        placeholder="End Longitude"
        value={endLon}
        onChange={(e)=>setEndLon(e.target.value)}
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