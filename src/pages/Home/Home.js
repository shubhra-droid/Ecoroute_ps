import React, { useState } from "react";
import Header from "../../components/Header/Header";
import RouteForm from "../../components/RouteForm/RouteForm";
import RouteResult from "../../components/RouteResult/RouteResult";
import Footer from "../../components/Footer/Footer";

function Home() {

  const [routeData, setRouteData] = useState(null);

  return (
    <div>

      <Header />

      <RouteForm setRouteData={setRouteData} />

      <RouteResult routeData={routeData} />

      <Footer />

    </div>
  );
}

export default Home;