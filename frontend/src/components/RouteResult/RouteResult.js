import React from "react";

function RouteResult({ routeData }) {

  if(!routeData) return null;

  return (
    <div style={{padding:"30px"}}>

      <h2>Route Details</h2>

      <p>Distance: {routeData.distance_km} km</p>

      <p>Time: {routeData.duration_min} minutes</p>

      <p>Carbon: {routeData.carbon_grams} g CO₂</p>

    </div>
  );
}

export default RouteResult;