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

function ApiQualityApp() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);

  const handleSearch = () => {
    return setSearch(!search);
  };

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
      notify("success", "data resived successfully");
    } catch (err) {
      console.error("خطا در دریافت اطلاعات:", err);
      notify("error", "data failed");
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <Box sx={{ pt: "115px", display: "flex" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, textAlign: "center", color: "#4381C4" }}
        >
         {search ?' Click on the map to display air quality information':' Select Country and City'}
        </Typography>

        <Box
          sx={{
            width: "80%",
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
           sx={{mb: { xs: "20px", md: "0" }}}
            onClick={handleSearch}
          >
            {!search?'Map Search':'City Search'}
          </Button>
          <FormControl sx={{ display: search ? "none" : "block"}}>
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

          {selectedCountry &&!search && (
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

        {search?<Search/> :<>
        {selectedCity && (
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
              <MapView key={selectedCity?.name} city={selectedCity} />
            </Box>

            {!loading && airData && (
              <Box
                sx={{
                  width: { xs: "95%", md: "40%" },
                  minHeight: { xs: "auto", md: "100%" },
                  py: "15px",
                  px: "10px",
                }}
              >
                
                 <Button
              variant="contained"
              color="primary"
              onClick={fetchData}
              disabled={loading}
            sx={{ display: "block", mx: "auto", my: 2 }}
            >
              {loading ? "Updating ..." : "Update"}
            </Button>

                <Box
                  component="table"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {airData &&  (
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
            )}
            
          </Box>
        )}</>}
      </Paper>
    </Box>
  );
}

export default ApiQualityApp;
