import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loading from "../Loading";

const PARAMETER_LABELS = {
  pm2_5: "pm25",
  pm10: "pm10",
  carbon_monoxide: "co",
  nitrogen_dioxide: "no2",
  sulphur_dioxide: "so2",
  ozone: "o3",
  us_aqi: "aqi",
};
const finalParameter = (pr) => {
  const found = Object.entries(PARAMETER_LABELS).find(
    ([key, value]) => value === pr
  );
  return found ? found[0] : null;
};
function ParameterChart({ city, parameter }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!city || !parameter) return;
  const pr = finalParameter(parameter);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?
        latitude=${city.lat}&
        longitude=${city.lon}&
        hourly=${pr}&
        start_date=${past24h.toISOString().split('T')[0]}&
        end_date=${now.toISOString().split('T')[0]}&
        timezone=auto`;
      
      const res = await fetch(url.replace(/\s/g, ''));
      const json = await res.json();

      const times = json.hourly.time || [];
      const values = json.hourly[pr] || [];

      const currentHour = now.getHours();
      const chartData = times
        .map((time, i) => ({
          time: new Date(time).getHours() + ':00', 
          value: values[i],
          fullTime: time 
        }))
        .filter(item => {
          const itemTime = new Date(item.fullTime).getTime();
          return itemTime >= past24h.getTime() && 
                 itemTime <= now.getTime() && 
                 item.value !== null;
        })
        .slice(-24); 

      setData(chartData);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchChartData();
}, [city, parameter]);

  if (loading) return <Loading />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#1100CC"
          dot={false}
          name={PARAMETER_LABELS[parameter] || parameter}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ParameterChart;






