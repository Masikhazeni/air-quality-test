// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import { useState } from "react";
// import "leaflet/dist/leaflet.css";
// import {
//   Box,
//   Typography,
//   CircularProgress,
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

// const Search = () => {
//   const [position, setPosition] = useState(null);
//   const [airData, setAirData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchWeather = async (coords) => {
//     setLoading(true);
//     try {

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

//       <Box sx={{
//               mt: 4,
//               display: "flex",
//               flexDirection: { xs: "column", md: "row" },
//               minHeight: "200px",
//               borderRadius: 2,
//               boxShadow: "0 0 10px 2px #4381C4",
//               p: { xs: 2, md: 3 },
//               gap: { xs: 2, md: 3 },
//             }}>

//         <Box  sx={{
//                 width: { xs: "100%", md: "55%" },
//                 height: { xs: "300px", md: "400px" },
//                 pr: { xs: 0, md: 2 },
//               }}>
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

//          {!loading && airData && (
//               <Box
//                 sx={{
//                   width: { xs: "95%", md: "40%" },
//                   minHeight: { xs: "auto", md: "100%" },
//                   py: "15px",
//                   px: "10px",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{ textAlign: "center", color: "#4381C4" }}
//                 >
//                   Air Quality Information
//                 </Typography>

//                 <Box
//                   component="table"
//                   sx={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     margin: "20px 0",
//                     fontFamily: "Arial, sans-serif",
//                   }}
//                 >
//                   {airData &&  (
//                     <>
//                       <Box component="thead">
//                         <Box component="tr" sx={{ backgroundColor: "#f5f5f5" }}>
//                           <Box
//                             component="th"
//                             sx={{
//                               padding: "12px 15px",
//                               textAlign: "left",
//                               borderBottom: "2px solid #ddd",
//                               fontWeight: "bold",
//                               color: "#4381C4",
//                             }}
//                           >
//                             Parameter
//                           </Box>
//                           <Box
//                             component="th"
//                             sx={{
//                               padding: "12px 15px",
//                               textAlign: "left",
//                               borderBottom: "2px solid #ddd",
//                               fontWeight: "bold",
//                               color: "#4381C4",
//                             }}
//                           >
//                             Value
//                           </Box>
//                         </Box>
//                       </Box>
//                       <Box component="tbody">
//                         <Box
//                           component="tr"
//                           sx={{
//                             "&:nth-of-type(odd)": {
//                               backgroundColor: "#f9f9f9",
//                             },
//                             "&:hover": { backgroundColor: "#f1f1f1" },
//                           }}
//                         >
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               fontWeight: "500",
//                             }}
//                           >
//                             AQI
//                           </Box>
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               color:
//                                 airData.aqi <= 50
//                                   ? "green"
//                                   : airData.aqi <= 100
//                                   ? "orange"
//                                   : "red",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {airData.aqi ?? "--"}
//                           </Box>
//                         </Box>

//                         <Box
//                           component="tr"
//                           sx={{
//                             "&:nth-of-type(odd)": {
//                               backgroundColor: "#f9f9f9",
//                             },
//                             "&:hover": { backgroundColor: "#f1f1f1" },
//                           }}
//                         >
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               fontWeight: "500",
//                             }}
//                           >
//                             PM2.5
//                           </Box>
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               color:
//                                 airData.pm25 <= 12
//                                   ? "green"
//                                   : airData.pm25 <= 35.4
//                                   ? "orange"
//                                   : "red",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {airData.pm25 ?? "--"}
//                           </Box>
//                         </Box>

//                         <Box
//                           component="tr"
//                           sx={{
//                             "&:nth-of-type(odd)": {
//                               backgroundColor: "#f9f9f9",
//                             },
//                             "&:hover": { backgroundColor: "#f1f1f1" },
//                           }}
//                         >
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               fontWeight: "500",
//                             }}
//                           >
//                             PM10
//                           </Box>
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               color:
//                                 airData.pm10 <= 54
//                                   ? "green"
//                                   : airData.pm10 <= 154
//                                   ? "orange"
//                                   : "red",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {airData.pm10 ?? "--"}
//                           </Box>
//                         </Box>

//                         <Box
//                           component="tr"
//                           sx={{
//                             "&:nth-of-type(odd)": {
//                               backgroundColor: "#f9f9f9",
//                             },
//                             "&:hover": { backgroundColor: "#f1f1f1" },
//                           }}
//                         >
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               fontWeight: "500",
//                             }}
//                           >
//                             NO2
//                           </Box>
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               color:
//                                 airData.no2 <= 53
//                                   ? "green"
//                                   : airData.no2 <= 100
//                                   ? "orange"
//                                   : "red",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {airData.no2 ?? "--"}
//                           </Box>
//                         </Box>

