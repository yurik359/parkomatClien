import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRef, useEffect } from "react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useSelector } from "react-redux";
import "./map.css";
const Map = () => {
  const {
    formValues: {
      locationValue: {
        coordinate: { lat, lon },
      },
    },
  } = useSelector((state) => state.addParkomatSlice);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const defaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

//  useEffect(() => {
//     if (mapRef.current) {
//       if (markerRef.current) {
//         markerRef.current.remove();
//       }

//       mapRef.current.fitBounds([[lat, lon]]);

//       markerRef.current = L.marker([lat, lon], { icon: defaultIcon }).addTo(
//         mapRef.current
//       );
//     } else {
//       mapRef.current = L.map("map").setView([lat, lon], 13);
//       tileLayerRef.current = L.tileLayer(
//         "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         {
//           attribution: "",
//         }
//       ).addTo(mapRef.current);
//     }
//   }, [lat, lon]); 
useEffect(() => {
  // Создаем карту, указывая DOM-элемент, в котором будет отображаться карта
  if (!mapRef.current){
  mapRef.current = L.map("map").setView([51.505, -0.09], 13);

  // Добавляем слой тайлов OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; OpenStreetMap contributors",
  }).addTo(mapRef.current);
}
}, []);

  return (
    // <MapContainer center={[48.8566,2.3522]} zoom={13}>
    //  <TileLayer
    //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //   />
    // </MapContainer>
    <div id="map" style={{ height: "100px", width: "100%" }}></div>
  );
};

export default Map;
