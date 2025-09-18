import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchAssignedFiles } from "../services/facultyDashboard";
import "./HomeFaculty.css";

function HomeFaculty() {
  const [username, setUsername] = useState("");
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const uname = sessionStorage.getItem("username");
    setUsername(uname || "");

    async function fetchFiles() {
      const result = await fetchAssignedFiles(); // backend gets faculty_id from JWT
      if (result.status === "success") setPdfs(result.data);
      else console.error(result.error);
    }

    fetchFiles();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h2>Welcome, {username}</h2>

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
