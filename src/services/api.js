export async function getRoute(
  startLat,
  startLon,
  endLat,
  endLon,
  mode
) {

  const response = await fetch(
    `http://localhost:8000/route?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}&mode=${mode}`
  );

  const data = await response.json();

  return data;
}