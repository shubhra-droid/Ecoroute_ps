import React from "react";

function RouteResult({ routeData }) {
  if (!routeData) return null;

  return (
    <div style={{ padding: "30px", marginTop: "20px", borderTop: "2px solid #eaeaea" }}>
      <h2>Route Details</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <strong>Distance:</strong> {routeData.distance_km} km
        </div>
        <div>
          <strong>Time:</strong> {routeData.duration_min} mins
        </div>
        <div>
          <strong>Carbon:</strong> {routeData.carbon_grams} g CO₂
        </div>
      </div>

      {routeData.alternatives && routeData.alternatives.length > 0 && (
        <>
          <h3>Sustainable Alternatives 🌱</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {routeData.alternatives.map((alt) => (
              <li key={alt.mode} style={{ 
                padding: "10px", 
                margin: "10px 0", 
                backgroundColor: "#f4fff4", 
                borderRadius: "8px",
                border: "1px solid #c2e5c2"
              }}>
                <strong>{alt.mode.toUpperCase()}:</strong> {alt.duration_min} mins | {alt.carbon_grams} g CO₂ 
                {alt.carbon_grams == 0 && " ✨ (Zero Emissions Component!)"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default RouteResult;