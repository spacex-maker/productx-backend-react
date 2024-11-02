// WorldMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const WorldMap = ({ countries }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {countries.map((country) => {
        // Parse coordinates string to [latitude, longitude] array
        const position = country.coordinates
          ? country.coordinates.split(',').map(Number)
          : [0, 0]; // Default to [0,0] if coordinates are missing
        return (
          <Marker
            key={country}
            position={position}
            icon={L.divIcon({ className: country.status ? 'highlight-marker' : 'default-marker' })}
          >
            <Popup>{country}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default WorldMap;
