import { useEffect, useState } from "react";
import FacultySidebar from "../components/FacultySidebar";
import "../components/FacultySidebar.css";
import { fetchAssignedFiles, fetchFeedbackSummary } from "../services/homefaculty";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./HomeFaculty.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const { name, value, questions } = payload[0].payload;
    return (
      <div style={{ background: "#fff", border: "1px solid #ccc", padding: 10 }}>
        <p><strong>{name}:</strong> {value}</p>
        <p><strong>Questions:</strong> {questions.join(", ")}</p>
      </div>
    );
  }
  return null;
};

function HomeFaculty() {
  const [username, setUsername] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [feedbackData, setFeedbackData] = useState({});

  useEffect(() => {
    const uname = sessionStorage.getItem("username");
    setUsername(uname || "");

    async function fetchData() {
      try {
        const pdfResult = await fetchAssignedFiles();
        if (pdfResult.status === "success") {
          setPdfs(pdfResult.data);
        }

        const summaryResult = await fetchFeedbackSummary();
        if (summaryResult.status === "success") {
          setFeedbackData(summaryResult.data);
        }
      } catch (err) {
        console.error("Error fetching home faculty data:", err);
      }
    }

    fetchData();
  }, []);

  const getCombinedChartData = () => {
    const ratingMap = {};

    Object.entries(feedbackData).forEach(([questionText, ratings]) => {
      Object.entries(ratings).forEach(([ratingLabel, count]) => {
        if (!ratingMap[ratingLabel]) {
          ratingMap[ratingLabel] = {
            name: ratingLabel,
            value: 0,
            questions: [],
          };
        }
        ratingMap[ratingLabel].value += count;
        ratingMap[ratingLabel].questions.push(questionText);
      });
    });

    return Object.values(ratingMap);
  };

  return (
    <>
      <FacultySidebar />
      <div className="home-container">
        <h2>Welcome, {username}</h2>

        {/* Feedback PDFs Section */}
        <section className="pdf-section">
          <h4>Student Feedback PDFs</h4>
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

        {/* Feedback Summary Section */}
        <section className="chart-section">
          <h4>Per-Question Feedback Summary</h4>
          {Object.keys(feedbackData).length === 0 ? (
            <p>No feedback responses available yet.</p>
          ) : (
            <div className="chart-wrapper">
              <h5>All Questions Combined</h5>
              <PieChart width={500} height={500}>
                <Pie
                  data={getCombinedChartData()}
                  cx="250"
                  cy="250"
                  outerRadius={130}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  dataKey="value"
                >
                  {getCombinedChartData().map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default HomeFaculty;
