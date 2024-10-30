// WorldMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 可以根据需要定义国家的坐标
const countryCoordinates = {
  "美国": [37.0902, -95.7129],
  "加拿大": [56.1304, -106.3468],
  "中国": [35.8617, 104.1954],
  "英国": [55.3781, -3.4360],
  "法国": [46.6034, 1.8883],
  "德国": [51.1657, 10.4515],
  "日本": [36.2048, 138.2529],
  "印度": [20.5937, 78.9629],
  "巴西": [-14.2350, -51.9253],
  "俄罗斯": [61.5240, 105.3188],
  "澳大利亚": [-25.2744, 133.7751],
  "南非": [-30.5595, 22.9375],
  "意大利": [41.8719, 12.5674],
  "西班牙": [40.4637, -3.7492],
  "墨西哥": [23.6345, -102.5528],
  "新加坡": [1.3521, 103.8198],
  "阿根廷": [-38.4161, -63.6167],
  "瑞士": [46.8182, 8.2275],
  "瑞典": [60.1282, 18.6435],
  "挪威": [60.4720, 8.4689],
  "新西兰": [-40.9006, 174.8860],
  "土耳其": [38.9637, 35.2433],
  "沙特阿拉伯": [23.8859, 45.0792],
  "阿联酋": [23.4241, 53.8478],
  "波兰": [51.9194, 19.1451],
  "泰国": [15.8700, 100.9925],
  "越南": [14.0583, 108.2772],
  "马来西亚": [4.2105, 101.9758],
  "菲律宾": [12.8797, 121.7740],
  "印度尼西亚": [-0.7893, 113.9213],
  "伊朗": [32.4279, 53.6880],
  "哥伦比亚": [4.5709, -74.2973],
  "智利": [-35.6751, -71.5429],
  "秘鲁": [-9.1900, -75.0152],
  "乌克兰": [48.3794, 31.1656],
  "以色列": [31.0461, 34.8516],
  "巴基斯坦": [30.3753, 69.3451],
  "捷克共和国": [49.8175, 15.4730],
  "匈牙利": [47.1625, 19.5033],
  "希腊": [39.0742, 21.8243],
  "南韩": [35.9078, 127.7669],
  "丹麦": [56.2639, 9.5018],
  "芬兰": [61.9241, 25.7482],
  "冰岛": [64.9631, -19.0208],
};

const WorldMap = ({ selectedCountries }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.keys(countryCoordinates).map((country) => {
        const position = countryCoordinates[country];
        return (
          <Marker
            key={country}
            position={position}
            icon={L.divIcon({ className: selectedCountries.includes(country) ? 'highlight-marker' : 'default-marker' })}
          >
            <Popup>{country}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default WorldMap;
