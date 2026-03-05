import React from "react";
import MapSelector from "./components/MapSelector";
import "./App.css";

function App(){

  return(

    <div>

      <header className="header">
        Smart Sustainable Travel Planner
      </header>

      <div className="container">

        <h2>Select Route on Map</h2>

        <MapSelector/>

      </div>

      <footer className="footer">
        EcoRoute © 2026
      </footer>

    </div>
  );
}

export default App;