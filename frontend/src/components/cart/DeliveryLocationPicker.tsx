import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}

const DEFAULT_POSITION: [number, number] = [14.7167, -17.4677]; // Dakar par défaut

export default function DeliveryLocationPicker({ onLocationSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        onLocationSelect({ lat: coords[0], lng: coords[1] });
      },
      () => {
        
      }
    );
  }, []);

  
  function DraggableMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });

    if (!position) return null;
    return (
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target as L.Marker;
            const latlng = marker.getLatLng();
            setPosition([latlng.lat, latlng.lng]);
            onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
          },
        }}
      />
    );
  }

  return (
    <MapContainer
      center={position || DEFAULT_POSITION}
      zoom={13}
      style={{ height: 300, width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker />
    </MapContainer>
  );
}
