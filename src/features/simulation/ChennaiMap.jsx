import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

// Accent colors for different slide references
const SLIDE_COLORS = ['#f5a623', '#c85250', '#2d9b6f', '#7b5ea7', '#4a6fa5', '#d4547a'];

function createColoredIcon(color) {
  return L.divIcon({
    html: `<div style="
      width: 20px; height: 20px;
      background: ${color};
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      box-shadow: 0 0 8px ${color}80;
    "></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14]
  });
}

export default function ChennaiMap({ locations = [] }) {
  const validLocations = locations.filter(l => l.lat && l.lng);

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
        <div className="text-center">
          <p className="text-4xl mb-2">🗺️</p>
          <p className="text-[#9a8a78] text-sm">Chennai, Tamil Nadu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[#2a2a2a]">
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {validLocations.map((loc, i) => {
          const color = SLIDE_COLORS[(loc.slide_reference - 1) % SLIDE_COLORS.length];
          return (
            <Marker
              key={i}
              position={[loc.lat, loc.lng]}
              icon={createColoredIcon(color)}
            >
              <Popup>
                <div className="text-sm font-semibold">{loc.name}</div>
                {loc.note && <div className="text-xs mt-1 opacity-80">{loc.note}</div>}
                {loc.slide_reference && (
                  <div className="text-xs mt-1" style={{ color }}>
                    Slide {loc.slide_reference}
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
