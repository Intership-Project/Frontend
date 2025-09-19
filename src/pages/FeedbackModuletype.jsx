import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addFeedback,
  getFeedbackTypes,
  getModuleTypesByFeedbackType,
} from "../services/addfeedback";

export default function FeedbackModuleType() {
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
  const [moduleTypes, setModuleTypes] = useState([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [loading, setLoading] = useState(false);

  // Load feedback types
  useEffect(() => {
    async function loadFeedbackTypes() {
      const res = await getFeedbackTypes();
      if (res.status === "success") setFeedbackTypes(res.data);
      else toast.error(res.error || "Failed to load feedback types");
    }
    loadFeedbackTypes();
  }, []);

  // Load module types when feedback type changes
  useEffect(() => {
    async function loadModules() {
      if (!selectedFeedbackType) {
        setModuleTypes([]);
        return;
      }
      const res = await getModuleTypesByFeedbackType(selectedFeedbackType);
      if (res.status === "success") setModuleTypes(res.data);
      else setModuleTypes([]);
    }
    loadModules();
  }, [selectedFeedbackType]);

  const handleAddModule = async () => {
    if (!selectedFeedbackType || !newModuleName.trim()) {
      toast.warn("Please select Feedback Type and enter Module name");
      return;
    }

    setLoading(true);
    try {
      const res = await addFeedback({
        fbmoduletypename: newModuleName,
        feedbacktype_id: selectedFeedbackType,
      });
      setLoading(false);
      if (res.status === "success") {
        toast.success("Module added successfully!");
        setNewModuleName("");
        const modRes = await getModuleTypesByFeedbackType(selectedFeedbackType);
        if (modRes.status === "success") setModuleTypes(modRes.data);
      } else {
        toast.error(res.error || "Failed to add module");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Feedback Module Type</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Feedback Type</label>
        <select value={selectedFeedbackType} onChange={(e) => setSelectedFeedbackType(e.target.value)}>
          <option value="">-- Select Feedback Type --</option>
          {feedbackTypes.map((ft) => (
            <option key={ft.feedbacktype_id} value={ft.feedbacktype_id}>
              {ft.fbtypename}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Existing Module Types</label>
        <ul>
          {moduleTypes.length > 0 ? (
            moduleTypes.map((m) => (
              <li key={m.feedbackmoduletype_id}>{m.fbmoduletypename}</li>
            ))
          ) : (
            <li>No modules found</li>
          )}
        </ul>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>New Module Name</label>
        <input
          type="text"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="Enter module name"
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleAddModule}
          disabled={loading}
          style={{ background: "green", color: "#fff", padding: "10px 25px", border: "none", borderRadius: "5px" }}
        >
          {loading ? "Adding..." : "Add Module"}
        </button>
      </div>
    </div>
  );
}
