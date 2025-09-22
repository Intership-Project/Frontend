import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    createFeedbackType,
    deleteFeedbackType,
    getFeedbackTypes,
} from "../services/feedbacktype";

export default function FeedbackType() {
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [fbtypename, setFbtypename] = useState("");

  // Load all feedback types
  const loadFeedbackTypes = async () => {
    const res = await getFeedbackTypes();
    if (res.status === "success") {
      setFeedbackTypes(res.data);
    } else {
      toast.error(res.error || "Failed to load feedback types");
    }
  };

  useEffect(() => {
    loadFeedbackTypes();
  }, []);

  // Add new feedback type
  const handleAdd = async () => {
    if (!fbtypename) {
      toast.warn("Please enter feedback type name");
      return;
    }

    const res = await createFeedbackType({ fbtypename });
    if (res.status === "success") {
      toast.success("Feedback type added");
      setFbtypename("");
      loadFeedbackTypes();
    } else {
      toast.error(res.error || "Failed to add feedback type");
    }
  };

  // Delete feedback type
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback type?"))
      return;

    const res = await deleteFeedbackType(id);
    if (res.status === "success") {
      toast.success("Feedback type deleted");
      loadFeedbackTypes();
    } else {
      toast.error(res.error || "Failed to delete feedback type");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Feedback Types</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter feedback type (e.g. Theory, Lab)"
          value={fbtypename}
          onChange={(e) => setFbtypename(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary mt-2" onClick={handleAdd}>
          Add Feedback Type
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Feedback Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbackTypes.map((ft) => (
            <tr key={ft.feedbacktype_id}>
              <td>{ft.feedbacktype_id}</td>
              <td>{ft.fbtypename}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(ft.feedbacktype_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {feedbackTypes.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No feedback types found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
