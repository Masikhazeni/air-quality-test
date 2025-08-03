// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import { useState } from "react";
// import "leaflet/dist/leaflet.css";
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
// } from "@mui/material";


// const ClickHandler = ({ onClick }) => {
//   useMapEvents({
//     click: (e) => {
//       const { lat, lng } = e.latlng;
//       onClick({ lat, lon: lng });
//     },
//   });
//   return null;
// };

// const ApiQualityApp = () => {
//   const [position, setPosition] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [airData, setAirData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchWeather = async (coords) => {
//     setLoading(true);
//     try {
//       // Fetch weather
//       const weatherRes = await fetch(
//         `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weathercode,wind_speed_10m`
//       );
//       const weatherData = await weatherRes.json();
//       setWeather(weatherData.current);

//       // Fetch air quality
//       const airRes = await fetch(
//         `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
//       );
//       const airJson = await airRes.json();
//       const index = 0;

//       setAirData({
//         aqi: airJson.hourly.us_aqi?.[index],
//         pm25: airJson.hourly.pm2_5?.[index],
//         pm10: airJson.hourly.pm10?.[index],
//         co: airJson.hourly.carbon_monoxide?.[index],
//         no2: airJson.hourly.nitrogen_dioxide?.[index],
//         so2: airJson.hourly.sulphur_dioxide?.[index],
//         o3: airJson.hourly.ozone?.[index],
//       });
//     } catch (error) {
//       console.error("خطا در دریافت اطلاعات:", error);
//       setWeather(null);
//       setAirData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMapClick = (coords) => {
//     setPosition(coords);
//     fetchWeather(coords);
//   };

//   return (
//     <>
//       <Box
//         component={"nav"}
//         sx={{
//           width: "100%",
//           height: "110px",
//           display:'flex',
//           justifyContent:'center',
//           alignItems:'center',
//           background:
//             "linear-gradient(107deg,rgba(65, 185, 232, 1) 0%, rgba(67, 129, 196, 1) 52%)",
//         }}
//       >
//            <Typography 
//       variant="h1"
//       sx={{
//         fontSize: { xs: "32px", md: "42px" },
//         color: "white",
//         textShadow: "1px 1px 2px darkblue",
//         transition: "all 0.3s ease-in-out",
//         "&:hover": {
//           transform: "scale(1.1)",
//           textShadow: "2px 2px 4px rgba(0, 0, 139, 0.5)"
//         }
//       }}
//     >
//       Air Quality
//       <LocationOnIcon sx={{fontSize:'40',color:'blue'}}/>
//     </Typography>
    
//       </Box>
//       <Box mt={4}>
//         <Typography variant="h5" gutterBottom>
//           روی نقشه کلیک کنید تا اطلاعات آب‌وهوا و آلودگی هوا نمایش داده شود:
//         </Typography>

//         <Box height="500px" mb={3}>
//           <MapContainer
//             center={[35.6892, 51.389]}
//             zoom={5}
//             scrollWheelZoom={true}
//             style={{ height: "100%", width: "100%" }}
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             <ClickHandler onClick={handleMapClick} />

//             {position && (
//               <Marker position={[position.lat, position.lon]}>
//                 <Popup>
//                   مختصات: {position.lat.toFixed(4)}, {position.lon.toFixed(4)}
//                 </Popup>
//               </Marker>
//             )}
//           </MapContainer>
//         </Box>

//         {loading && <CircularProgress />}

//         {(weather || airData) && !loading && (
//           <Card variant="outlined">
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 اطلاعات موقعیت انتخاب‌شده:
//               </Typography>

//               {weather && (
//                 <>
//                   <Typography variant="subtitle1">آب‌وهوا:</Typography>
//                   <List dense>
//                     <ListItem>
//                       <ListItemText
//                         primary={`دما: ${weather.temperature_2m} °C`}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemText
//                         primary={`سرعت باد: ${weather.wind_speed_10m} km/h`}
//                       />
//                     </ListItem>
//                   </List>
//                   <Divider sx={{ my: 1 }} />
//                 </>
//               )}