//                         <Box
//                           component="tr"
//                           sx={{
//                             "&:nth-of-type(odd)": {
//                               backgroundColor: "#f9f9f9",
//                             },
//                             "&:hover": { backgroundColor: "#f1f1f1" },
//                           }}
//                         >
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               fontWeight: "500",
//                             }}
//                           >
//                             SO2
//                           </Box>
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               color:
//                                 airData.so2 <= 35
//                                   ? "green"
//                                   : airData.so2 <= 75
//                                   ? "orange"
//                                   : "red",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {airData.so2 ?? "--"}
//                           </Box>
//                         </Box>

//                         <Box
//                           component="tr"
//                           sx={{
//                             "&:nth-of-type(odd)": {
//                               backgroundColor: "#f9f9f9",
//                             },
//                             "&:hover": { backgroundColor: "#f1f1f1" },
//                           }}
//                         >
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               fontWeight: "500",
//                             }}
//                           >
//                             O3
//                           </Box>
//                           <Box
//                             component="td"
//                             sx={{
//                               padding: "12px 15px",
//                               borderBottom: "1px solid #ddd",
//                               color:
//                                 airData.o3 <= 70
//                                   ? "green"
//                                   : airData.o3 <= 120
//                                   ? "orange"
//                                   : "red",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {airData.o3 ?? "--"}
//                           </Box>
//                         </Box>
//                       </Box>
//                     </>
//                   )}
//                 </Box>
//               </Box>
//             )}
//       </Box>
//     </>
//   );
// };

// export default Search;

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onClick({ lat, lon: lng });
    },
  });
  return null;
};

const Search = () => {
  const [position, setPosition] = useState(null);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchWeather = async (coords) => {
    if (!coords) return;
    setLoading(true);
    try {
      const airRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
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
    } catch (error) {
      console.error("خطا در دریافت اطلاعات:", error);
      setAirData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (coords) => {
    setPosition(coords);
    fetchWeather(coords);
  };

  const handleUpdateClick = () => {
    if (position) fetchWeather(position);
  };

  useEffect(() => {
    if (position) {
      intervalRef.current = setInterval(() => {
        fetchWeather(position);
      }, 60000); // 60 seconds

      return () => clearInterval(intervalRef.current);
    }
  }, [position]);

  return (
    <>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "200px",
          borderRadius: 2,
          boxShadow: "0 0 10px 2px #4381C4",
          p: { xs: 2, md: 3 },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "55%" },
            height: { xs: "300px", md: "400px" },
            pr: { xs: 0, md: 2 },
          }}
        >
          <MapContainer
            center={[35.6892, 51.389]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onClick={handleMapClick} />
            {position && (
              <Marker position={[position.lat, position.lon]}>
                <Popup>
                  مختصات: {position.lat.toFixed(4)}, {position.lon.toFixed(4)}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>

        <Box
          sx={{
            width: { xs: "95%", md: "40%" },
            minHeight: { xs: "auto", md: "100%" },
            py: "15px",
            px: "10px",
          }}
        >
          <Button
            onClick={handleUpdateClick}
            variant="contained"
            sx={{ display: "block", mx: "auto", my: 2 }}
            disabled={!position || loading}
          >
            Update
          </Button>

          {loading && (
            <CircularProgress sx={{ display: "block", mx: "auto" }} />
          )}

          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "20px 0",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {airData && (
              <>
                <Box component="thead">
                  <Box component="tr" sx={{ backgroundColor: "#f5f5f5" }}>
                    <Box
                      component="th"
                      sx={{
                        padding: "12px 15px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "bold",
                        color: "#4381C4",
                      }}
                    >
                      Parameter
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        padding: "12px 15px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "bold",
                        color: "#4381C4",
                      }}
                    >
                      Value
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  <Box
                    component="tr"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      AQI
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        color:
                          airData.aqi <= 50
                            ? "green"
                            : airData.aqi <= 100
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {airData.aqi ?? "--"}
                    </Box>
                  </Box>

                  <Box
                    component="tr"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      PM2.5
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        color:
                          airData.pm25 <= 12
                            ? "green"
                            : airData.pm25 <= 35.4
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {airData.pm25 ?? "--"}
                    </Box>
                  </Box>

                  <Box
                    component="tr"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      PM10
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        color:
                          airData.pm10 <= 54
                            ? "green"
                            : airData.pm10 <= 154
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {airData.pm10 ?? "--"}
                    </Box>
                  </Box>

                  <Box
                    component="tr"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      NO2
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        color:
                          airData.no2 <= 53
                            ? "green"
                            : airData.no2 <= 100
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {airData.no2 ?? "--"}
                    </Box>
                  </Box>

                  <Box
                    component="tr"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      SO2
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        color:
                          airData.so2 <= 35
                            ? "green"
                            : airData.so2 <= 75
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {airData.so2 ?? "--"}
                    </Box>
                  </Box>

                  <Box
                    component="tr"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      O3
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                        color:
                          airData.o3 <= 70
                            ? "green"
                            : airData.o3 <= 120
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {airData.o3 ?? "--"}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Search;
