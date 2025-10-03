import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  addFeedback,
  deleteFeedback,
  getBatchesByCourse,
  getCourses,
  getFaculties,
  getFeedbackList,
  getFeedbackTypes,
  getModuleTypesByFeedbackType,
  getSubjectsByCourse,
} from "../services/addfeedback";
import { createUrl } from "../utils";
import "./AddFeedback.css";

export default function AddFeedback() {
  const [feedbackId, setFeedbackId] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [feedbackTypeId, setFeedbackTypeId] = useState("");
  const [moduleTypeId, setModuleTypeId] = useState("");
  const [date, setDate] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [moduleTypes, setModuleTypes] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);

  // Format ISO date → dd-mm-yyyy
  const formatDisplayDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // Check if selected feedback type is Lab
  const isLab = feedbackTypes.find(
    (t) => String(t.feedbacktype_id) === String(feedbackTypeId)
  )?.fbtypename?.toLowerCase() === "lab";

  // Load initial dropdowns and feedback list
  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, facultiesRes, feedbackTypesRes, listRes] = await Promise.all([
          getCourses(),
          getFaculties(),
          getFeedbackTypes(),
          getFeedbackList(),
        ]);

        if (coursesRes.status === "success") setCourses(coursesRes.data || []);
        if (facultiesRes.status === "success") setFaculties(facultiesRes.data || []);
        if (feedbackTypesRes.status === "success") setFeedbackTypes(feedbackTypesRes.data || []);
        if (listRes.status === "success") setFeedbackList(listRes.data || []);
      } catch (err) {
        toast.error(err.message || "Error loading data");
      }
    }
    loadData();
  }, []);

  // Load subjects when course changes
  useEffect(() => {
    async function loadSubjects() {
      if (!courseId) {
        setSubjects([]);
        setSubjectId("");
        return;
      }
      try {
        const res = await getSubjectsByCourse(courseId);
        setSubjects(res.status === "success" ? res.data || [] : []);
      } catch {
        setSubjects([]);
      }
    }
    loadSubjects();
  }, [courseId]);

  // Load batches when course or feedback type changes
  useEffect(() => {
    async function loadBatches() {
      if (!courseId || !isLab) {
        setBatches([]);
        setBatchId("");
        return;
      }
      try {
        const res = await getBatchesByCourse(courseId);
        setBatches(res.status === "success" ? res.batches || [] : []);
        if (!feedbackId) setBatchId("");
      } catch {
        setBatches([]);
        setBatchId("");
      }
    }
    loadBatches();
  }, [courseId, feedbackTypeId, isLab, feedbackId]);

  // Load module types when feedback type changes
  useEffect(() => {
    async function loadModuleTypes() {
      if (!feedbackTypeId) {
        setModuleTypes([]);
        setModuleTypeId("");
        return;
      }
      try {
        const res = await getModuleTypesByFeedbackType(feedbackTypeId);
        setModuleTypes(res.status === "success" ? res.data || [] : []);
      } catch {
        setModuleTypes([]);
      }
    }
    loadModuleTypes();
  }, [feedbackTypeId]);

  const resetForm = () => {
    setFeedbackId(null);
    setCourseId("");
    setBatchId("");
    setSubjectId("");
    setFacultyId("");
    setFeedbackTypeId("");
    setModuleTypeId("");
    setDate("");
    setPdfFile(null);
    setBatches([]);
    setSubjects([]);
    setModuleTypes([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Batch is required only if Lab
    if (
      !courseId ||
      !subjectId ||
      !facultyId ||
      !feedbackTypeId ||
      !moduleTypeId ||
      !date ||
      (!pdfFile && !feedbackId) ||
      (isLab && !batchId)
    ) {
      toast.warn("Please fill all required fields. Batch is required for Lab feedback.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("course_id", courseId);
      formData.append("subject_id", subjectId);
      formData.append("faculty_id", facultyId);
      formData.append("feedbackmoduletype_id", moduleTypeId);
      formData.append("feedbacktype_id", feedbackTypeId);
      formData.append("date", date);
      if (isLab) formData.append("batch_id", batchId);
      if (pdfFile) formData.append("pdf_file", pdfFile);

      let res;
      if (feedbackId) {
        // Update feedback API
        const updateRes = await axios.put(
          createUrl(`addfeedback/update/${feedbackId}`),
          formData,
          {
            headers: { token: sessionStorage.getItem("token"), "Content-Type": "multipart/form-data" },
          }
        );
        res = updateRes.data; // <-- Immediate toast fix
      } else {
        res = await addFeedback({
          courseId,
          batchId: isLab ? batchId : null,
          subjectId,
          facultyId,
          moduleTypeId,
          feedbackTypeId,
          date,
          pdfFile,
        });
      }

      if (res.status === "success") {
        toast.success(feedbackId ? "Feedback updated successfully" : "Feedback added successfully");
        resetForm();
        const listRes = await getFeedbackList();
        if (listRes.status === "success") setFeedbackList(listRes.data || []);
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleEdit = (f) => {
    setFeedbackId(f.addfeedback_id);
    setCourseId(f.course_id || "");
    setBatchId(f.batch_id || "");
    setSubjectId(f.subject_id || "");
    setFacultyId(f.faculty_id || "");
    setFeedbackTypeId(f.feedbacktype_id || "");
    setModuleTypeId(f.feedbackmoduletype_id || "");
    setDate(f.date ? f.date.split("T")[0] : "");
    setPdfFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    const res = await deleteFeedback(id);
    if (res.status === "success") {
      toast.success("Deleted successfully");
      setFeedbackList(feedbackList.filter((f) => f.addfeedback_id !== id));
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  return (
    <div className="feedback-container">
      {/* Form */}
      <div className="feedback-form">
        <h2>{feedbackId ? "Edit Feedback" : "Add Faculty Feedback"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div>
              <label>Course</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.course_id} value={c.course_id}>{c.coursename}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Batch</label>
              <select value={batchId} onChange={(e) => setBatchId(e.target.value)} disabled={!isLab}>
                <option value="">-- Select Batch --</option>
                {batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>{b.batchname}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Subject</label>
              <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>{s.subjectname}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Faculty</label>
              <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
                <option value="">-- Select Faculty --</option>
                {faculties.map((f) => (
                  <option key={f.faculty_id} value={f.faculty_id}>{f.facultyname}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Feedback Type</label>
              <select value={feedbackTypeId} onChange={(e) => setFeedbackTypeId(e.target.value)}>
                <option value="">-- Select Feedback Type --</option>
                {feedbackTypes.map((t) => (
                  <option key={t.feedbacktype_id} value={t.feedbacktype_id}>{t.fbtypename}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Module Type</label>
              <select value={moduleTypeId} onChange={(e) => setModuleTypeId(e.target.value)}>
                <option value="">-- Select Module Type --</option>
                {moduleTypes.map((m) => (
                  <option key={m.feedbackmoduletype_id} value={m.feedbackmoduletype_id}>{m.fbmoduletypename}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
              <label>PDF {feedbackId ? "(Leave blank to keep existing)" : ""}</label>
              <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-success">{feedbackId ? "Update Feedback" : "Add Feedback"}</button>
            {feedbackId && <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        <h2>Feedback List</h2>
        <table className="table-bordered">
          <thead>
            <tr>
              <th>Course</th>
              <th>Batch</th>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Type</th>
              <th>Module</th>
              <th>Date</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.length === 0 && <tr><td colSpan="9">No feedback available</td></tr>}
            {feedbackList.map((f) => (
              <tr key={f.addfeedback_id}>
                <td>{f.coursename}</td>
                <td>{f.fbtypename.toLowerCase() === "lab" ? f.batchname || "-" : "-"}</td>
                <td>{f.subjectname}</td>
                <td>{f.facultyname}</td>
                <td>{f.fbtypename}</td>
                <td>{f.fbmoduletypename}</td>
                <td>{formatDisplayDate(f.date)}</td>
                <td>{f.pdf_file ? <a href={createUrl(`feedback_reports/${f.pdf_file}`)} target="_blank" rel="noreferrer">View</a> : "-"}</td>
                <td>
                  <button className="btn-primary btn-sm" onClick={() => handleEdit(f)}>Edit</button>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(f.addfeedback_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



