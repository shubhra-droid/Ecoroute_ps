import { CITIES } from "../utils/cities";

export async function getRoute(sourceName, destinationName, mode) {
  const sourceCity = CITIES.find(c => c.name === sourceName);
  const destCity = CITIES.find(c => c.name === destinationName);

  if (!sourceCity || !destCity) {
    throw new Error("Invalid source or destination city");
  }

  // OSRM mapping: car -> driving, bike -> cycling, walk -> walking
  let osrmMode = "driving";
  if (mode === "bike") osrmMode = "cycling";
  if (mode === "walk") osrmMode = "walking";

  // OSRM expects coordinates in lng,lat
  const startStr = `${sourceCity.coords[1]},${sourceCity.coords[0]}`;
  const endStr = `${destCity.coords[1]},${destCity.coords[0]}`;

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/${osrmMode}/${startStr};${endStr}?overview=full&geometries=geojson`
  );

  const data = await response.json();
  
  if (data.code !== "Ok") {
    throw new Error("Unable to fetch route from OSRM");
  }

  const route = data.routes[0];
  const distance_km = (route.distance / 1000).toFixed(2);
  const duration_min = Math.round(route.duration / 60);
  
  // mock carbon emission
  let carbonMultiplier = 0;
  if (mode === "car") carbonMultiplier = 120; // g per km
  if (mode === "bike") carbonMultiplier = 40; 
  if (mode === "walk") carbonMultiplier = 0;
  
  const carbon_grams = Math.round(distance_km * carbonMultiplier);

  return {
    distance_km,
    duration_min,
    carbon_grams,
    geometry: route.geometry, // GeoJSON format coordinates
    sourceCity,
    destCity
  };
}