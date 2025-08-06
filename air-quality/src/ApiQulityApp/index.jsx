import { useEffect, useState, useCallback } from "react";
import { countries } from "./countries";
import MapView from "../Components/MapView";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
} from "@mui/material";
import notify from "../Utils/notify";
import Search from "./Search";
import Loading from "../Components/Loading";
import ParameterChart from "../Components/ParameterChart";

function ApiQualityApp() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);

  const handleSearch = () => setSearch((prev) => !prev);

  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.name === e.target.value);
    setSelectedCountry(country);
    setSelectedCity(null);
    setAirData(null);
  };

  const handleCityChange = (e) => {
    const city = selectedCountry?.cities.find((c) => c.name === e.target.value);
    setSelectedCity(city);
  };


const fetchData = useCallback(async () => {
  if (!selectedCity) return;
  setLoading(true);
  try {
    const { lat, lon } = selectedCity;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
    url.searchParams.append('latitude', lat);
    url.searchParams.append('longitude', lon);
    url.searchParams.append('current', 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi');
    url.searchParams.append('timezone', userTimezone);

    const airRes = await fetch(url.toString());

    if (!airRes.ok) {
      throw new Error(`server error: ${airRes.status}`);
    }

    const text = await airRes.text();
    if (!text) {
      throw new Error("Received an empty response from the server.");
    }

    const airJson = JSON.parse(text);

    if (!airJson.current) {
      throw new Error("No data found for this location."
);
    }

    setAirData({
      aqi: airJson.current.us_aqi,
      pm25: airJson.current.pm2_5,
      pm10: airJson.current.pm10,
      co: airJson.current.carbon_monoxide,
      no2: airJson.current.nitrogen_dioxide,
      so2: airJson.current.sulphur_dioxide,
      o3: airJson.current.ozone,
    });

    notify("success","Data received successfully");
  } catch (err) {
    console.error("Data reception failed :", err);
    notify("error", "Data reception failed");
    setAirData(null);
  } finally {
    setLoading(false);
  }
}, [selectedCity]);

  useEffect(() => {
    fetchData();
   
  }, [fetchData]);
  console.log(airData);
  return (
    <Box sx={{ pt: "115px", display: "flex" }}>
      {loading && <Loading />}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, textAlign: "center", color: "#4381C4" }}
        >
          {search
            ? " Click on the map to display air quality information"
            : " Select Country and City"}
        </Typography>

        <Box
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5%",
            padding: "20px",
            borderRadius: "10px",
            flexDirection: { xs: "column", md: "row" },
            backgroundColor: "#82CBED",
          }}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ mb: { xs: "20px", md: "0" } }}
            onClick={handleSearch}
          >
            {!search ? "Map Search" : "City Search"}
          </Button>

          <FormControl sx={{ display: search ? "none" : "block" }}>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              label="Country"
              onChange={handleCountryChange}
              value={selectedCountry?.name || ""}
              sx={{ width: "150px", mb: { xs: "20px", md: "0" } }}
            >
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCountry && !search && (
            <FormControl>
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                label="City"
                onChange={handleCityChange}
                value={selectedCity?.name || ""}
                sx={{ width: "150px", mb: { xs: "20px", md: "0" } }}
              >
                {selectedCountry.cities.map((city) => (
                  <MenuItem key={city.name} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {search ? (
          <Search />
        ) : (
          <>
            {selectedCity && (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
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
                  <MapView key={selectedCity?.name} city={selectedCity} />
                </Box>

                {airData && (
                  <Box
                    sx={{
                      width: { xs: "95%", md: "45%" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={fetchData}
                      disabled={loading}
                      sx={{ mb: 2 }}
                    >
                      {loading ? "Updating ..." : `Update data of ${selectedCity.name}`}
                    </Button>

                    <Box sx={{ width: "100%" }}>
                      {Object.entries(airData).map(([key, value]) => (
                        <Box
                          key={key}
                          onClick={() => setSelectedParameter(key)}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 1,
                            px: 2,
                            cursor: "pointer",
                            borderBottom: "1px solid #ccc",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 600, color: "#4381C4" }}
                          >
                            {key.toUpperCase()}
                          </Typography>
                       <Typography
  sx={{
    fontWeight: "bold",
    color: (() => {
      if (value === null || value === undefined) return "black";
      
      switch(key) {
        case 'aqi':
          if (value <= 50) return '#4CAF50'; 
          if (value <= 150) return '#FFC107'; 
          return '#F44336'; 

        case 'pm25':
          if (value <= 12) return '#4CAF50'; 
          if (value <= 35) return '#FFC107'; 
          return '#F44336'; 

        case 'pm10':
          if (value <= 50) return '#4CAF50'; 
          if (value <= 150) return '#FFC107'; 
          return '#F44336'; 

        case 'no2':
          if (value <= 50) return '#4CAF50'; 
          if (value <= 100) return '#FFC107'; 
          return '#F44336'; 

        case 'so2':
          if (value <= 50) return '#4CAF50'; 
          if (value <= 150) return '#FFC107'; 
          return '#F44336'; 

        case 'o3':
          if (value <= 50) return '#4CAF50'; 
          if (value <= 100) return '#FFC107'; 
          return '#F44336'; 

        case 'co':
          if (value <= 1) return '#4CAF50'; 
          if (value <= 2) return '#FFC107'; 
          return '#F44336'; 

        default:
          return 'black';
      }
    })()
  }}
>
                            {value ?? "--"}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {selectedCity &&selectedParameter && (
              <Box
                 sx={{
              p: { xs: 2, md: 3 },
              mx: "auto",
              
              width: "100%",
              backgroundColor: "#f5faff",
              minHeight:'500px',
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "start",
              mt: 4,
              borderRadius: "10px",
              boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
              boxSizing: "border-box",
              position: "relative",
            }}
              >
                <Typography variant="h6" gutterBottom>
                  {selectedParameter.toUpperCase()} - Chart (Last 24h)
                </Typography>
                 <Box
               sx={{
                width: "80%",
                p:'5px 0 ',
                position: "absolute",
                top: {xs:'30%',md:'25%'},
                left:{xs:'48%',md:'50%'},
                transform: 'translateX(-52%)',
              }}
            > <ParameterChart
                  city={selectedCity}
                  parameter={selectedParameter}
                /></Box>
               
                <Button
                  onClick={() => setSelectedParameter(null)}
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                >
                  Close
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

export default ApiQualityApp;




