import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchMyCourse, fetchDashboardStats, fetchRecentFeedbacks } from "../services/feedback";
import { toast } from "react-toastify";

export function Home() {
  const [name, setName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [stats, setStats] = useState({
    totalFeedback: 0,
    pendingReview: 0,
    facultyFeedbackAdded: 0,
  });
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Get CC info
        const ccRes = await fetchMyCourse();
        if (ccRes.status !== "success") {
          toast.error(ccRes.error || "Failed to fetch CC info");
          return;
        }
        const { username, course_id, course_name } = ccRes.data;
        setName(username);
        setCourseName(course_name);

        // Get dashboard stats
        const statsRes = await fetchDashboardStats(course_id);
        if (statsRes.status === "success") {
          setStats(statsRes.data);
        } else {
          toast.warn(statsRes.error || "Failed to fetch dashboard stats");
        }

        // Get recent feedbacks
        const feedbackRes = await fetchRecentFeedbacks(course_id);
        if (feedbackRes.status === "success") {
          setRecentFeedbacks(feedbackRes.data);
        } else {
          toast.warn(feedbackRes.error || "Failed to fetch recent feedbacks");
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong while loading data");
      }
    }

    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Welcome, {name}</h2>
        <h5>Course: {courseName}</h5>

        {/* Dashboard Cards */}
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Total Student Feedback</h5>
                <p className="card-text">{stats.totalFeedback}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Pending Feedback Review</h5>
                <p className="card-text">{stats.pendingReview}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Faculty Feedback Added</h5>
                <p className="card-text">{stats.facultyFeedbackAdded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Student Feedback Table */}
        <h4 className="mt-5">Recent Student Feedback</h4>
        <div className="table-responsive">
          <table className="table table-striped mt-2">
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Overall Rating</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedbacks.length > 0 ? (
                recentFeedbacks.map((fb) => (
                  <tr key={fb.filledfeedbacks_id}>
                    <td>{fb.studentname}</td>
                    <td>{fb.StartDate} - {fb.EndDate}</td>
                    <td>{fb.subjectname}</td>
                    <td>{fb.facultyname}</td>
                    <td>{fb.rating}</td>
                    <td>{fb.comments || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No feedbacks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Home;
