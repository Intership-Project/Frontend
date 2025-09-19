import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  fetchCourseFeedbacks,
  downloadStudentResponsesPDF,
} from "../services/viewstudentfeedback";
import { jwtDecode } from "jwt-decode";
import "./ViewStudentFeedback.css";

export default function ViewStudentFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [courseId, setCourseId] = useState(null);

  
  // Decode token to get course_id
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCourseId(decoded.course_id);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);


  // Fetch all filled feedbacks (with responses embedded)
  useEffect(() => {
    if (!courseId) return;

    async function loadFeedbacks() {
      setLoading(true);
      try {
        const res = await fetchCourseFeedbacks(courseId);
        if (res.status === "success") setFeedbacks(res.data);
        else alert(res.error);
      } catch (err) {
        alert("Failed to fetch feedbacks: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFeedbacks();
  }, [courseId]);

  const toggleExpand = (filledfeedbacks_id) => {
    setExpandedFeedback(
      expandedFeedback === filledfeedbacks_id ? null : filledfeedbacks_id
    );
  };

  const handleDownload = async (scheduleId) => {
    await downloadStudentResponsesPDF(scheduleId);
  };

  if (loading) return <p>Loading student feedbacks...</p>;

  return (
    <>
      <Navbar />
      <div className="feedback-container">
        <h1>📄 Filled Feedbacks</h1>

        {feedbacks.length === 0 ? (
          <p>No feedbacks found.</p>
        ) : (
          feedbacks.map(({ schedule, feedbacks: studentFeedbacks }) => (
            <div key={schedule.schedulefeedback_id} className="feedback-card">
              <h2 className="feedback-heading">
                {schedule.coursename} - {schedule.subjectname} ({schedule.facultyname})
              </h2>

              <button
                onClick={() => handleDownload(schedule.schedulefeedback_id)}
                className="download-btn"
              >
                Download All Responses PDF
              </button>

              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Comments</th>
                    <th>Rating</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {studentFeedbacks.map((fb) => (
                    <React.Fragment key={fb.filledfeedbacks_id}>
                      <tr>
                        <td>{fb.studentname}</td>
                        <td>{fb.comments}</td>
                        <td>{fb.rating ?? "-"}</td>
                        <td>
                          <button
                            onClick={() => toggleExpand(fb.filledfeedbacks_id)}
                            className="view-btn"
                          >
                            {expandedFeedback === fb.filledfeedbacks_id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {expandedFeedback === fb.filledfeedbacks_id && (
                        <tr>
                          <td colSpan={4} className="expanded-row">
                            {fb.responses && fb.responses.length > 0 ? (
                              fb.responses.map((r, idx) => (
                                <div key={r.feedbackquestion_id} className="response-item">
                                  <strong>Q{idx + 1}:</strong> {r.questiontext} <br />
                                  <strong>Answer:</strong> {r.response_rating}
                                </div>
                              ))
                            ) : (
                              <p>No responses found.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </>
  );
}
