import { useEffect, useState } from "react";
import FacultySidebar from "../components/FacultySidebar";
import "../components/FacultySidebar.css";
import { fetchAssignedFiles } from "../services/facultyDashboard";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./HomeFaculty.css";

function HomeFaculty() {
  const [username, setUsername] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [questionRatings, setQuestionRatings] = useState([]); // <-- new state

  useEffect(() => {
    const uname = sessionStorage.getItem("username");
    setUsername(uname || "");

    async function fetchFiles() {
      const result = await fetchAssignedFiles(); // backend gets faculty_id from JWT
      if (result.status === "success") setPdfs(result.data);
      else console.error(result.error);
    }

    async function fetchAvgRating() {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/faculty/average-rating", {
          headers: { token },
        });

        if (res.data.success) setAvgRating(res.data.data.avg_rating);
        else console.error(res.data.error);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchQuestionRatings() {   // <-- new function
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/faculty/average-rating-per-question", {
          headers: { token },
        });
        if (res.data.success) setQuestionRatings(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFiles();
    fetchAvgRating();
    fetchQuestionRatings(); // <-- call it
  }, []);

  const getColor = (rating) => {
    if (rating <= 2) return "#FF4C4C"; // Red
    if (rating <= 3.5) return "#FFD700"; // Yellow
    return "#82ca9d"; // Green
  };

  const pieData = [
    { name: "Average Rating", value: avgRating },
    { name: "Remaining", value: 5 - avgRating }
  ];

  const COLORS = [getColor(avgRating), "#e0e0e0"];

  return (
    <>
      <FacultySidebar />
      <div className="home-container">
        <h2>Welcome, {username}</h2>


        {/* New section for question-wise average ratings */}
        <section className="question-ratings-section">
          <h4>📊 Average Rating per Question</h4>
          {questionRatings.length === 0 ? (
            <p>No question ratings available yet.</p>
          ) : (
            <ul>
              {questionRatings.map((q, idx) => (
                <li key={idx}>
                  {q.questiontext}: {parseFloat(q.avg_rating).toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="pdf-section">
          <h4>📄 Student Feedback PDFs</h4>
          {pdfs.length === 0 ? (
            <p>No feedback PDFs available yet.</p>
          ) : (
            <ul>
              {pdfs.map((file, idx) => (
                <li key={idx}>
                  <a href={file} target="_blank" rel="noreferrer">
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default HomeFaculty;
