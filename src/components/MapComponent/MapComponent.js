import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons not showing by default in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ bounds }) {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  return null;
}

function MapComponent({ routeData }) {
  if (!routeData) {
    return (
      <div style={{ padding: "0 30px" }}>
        <MapContainer center={[22.5937, 78.9629]} zoom={4} style={{ height: "400px", width: "100%", borderRadius: "8px" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />
        </MapContainer>
      </div>
    );
  }

  const { sourceCity, destCity, geometry } = routeData;

  // GeoJSON coordinates are in [lng, lat], but Leaflet Polyline expects [lat, lng]
  const positions = geometry.coordinates.map(coord => [coord[1], coord[0]]);
  
  const bounds = L.latLngBounds([sourceCity.coords, destCity.coords]);

  return (
    <div style={{ padding: "0 30px" }}>
      <MapContainer bounds={bounds} style={{ height: "400px", width: "100%", borderRadius: "8px" }}>
        <ChangeView bounds={bounds} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={sourceCity.coords}>
          <Popup>{sourceCity.name} (Source)</Popup>
        </Marker>
        <Marker position={destCity.coords}>
          <Popup>{destCity.name} (Destination)</Popup>
        </Marker>
        <Polyline positions={positions} color="blue" weight={5} />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
