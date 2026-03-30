"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue with bundlers
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  ip: string;
  lat: number;
  lon: number;
  city: string;
  region: string;
  country: string;
}

export default function EventMap({ locations }: { locations: Location[] }) {
  if (locations.length === 0) return null;

  const center: [number, number] =
    locations.length === 1
      ? [locations[0].lat, locations[0].lon]
      : [
          locations.reduce((s, l) => s + l.lat, 0) / locations.length,
          locations.reduce((s, l) => s + l.lon, 0) / locations.length,
        ];

  return (
    <MapContainer
      center={center}
      zoom={locations.length === 1 ? 10 : 4}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.ip} position={[loc.lat, loc.lon]} icon={icon}>
          <Popup>
            <span className="text-xs">
              {loc.city}, {loc.region}
              <br />
              <span className="font-mono">{loc.ip}</span>
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
