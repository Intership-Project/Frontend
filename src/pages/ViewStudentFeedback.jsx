import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Table, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getCCFeedbacks,
  downloadAnonymizedPDF,
  getCCFeedbackDetails,
} from "../services/feedback";


export function ViewStudentFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getCCFeedbacks();
      if (Array.isArray(result)) {
        setFeedbacks(result);
      } else {
        toast.error(result?.error || "Failed to load feedbacks");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDownload = async (facultyId) => {
    const res = await downloadAnonymizedPDF(facultyId);
    if (res.status === "success") {
      toast.success("Report downloaded successfully");
    } else {
      toast.error(res.error || "Download failed");
    }
  };

  const handleViewDetails = async (schedulefeedback_id) => {
    setSelectedFeedback(schedulefeedback_id);
    setShowModal(true);
    const result = await getCCFeedbackDetails(schedulefeedback_id);
    if (Array.isArray(result)) {
      setDetails(result);
    } else {
      toast.error(result?.error || "Failed to fetch details");
      setDetails([]);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="title">View Student Feedback</h1>

        {loading ? (
          <p>Loading...</p>
        ) : feedbacks.length === 0 ? (
          <p>No feedbacks available</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Faculty</th>
                <th>Subject</th>
                <th>Module</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={fb.schedulefeedback_id || index}>
                  <td>{index + 1}</td>
                  <td>{fb.faculty_name}</td>
                  <td>{fb.subject_name}</td>
                  <td>{fb.module_name || "N/A"}</td>
                  <td>{fb.feedback_type}</td>
                  <td>
                    {fb.start_date && fb.end_date
                      ? `${new Date(fb.start_date).toLocaleDateString()} - ${new Date(fb.end_date).toLocaleDateString()}`
                      : "N/A"}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDownload(fb.faculty_id)}
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetails(fb.schedulefeedback_id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Modal for feedback details */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Feedback Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {details.length === 0 ? (
            <p>No details available</p>
          ) : (
            Object.values(
              details.reduce((acc, d) => {
                if (!acc[d.filledfeedbacks_id]) {
                  acc[d.filledfeedbacks_id] = {
                    studentname: d.studentname,
                    comments: d.comments,
                    responses: [],
                  };
                }
                acc[d.filledfeedbacks_id].responses.push({
                  question: d.questiontext,
                  rating: d.response_rating,
                });
                return acc;
              }, {})
            ).map((student, idx) => (
              <div key={idx} className="mb-4 p-3 border rounded">
                <h6>Student: {student.studentname}</h6>
                <ul>
                  {student.responses.map((r, i) => (
                    <li key={i}>
                      <strong>{r.question}:</strong> {r.rating}
                    </li>
                  ))}
                </ul>
                {student.comments && (
                  <p>
                    <strong>Comments:</strong> {student.comments}
                  </p>
                )}
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewStudentFeedback;