//               {airData && (
//                 <>
//                   <Typography variant="subtitle1">کیفیت هوا:</Typography>
//                   <List dense>
//                     <ListItem>
//                       <ListItemText
//                         primary={`شاخص کیفیت هوا (AQI): ${airData.aqi ?? "--"}`}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemText
//                         primary={`PM2.5: ${airData.pm25 ?? "--"}`}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemText primary={`PM10: ${airData.pm10 ?? "--"}`} />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemText
//                         primary={`CO (مونوکسید کربن): ${airData.co ?? "--"}`}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemText
//                         primary={`NO2 (دی‌اکسید نیتروژن): ${
//                           airData.no2 ?? "--"
//                         }`}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemText
//                         primary={`SO2 (دی‌اکسید گوگرد): ${airData.so2 ?? "--"}`}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemText
//                         primary={`O3 (ازن): ${airData.o3 ?? "--"}`}
//                       />
//                     </ListItem>
//                   </List>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </Box>
//     </>
//   );
// };

// export default ApiQualityApp;





import { useEffect, useState } from "react";
import { countries } from "./countries";
import MapView from "../Components/MapView";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function ApiQualityApp() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.name === e.target.value);
    setSelectedCountry(country);
    setSelectedCity(null);
    setWeather(null);
    setAirData(null);
  };

  const handleCityChange = (e) => {
    const city = selectedCountry?.cities.find((c) => c.name === e.target.value);
    setSelectedCity(city);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCity) return;
      setLoading(true);
      try {
        const { lat, lon } = selectedCity;

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.current);

        const airRes = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
        );
        const airJson = await airRes.json();
        const index = 0;

        setAirData({
          aqi: airJson.hourly.us_aqi?.[index],
          pm25: airJson.hourly.pm2_5?.[index],
          pm10: airJson.hourly.pm10?.[index],
          co: airJson.hourly.carbon_monoxide?.[index],
          no2: airJson.hourly.nitrogen_dioxide?.[index],
          so2: airJson.hourly.sulphur_dioxide?.[index],
          o3: airJson.hourly.ozone?.[index],
        });
      } catch (err) {
        console.error("خطا در دریافت اطلاعات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          انتخاب کشور و شهر
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="country-select-label">کشور</InputLabel>
              <Select
                labelId="country-select-label"
                label="کشور"
                onChange={handleCountryChange}
                value={selectedCountry?.name || ""}
                 sx={{width:'150px'}}
              >
                <MenuItem value="" disabled>
                  یک کشور انتخاب کنید
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            {selectedCountry && (
              <FormControl fullWidth>
                <InputLabel id="city-select-label">شهر</InputLabel>
                <Select
                  labelId="city-select-label"
                  label="شهر"
                  onChange={handleCityChange}
                  value={selectedCity?.name || ""}
                  sx={{width:'150px'}}
                >
                  <MenuItem value="" disabled>
                    یک شهر انتخاب کنید
                  </MenuItem>
                  {selectedCountry.cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>

        {/* نقشه و اطلاعات */}
        {selectedCity && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ height: "400px", mb: 3 }}>
              <MapView city={selectedCity} />
            </Box>

            {loading && <CircularProgress />}

            {!loading && (weather || airData) && (
              <>
                <Typography variant="h6" gutterBottom>
                  اطلاعات آب‌وهوا و کیفیت هوا:
                </Typography>
                <List dense>
                  {weather && (
                    <>
                      <ListItem>
                        <ListItemText primary={`دما: ${weather.temperature_2m} °C`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`سرعت باد: ${weather.wind_speed_10m} km/h`} />
                      </ListItem>
                      <Divider />
                    </>
                  )}

                  {airData && (
                    <>
                      <ListItem>
                        <ListItemText primary={`شاخص کیفیت هوا (AQI): ${airData.aqi ?? "--"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`PM2.5: ${airData.pm25 ?? "--"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`PM10: ${airData.pm10 ?? "--"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`CO (مونوکسید کربن): ${airData.co ?? "--"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`NO2 (دی‌اکسید نیتروژن): ${airData.no2 ?? "--"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`SO2 (دی‌اکسید گوگرد): ${airData.so2 ?? "--"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`O3 (ازن): ${airData.o3 ?? "--"}`} />
                      </ListItem>
                    </>
                  )}
                </List>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ApiQualityApp;
