import React, { useState } from "react";
import { getRoute } from "../../services/api";

function RouteForm({ setRouteData }) {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("car");

  const handleSubmit = async () => {
    const data = await getRoute(
      source,
      destination,
      mode
    );

    setRouteData(data);
  };

  return (
    <div style={{padding:"30px"}}>

      <h2>Enter Route</h2>

      <input
        placeholder="Source"
        value={source}
        onChange={(e)=>setSource(e.target.value)}
      />

      <input
        placeholder="Destination"
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