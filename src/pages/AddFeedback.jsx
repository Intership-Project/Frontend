import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
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

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, facultiesRes, feedbackTypesRes, listRes] = await Promise.all([
          getCourses(),
          getFaculties(),
          getFeedbackTypes(),
          getFeedbackList(),
        ]);

        if (coursesRes.status === "success") setCourses(coursesRes.data);
        if (facultiesRes.status === "success") setFaculties(facultiesRes.data);
        if (feedbackTypesRes.status === "success") setFeedbackTypes(feedbackTypesRes.data);
        if (listRes.status === "success") setFeedbackList(listRes.data);
      } catch (err) {
        toast.error(err.message || "Error loading data");
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadCourseDetails() {
      if (!courseId) {
        setSubjects([]); setBatches([]); setSubjectId(""); setBatchId("");
        return;
      }
      try {
        const subjectsRes = await getSubjectsByCourse(courseId);
        setSubjects(subjectsRes.status === "success" ? subjectsRes.data : []);
        const batchesRes = await getBatchesByCourse(courseId);
        setBatches(batchesRes.status === "success" ? batchesRes.data : []);
      } catch {
        setSubjects([]); setBatches([]);
      }
    }
    loadCourseDetails();
  }, [courseId]);

  useEffect(() => {
    async function loadModuleTypes() {
      if (!feedbackTypeId) {
        setModuleTypes([]); setModuleTypeId(""); return;
      }
      try {
        const res = await getModuleTypesByFeedbackType(feedbackTypeId);
        setModuleTypes(res.status === "success" ? res.data : []);
      } catch {
        setModuleTypes([]);
      }
    }
    loadModuleTypes();
  }, [feedbackTypeId]);

  const resetForm = () => {
    setFeedbackId(null);
    setCourseId(""); setBatchId(""); setSubjectId(""); setFacultyId(""); setFeedbackTypeId(""); setModuleTypeId(""); setDate(""); setPdfFile(null);
    setBatches([]); setSubjects([]); setModuleTypes([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId || !subjectId || !facultyId || !feedbackTypeId || !moduleTypeId || !date || (!pdfFile && !feedbackId)) {
      toast.warn("Please fill all required fields and select PDF");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("course_id", courseId);
      if (batchId) formData.append("batch_id", batchId); 
      formData.append("subject_id", subjectId);
      formData.append("faculty_id", facultyId);
      formData.append("feedbackmoduletype_id", moduleTypeId);
      formData.append("feedbacktype_id", feedbackTypeId);
      formData.append("date", date);
      if (pdfFile) formData.append("pdf_file", pdfFile);

      let res;
      if (feedbackId) {
        res = await axios.put(createUrl(`addfeedback/update/${feedbackId}`), formData, {
          headers: { token: sessionStorage.getItem("token"), "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(createUrl("addfeedback"), formData, {
          headers: { token: sessionStorage.getItem("token"), "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.status === "success") {
        toast.success(feedbackId ? "Feedback updated successfully" : "Feedback added successfully");
        resetForm();
        const listRes = await getFeedbackList();
        if (listRes.status === "success") setFeedbackList(listRes.data);
      } else {
        toast.error(res.data.error || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleEdit = (f) => {
    setFeedbackId(f.addfeedback_id);
    setCourseId(f.course_id || "");
    setBatchId(f.batch_id || ""); // keep empty string if no batch
    setSubjectId(f.subject_id || "");
    setFacultyId(f.faculty_id || "");
    setFeedbackTypeId(f.feedbacktype_id || "");
    setModuleTypeId(f.feedbackmoduletype_id || "");
    setDate(f.date || "");
    setPdfFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    const res = await deleteFeedback(id);
    if (res.status === "success") {
      toast.success("Deleted successfully");
      setFeedbackList(feedbackList.filter(f => f.addfeedback_id !== id));
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "1200px", margin: "30px auto" }}>
      {/* Form */}
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#f9f9f9", marginBottom: "30px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{feedbackId ? "Edit Feedback" : "Add Faculty Feedback"}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label>Course</label>
              <select value={courseId} onChange={e => setCourseId(e.target.value)}>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.coursename}</option>)}
              </select>
            </div>
            <div>
              <label>Batch</label>
              <select value={batchId} onChange={e => setBatchId(e.target.value)}>
                <option value="">-- Select Batch --</option>
                {batches.map(b => <option key={b.batch_id} value={b.batch_id}>{b.batchname}</option>)}
              </select>
            </div>
            <div>
              <label>Subject</label>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
                <option value="">-- Select Subject --</option>
                {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subjectname}</option>)}
              </select>
            </div>
            <div>
              <label>Faculty</label>
              <select value={facultyId} onChange={e => setFacultyId(e.target.value)}>
                <option value="">-- Select Faculty --</option>
                {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.facultyname}</option>)}
              </select>
            </div>
            <div>
              <label>Feedback Type</label>
              <select value={feedbackTypeId} onChange={e => setFeedbackTypeId(e.target.value)}>
                <option value="">-- Select Feedback Type --</option>
                {feedbackTypes.map(t => <option key={t.feedbacktype_id} value={t.feedbacktype_id}>{t.fbtypename}</option>)}
              </select>
            </div>
            <div>
              <label>Module Type</label>
              <select value={moduleTypeId} onChange={e => setModuleTypeId(e.target.value)}>
                <option value="">-- Select Module Type --</option>
                {moduleTypes.map(m => <option key={m.feedbackmoduletype_id} value={m.feedbackmoduletype_id}>{m.fbmoduletypename}</option>)}
              </select>
            </div>
            <div>
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label>PDF {feedbackId ? "(Leave blank to keep existing)" : ""}</label>
              <input type="file" onChange={e => setPdfFile(e.target.files[0])} />
            </div>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button type="submit" className="btn btn-success" style={{ padding: "10px 30px" }}>{feedbackId ? "Update Feedback" : "Add Feedback"}</button>
            {feedbackId && <button type="button" onClick={resetForm} className="btn btn-secondary" style={{ marginLeft: "10px", padding: "10px 20px" }}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* Feedback List */}
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#fff" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Feedback List</h2>
        <table className="table table-bordered" style={{ width: "100%", textAlign: "left" }}>
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
            {feedbackList.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>No feedback available</td>
              </tr>
            )}
            {feedbackList.map(f => (
              <tr key={f.addfeedback_id}>
                <td>{f.coursename}</td>
                <td>{f.batchname || "-"}</td>
                <td>{f.subjectname}</td>
                <td>{f.facultyname}</td>
                <td>{f.fbtypename}</td>
                <td>{f.fbmoduletypename}</td>
                <td>{f.date}</td>
                <td>{f.pdf_file ? <a href={createUrl(`feedback_reports/${f.pdf_file}`)} target="_blank" rel="noreferrer">View</a> : "-"}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(f)} style={{ marginRight: "5px" }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.addfeedback_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
