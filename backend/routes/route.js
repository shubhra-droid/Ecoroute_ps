const express = require("express");
const axios = require("axios");
const calculateCarbon = require("../utils/carbon");

const router = express.Router();

router.post("/route", async (req, res) => {
  const { start, end, mode } = req.body;

  if (!start || !end || !mode) {
    return res.status(400).json({ error: "Missing start, end, or mode" });
  }

  let startCoords, endCoords;

  try {
    // Geocode start location
    const startGeoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(start)}&format=json&limit=1`;
    const startGeoRes = await axios.get(startGeoUrl, { headers: { "User-Agent": "EcoRoute App" } }); // nominatim requires User-Agent
    if (!startGeoRes.data || startGeoRes.data.length === 0) {
      return res.status(400).json({ error: `Could not find location: ${start}` });
    }
    startCoords = { lat: startGeoRes.data[0].lat, lng: startGeoRes.data[0].lon };

    // Geocode end location
    const endGeoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(end)}&format=json&limit=1`;
    const endGeoRes = await axios.get(endGeoUrl, { headers: { "User-Agent": "EcoRoute App" } });
    if (!endGeoRes.data || endGeoRes.data.length === 0) {
      return res.status(400).json({ error: `Could not find location: ${end}` });
    }
    endCoords = { lat: endGeoRes.data[0].lat, lng: endGeoRes.data[0].lon };

  } catch (geoErr) {
    console.error("Geocoding error:", geoErr.message);
    return res.status(500).json({ error: "Geocoding service failed" });
  }

  // OSRM expects coordinates in lng,lat format
  const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`;

  try {
    const response = await axios.get(url);
    const route = response.data.routes[0];

    // Convert distance to km, duration to minutes
    const distance_km = (route.distance / 1000).toFixed(2);
    const duration_min = (route.duration / 60).toFixed(0);

    // Calculate carbon for requested mode
    const carbon_grams = calculateCarbon(route.distance, mode).toFixed(0);

    // Calculate alternatives
    const alternatives = ["car", "bus", "bike", "walk", "metro"]
      .filter((m) => m !== mode)
      .map((m) => ({
        mode: m,
        carbon_grams: calculateCarbon(route.distance, m).toFixed(0),
        // Simple estimations for duration based on mode (OSRM driving duration is baseline)
        duration_min: m === "bike" ? (duration_min * 3).toFixed(0) : 
                      m === "walk" ? (duration_min * 10).toFixed(0) :
                      m === "bus"  ? (duration_min * 1.5).toFixed(0) :
                      m === "metro" ? (duration_min * 1.2).toFixed(0) :
                      duration_min
      }));

    res.json({
      distance_km,
      duration_min,
      carbon_grams,
      alternatives,
      geometry: route.geometry,
    });
  } catch (err) {
    console.error("Routing error:", err.message);
    res.status(500).json({ error: "Routing failed" });
  }
});

module.exports = router;