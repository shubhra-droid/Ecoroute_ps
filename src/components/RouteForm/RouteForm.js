import React, { useState } from "react";
import { getRoute } from "../../services/api";
import { CITIES } from "../../utils/cities";

function RouteForm({ setRouteData }) {

  const [source, setSource] = useState(CITIES[0].name);
  const [destination, setDestination] = useState(CITIES[1].name);
  const [mode, setMode] = useState("car");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const data = await getRoute(
        source,
        destination,
        mode
      );
      setRouteData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch route. Please try again.");
    }
  };

  return (
    <div style={{padding:"30px"}}>

      <h2>Enter Route</h2>

      <div style={{marginBottom: "10px"}}>
        <label style={{marginRight: "10px"}}>Source</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          {CITIES.map((city) => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
      </div>

      <div style={{marginBottom: "10px"}}>
        <label style={{marginRight: "10px"}}>Destination</label>
        <select value={destination} onChange={(e) => setDestination(e.target.value)}>
          {CITIES.map((city) => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
      </div>

      <div style={{marginBottom: "10px"}}>
        <label style={{marginRight: "10px"}}>Mode</label>
        <select
          value={mode}
          onChange={(e)=>setMode(e.target.value)}
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="walk">Walk</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={{marginTop: "10px", padding: "5px 15px"}}>
        Find Route
      </button>

      {error && <p style={{color: "red", marginTop: "10px"}}>{error}</p>}

    </div>
  );
}

export default RouteForm;