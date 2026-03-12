import React, { useState } from "react";
import { getRoute } from "../../services/api";

function RouteForm({ setRouteData }) {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!source.trim() || !destination.trim()) {
      setError("Please enter both a source and destination.");
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      const data = await getRoute(
        source,
        destination
      );
      setRouteData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:"30px"}}>

      <h2>Enter Route</h2>

      <div style={{marginBottom: "10px"}}>
        <label style={{marginRight: "10px"}}>Source</label>
        <input 
          type="text"
          value={source} 
          onChange={(e) => { setSource(e.target.value); setRouteData(null); }}
          placeholder="e.g. New York"
          style={{padding: "5px", width: "200px"}}
        />
      </div>

      <div style={{marginBottom: "10px"}}>
        <label style={{marginRight: "10px"}}>Destination</label>
        <input 
          type="text"
          value={destination} 
          onChange={(e) => { setDestination(e.target.value); setRouteData(null); }}
          placeholder="e.g. Los Angeles"
          style={{padding: "5px", width: "200px"}}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{marginTop: "10px", padding: "5px 15px"}}>
        {loading ? "Searching..." : "Find Route"}
      </button>

      {error && <p style={{color: "red", marginTop: "10px"}}>{error}</p>}

    </div>
  );
}

export default RouteForm;