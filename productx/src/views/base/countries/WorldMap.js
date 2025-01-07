// WorldMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 导入 Leaflet 图标资源
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// 修复 Leaflet 默认图标问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const WorldMap = ({ data }) => {
  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: '500px', width: '100%' }}
      minZoom={2}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data && data.map((country) => {
        if (!country.status) return null;
        const [lat, lng] = country.coordinates ? country.coordinates.split(',').map(Number) : [0, 0];
        return (
          <Marker
            key={country.id}
            position={[lat, lng]}
          >
            <Popup>
              {country.name}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default WorldMap;
