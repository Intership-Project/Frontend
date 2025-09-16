import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { fetchFacultyFilledFeedback, downloadSingleFeedbackPDF } from '../services/viewstudentfeedback';
import { jwtDecode } from "jwt-decode";
import './ViewStudentFeedback.css';

function ViewStudentFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCourse({
        course_id: decoded.course_id,
        coursename: decoded.coursename
      });
    }
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    const response = await fetchFacultyFilledFeedback();
    if (response.status === 'success') {
      setFeedbackList(response.data);
    } else {
      alert(response.error?.message || JSON.stringify(response.error));
    }
    setLoading(false);
  };

  if (loading) return <p>Loading feedback for your course...</p>;

  return (
    <>
      <Navbar />
      <div className="cc-feedback-container">
        <h1>Feedback for {feedbackList[0]?.coursename || "Your Course"}</h1>

        <table className="cc-feedback-table">
          <thead>
            <tr>
              <th>FilledFeedback ID</th>
              <th>ScheduleFeedback ID</th>
              <th>Course</th>
              <th>Student</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map(f => (
              <tr key={f.filledfeedbacks_id}>
                <td>{f.filledfeedbacks_id}</td>
                <td>{f.schedulefeedback_id}</td>
                <td>{f.coursename}</td>
                <td>{f.studentname}</td>
                <td>{f.comments || '-'}</td>
                <td>{f.rating || '-'}</td>
                <td>
                  <button
                    className="cc-feedback-button"
                    onClick={() => downloadSingleFeedbackPDF(f.filledfeedbacks_id)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ViewStudentFeedback;
