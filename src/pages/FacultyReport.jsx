import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function FacultyReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/faculty/report/all", {
          headers: { token }
        });

        if (res.data.status === "success") {
          // Convert avg_rating & feedback_count to numbers and default to 0 if null
          const chartData = res.data.data.map(f => ({
            ...f,
            avg_rating: f.avg_rating ? Number(f.avg_rating) : 0,
            feedback_count: f.feedback_count ? Number(f.feedback_count) : 0
          }));

          setData(chartData);
        } else {
          alert(res.data.error || "Failed to fetch faculty report");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching faculty report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading faculty report...</p>;

  if (!data.length) return <p>No faculty data available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Faculty Feedback Report</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="facultyname" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              return value;
            }}
          />
          <Legend />
          <Bar dataKey="avg_rating" fill="#8884d8" name="Average Rating" />
          
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
