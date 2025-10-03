import React, { useEffect, useState } from "react";
import {
  createFeedbackQuestion,
  deleteFeedbackQuestion,
  getFeedbackQuestions,
  updateFeedbackQuestion,
} from "../services/feedbackquestion";
import { getFeedbackTypes } from "../services/feedbacktype";

export default function FeedbackQuestion() {
  const [questions, setQuestions] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [modalData, setModalData] = useState({ questiontext: "", feedbacktype_id: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadQuestions();
    loadFeedbackTypes();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await getFeedbackQuestions();
      if (res.status === "success") setQuestions(res.data);
      else setError(res.error || "Failed to load questions");
    } catch {
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbackTypes = async () => {
    const res = await getFeedbackTypes();
    if (res.status === "success") setFeedbackTypes(res.data);
  };

  const openAddModal = () => {
    setModalType("add");
    setModalData({ questiontext: "", feedbacktype_id: "" });
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setModalType("edit");
    setEditId(q.feedbackquestion_id);
    setModalData({ questiontext: q.questiontext, feedbacktype_id: q.feedbacktype_id });
    setShowModal(true);
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const payload = {
      questiontext: modalData.questiontext,
      feedbacktype_id: modalData.feedbacktype_id,
    };
    const type = feedbackTypes.find((t) => t.feedbacktype_id === Number(payload.feedbacktype_id));

    if (modalType === "add") {
      const res = await createFeedbackQuestion(payload);
      if (res.status === "error") alert(`Add failed: ${res.error}`);
      else {
        alert("Question added successfully");
        const newQ = { ...res.data, fbtypename: type?.fbtypename || "Unknown" };
        setQuestions([...questions, newQ]);
        setShowModal(false);
      }
    } else {
      const res = await updateFeedbackQuestion(editId, payload);
      if (res.status === "error") alert(`Update failed: ${res.error}`);
      else {
        alert("Question updated successfully");
        setQuestions(
          questions.map((q) =>
            q.feedbackquestion_id === editId
              ? { ...q, ...payload, fbtypename: type?.fbtypename || "Unknown" }
              : q
          )
        );
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    const res = await deleteFeedbackQuestion(id);
    if (res.status === "error") alert(`Delete failed: ${res.error}`);
    else {
      alert("Question deleted successfully");
      setQuestions(questions.filter((q) => q.feedbackquestion_id !== id));
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Feedback Question Management</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={openAddModal}
          style={{
            backgroundColor: "#27ae60",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add Question
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#2c3e50", color: "#fff" }}>
          <tr>
            <th>S.No</th>
            <th>Question</th>
            <th>Feedback Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr key={q.feedbackquestion_id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{index + 1}</td>
              <td>{q.questiontext}</td>
              <td>{q.fbtypename || "Unknown"}</td>
              <td>
                <button
                  onClick={() => openEditModal(q)}
                  style={{
                    marginRight: "5px",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q.feedbackquestion_id)}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h2>{modalType === "add" ? "Add Question" : "Edit Question"}</h2>
            <form onSubmit={handleModalSave}>
              <div style={{ marginBottom: "10px" }}>
                <label>Question:</label>
                <input
                  type="text"
                  required
                  value={modalData.questiontext}
                  onChange={(e) =>
                    setModalData({ ...modalData, questiontext: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Feedback Type:</label>
                <select
                  required
                  value={modalData.feedbacktype_id}
                  onChange={(e) =>
                    setModalData({ ...modalData, feedbacktype_id: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select Type</option>
                  {feedbackTypes.map((t) => (
                    <option key={t.feedbacktype_id} value={t.feedbacktype_id}>
                      {t.fbtypename}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "8px 15px", borderRadius: "5px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    borderRadius: "5px",
                    backgroundColor: "#27ae60",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  {modalType === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
