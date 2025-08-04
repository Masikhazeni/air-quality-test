import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ParameterChart from "../../Components/ParameterChart";

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
};

const Search = () => {
  const [position, setPosition] = useState(null);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now()); 
  const intervalRef = useRef(null);
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const fetchWeather = async (coords) => {
    if (!coords) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
      );
      const json = await res.json();
      const idx = 0;
      setAirData({
        aqi: json.hourly.us_aqi?.[idx],
        pm25: json.hourly.pm2_5?.[idx],
        pm10: json.hourly.pm10?.[idx],
        co: json.hourly.carbon_monoxide?.[idx],
        no2: json.hourly.nitrogen_dioxide?.[idx],
        so2: json.hourly.sulphur_dioxide?.[idx],
        o3: json.hourly.ozone?.[idx],
      });
    } catch (err) {
      console.error(err);
      setAirData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (coords) => {
    setPosition(coords);
    fetchWeather(coords);
  };

  useEffect(() => {
    if (position) {
      intervalRef.current = setInterval(() => fetchWeather(position), 60000);
      return () => clearInterval(intervalRef.current);
    }
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 200);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onMapReady = (mapInstance) => {
    mapRef.current = mapInstance.target;
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 0);
  };

  return (
    <Box sx={{ mt: 4, p:{xs:'10px',md:3}, display: "flex", flexDirection: "column", gap: 3 }}>
      
      <Box  sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  borderRadius: 2,
                  boxShadow: "0 0 10px 2px #4381C4",
                  p: { xs: 2, md: 3 },
                  gap: { xs: 2, md: 3 },
                }}>
        <Box 
          sx={{ flex: 1, height: { xs: 300, md: 400 }, minWidth: 0 }}
          ref={mapContainerRef}
        >
          <MapContainer
            key={mapKey} 
            whenReady={onMapReady}
            center={[35.6892, 51.389]}
            zoom={5}
            scrollWheelZoom
            style={{ width: "100%", height: "100%", minHeight: "300px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler onClick={handleMapClick} />
            {position && (
              <Marker position={[position.lat, position.lon]}>
                <Popup>
                  Lat: {position.lat.toFixed(4)}, Lon: {position.lon.toFixed(4)}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>

      
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button
            disabled={!position || loading}
            variant="contained"
            onClick={() => fetchWeather(position)}
            sx={{ mb: 2 }}
          >
            Update
          </Button>
          {loading && <CircularProgress sx={{ my: 2 }} />}
          {airData && (
            <Box sx={{ width: "100%" }}>
              {Object.entries(airData).map(([k, v]) => (
                <Box
                  key={k}
                  onClick={() => setSelectedParameter(k)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    px: 2,
                    borderBottom: "1px solid #ccc",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: "#4381C4" }}>{k.toUpperCase()}</Typography>
<Typography
  sx={{
    fontWeight: "bold",
    color: (() => {
      if (v === null || v === undefined) return "black";
      
      switch(k) {
        case 'aqi':
          if (v <= 50) return '#4CAF50'; 
          if (v <= 150) return '#FFC107'; 
          return '#F44336'; 

        case 'pm25':
          if (v <= 12) return '#4CAF50'; 
          if (v <= 35) return '#FFC107'; 
          return '#F44336'; 

        case 'pm10':
          if (v <= 50) return '#4CAF50'; 
          if (v <= 150) return '#FFC107'; 
          return '#F44336'; 

        case 'no2':
          if (v <= 50) return '#4CAF50'; 
          if (v <= 100) return '#FFC107'; 
          return '#F44336'; 

        case 'so2':
          if (v <= 50) return '#4CAF50'; 
          if (v <= 150) return '#FFC107'; 
          return '#F44336'; 

        case 'o3':
          if (v <= 50) return '#4CAF50'; 
          if (v <= 100) return '#FFC107'; 
          return '#F44336'; 

        case 'co':
          if (v <= 1) return '#4CAF50'; 
          if (v <= 2) return '#FFC107'; 
          return '#F44336'; 

        default:
          return 'black';
      }
    })()
  }}
>
                    {v ?? "--"}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

{selectedParameter && (
  <Box
    sx={{
      p: { xs: 2, md: 3 },
      mx: 'auto',
      width: { xs: '100%', md: '90%' }, 
      maxWidth: '1200px', 
      backgroundColor: "#f5faff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mt: 4,
      borderRadius: "10px",
      boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
      boxSizing: 'border-box', 
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ width: '100%', textAlign: 'center' }}>
      {selectedParameter.toUpperCase()} - Chart (Last 24h)
    </Typography>
    <Box sx={{ width: '100%', p: { xs: 0, md: 1 } }}>
      <ParameterChart city={position} parameter={selectedParameter} />
    </Box>
    <Button 
      onClick={() => setSelectedParameter(null)} 
      variant="outlined" 
      color="error" 
      sx={{ mt: 2, mb: 2 }}
    >
      Close
    </Button>
  </Box>
)}

    </Box>
  );
};

export default Search;