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
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=${pr}`;

        const res = await fetch(url);
        const json = await res.json();
        console.log(json);

        const times = json.hourly.time || [];
        const values = json.hourly[pr] || [];

        const chartData = times.map((time, i) => (
          {
          time: time.split("T")[1],
          value: values[i],
          }
         ));

        setData(chartData.slice(-24));
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
