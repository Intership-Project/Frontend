import React, { useEffect, useState } from "react";
import {
  fetchMyCourse,
  fetchDashboardStats,
  fetchRecentFeedbacks,
  getFeedbackDetails,
  updateFeedbackStatus,   
} from "../services/cchome";
import "./HomeCC.css";
import FacultySidebar from "../components/FacultySidebar";
import "../components/FacultySidebar.css"; 
import { jwtDecode } from "jwt-decode";




function HomeCC() {
  const [course, setCourse] = useState(null);
  const [stats, setStats] = useState({});
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ccName, setCcName] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setCcName(decoded.facultyname || decoded.username || "CC");
          } catch (err) {
            console.error("Token decode error:", err);
            setCcName("CC");
          }
        }

        const courseRes = await fetchMyCourse();
        if (courseRes.status === "success") {
          setCourse(courseRes.data);
          const courseId = courseRes.data.course_id;

          const statsRes = await fetchDashboardStats(courseId);
          if (statsRes.status === "success") {
            setStats(statsRes.data);
          }

          const feedbackRes = await fetchRecentFeedbacks(courseId);
          if (feedbackRes.status === "success") {
            setRecentFeedbacks(feedbackRes.data);
          }
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);




  // Handle View Feedback
  async function handleView(feedbackId) {
    try {
     
      const res = await getFeedbackDetails(feedbackId);
      if (res.status === "success") {
        setSelectedFeedback(res.data);
        setShowModal(true);

        
        await updateFeedbackStatus(feedbackId, "Reviewed");

        setRecentFeedbacks((prev) =>
          prev.map((fb) =>
            fb.filledfeedbacks_id === feedbackId
              ? { ...fb, review_status: "Reviewed" }
              : fb
          )
        );
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      console.error("Error viewing feedback:", err);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <FacultySidebar />
      <div className="home-container">
        <h2>Welcome, {ccName}</h2>
        <h3>Course: {course?.coursename || "N/A"}</h3>

        {/* Dashboard Statistics */}
        <section className="stats-section">
          <h4>Course Feedback Overview</h4>
          <div className="stats-grid">
            <div className="stat-card bg-blue">
              <h5>Total Student Feedback</h5>
              <p>{stats.totalFeedback || 0}</p>
            </div>
            <div className="stat-card bg-orange">
              <h5>Pending Feedback Review</h5>
              <p>{stats.pendingReview || 0}</p>
            </div>
            <div className="stat-card bg-green">
              <h5>Faculty Feedback Added</h5>
              <p>{stats.facultyFeedbackAdded || 0}</p>
            </div>
          </div>
        </section>

        {/* Recent Feedbacks */}
        <section className="feedback-section">
          <h4>📝 Recent Student Feedback</h4>

          {recentFeedbacks.length === 0 ? (
            <p>No feedbacks found.</p>
          ) : (
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Faculty</th>
                  <th>Subject</th>
                  <th>Module</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentFeedbacks.map((fb, index) => (
                  <tr key={fb.filledfeedbacks_id}>
                    <td>{index + 1}</td>
                    <td>{fb.studentname}</td>
                    <td>{fb.facultyname}</td>
                    <td>{fb.subjectname}</td>
                    <td>{fb.module || "—"}</td>
                    <td>{fb.type || "—"}</td>
                    <td>
                      {new Date(fb.StartDate).toLocaleDateString()} -{" "}
                      {new Date(fb.EndDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={
                          fb.review_status === "Reviewed"
                            ? "status-reviewed"
                            : "status-pending"
                        }
                      >
                        {fb.review_status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn btn-view"
                        onClick={() => handleView(fb.filledfeedbacks_id)}
                      >
                        View
                      </button>
  
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>



        {/* Feedback Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-window">
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>

              <h4>📋 Feedback Details</h4>

              <div className="feedback-details">
                {selectedFeedback.map((q, idx) => (
                  <div key={q.feedbackquestion_id} className="feedback-item">
                    <p>
                      <strong>
                        Q{idx + 1}. {q.questiontext}
                      </strong>
                    </p>
                    <p>⭐ Rating: {q.response_rating}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HomeCC;
