export async function getRoute(sourceName, destinationName) {
  const getCoordinates = async (name) => {
    try {
      // Use Nominatim to geocode text into coordinates
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          name: data[0].display_name.split(',')[0],
          coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        };
      }
      return null;
    } catch (e) {
      console.error("Geocoding error:", e);
      return null;
    }
  };

  const sourceCity = await getCoordinates(sourceName);
  const destCity = await getCoordinates(destinationName);

  if (!sourceCity || !destCity) {
    throw new Error("Could not find coordinates for the given locations. Try adding a state or country.");
  }

  const startStr = `${sourceCity.coords[1]},${sourceCity.coords[0]}`;
  const endStr = `${destCity.coords[1]},${destCity.coords[0]}`;

  const modesInfo = [
    { mode: "walk", osrmMode: "walking", baseEcoScore: 100, carbonMultiplier: 0 },
    { mode: "bike", osrmMode: "cycling", baseEcoScore: 80, carbonMultiplier: 40 },
    { mode: "car", osrmMode: "driving", baseEcoScore: 30, carbonMultiplier: 120 }
  ];

  const fetchRouteForMode = async (modeInfo) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${modeInfo.osrmMode}/${startStr};${endStr}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.code !== "Ok") {
        return null;
      }

      const route = data.routes[0];
      const distance_km = (route.distance / 1000).toFixed(2);
      const duration_min = Math.round(route.duration / 60);

      // Filter out unreasonable modes
      if (modeInfo.mode === "walk" && duration_min > 120) return null;
      if (modeInfo.mode === "bike" && duration_min > 300) return null;
      
      const carbon_grams = Math.round(distance_km * modeInfo.carbonMultiplier);

      return {
        mode: modeInfo.mode,
        distance_km,
        duration_min,
        carbon_grams,
        ecoScore: modeInfo.baseEcoScore,
        geometry: route.geometry,
        sourceCity,
        destCity
      };
    } catch (err) {
      return null;
    }
  };

  const results = await Promise.all(modesInfo.map(fetchRouteForMode));
  const validModes = results.filter(result => result !== null);

  if (validModes.length === 0) {
    throw new Error("Unable to fetch routes for any mode");
  }

  // Select the mode with the highest eco score
  validModes.sort((a, b) => b.ecoScore - a.ecoScore);
  const bestMode = validModes[0];

  return bestMode;
}