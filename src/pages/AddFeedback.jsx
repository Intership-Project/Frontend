import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addFeedback,
  getBatchesByCourse,
  getCourses,
  getFaculties,
  getFeedbackTypes,
  getModuleTypesByFeedbackType,
  getSubjectsByCourse
} from "../services/addfeedback";

export default function AddFeedback() {
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

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const coursesRes = await getCourses();
      if (coursesRes.status === "success") setCourses(coursesRes.data);
      else toast.error(coursesRes.error);

      const facultiesRes = await getFaculties();
      if (facultiesRes.status === "success") setFaculties(facultiesRes.data);
      else toast.error(facultiesRes.error);

      const feedbackTypesRes = await getFeedbackTypes();
      if (feedbackTypesRes.status === "success") setFeedbackTypes(feedbackTypesRes.data);
      else toast.error(feedbackTypesRes.error);
    }
    loadData();
  }, []);

  // Load subjects & batches when course changes
  useEffect(() => {
    async function loadCourseDetails() {
      if (!courseId) {
        setSubjects([]);
        setBatches([]);
        setSubjectId("");
        setBatchId("");
        return;
      }

      const subjectsRes = await getSubjectsByCourse(courseId);
      if (subjectsRes.status === "success") setSubjects(subjectsRes.data);
      else setSubjects([]);

      const batchesRes = await getBatchesByCourse(courseId);
      if (batchesRes.status === "success") setBatches(batchesRes.data);
      else setBatches([]);
    }
    loadCourseDetails();
  }, [courseId]);

  // Load module types when feedback type changes
  useEffect(() => {
    async function loadModuleTypes() {
      if (!feedbackTypeId) {
        setModuleTypes([]);
        setModuleTypeId("");
        return;
      }

      const res = await getModuleTypesByFeedbackType(feedbackTypeId);
      if (res.status === "success") setModuleTypes(res.data);
      else setModuleTypes([]);
    }
    loadModuleTypes();
  }, [feedbackTypeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !subjectId || !facultyId || !feedbackTypeId || !moduleTypeId || !date) {
      toast.warn("Please fill all required fields");
      return;
    }

    const res = await addFeedback({ courseId, batchId, subjectId, facultyId, feedbackTypeId, moduleTypeId, date, pdfFile });
    if (res.status === "success") {
      toast.success("Feedback added successfully");
      setCourseId(""); setBatchId(""); setSubjectId(""); setFacultyId(""); setFeedbackTypeId(""); setModuleTypeId(""); setDate(""); setPdfFile(null);
      setBatches([]); setSubjects([]); setModuleTypes([]);
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px", margin: "30px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Faculty Feedback (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {/* Course */}
          <div className="form-group">
            <label>Course</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)}>
              <option value="">-- Select Course --</option>
              {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.coursename}</option>)}
            </select>
          </div>

          {/* Batch */}
          <div className="form-group">
            <label>Batch</label>
            <select value={batchId} onChange={e => setBatchId(e.target.value)}>
              <option value="">-- Select Batch --</option>
              {batches.map(b => <option key={b.batch_id} value={b.batch_id}>{b.batchname}</option>)}
            </select>
          </div>

          {/* Subject */}
          <div className="form-group">
            <label>Subject</label>
            <select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
              <option value="">-- Select Subject --</option>
              {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subjectname}</option>)}
            </select>
          </div>

          {/* Faculty */}
          <div className="form-group">
            <label>Faculty</label>
            <select value={facultyId} onChange={e => setFacultyId(e.target.value)}>
              <option value="">-- Select Faculty --</option>
              {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.facultyname}</option>)}
            </select>
          </div>

          {/* Feedback Type */}
          <div className="form-group">
            <label>Feedback Type</label>
            <select value={feedbackTypeId} onChange={e => setFeedbackTypeId(e.target.value)}>
              <option value="">-- Select Feedback Type --</option>
              {feedbackTypes.map(t => <option key={t.feedbacktype_id} value={t.feedbacktype_id}>{t.fbtypename}</option>)}
            </select>
          </div>

          {/* Feedback Module Type */}
          <div className="form-group">
            <label>Feedback Module Type</label>
            <select value={moduleTypeId} onChange={e => setModuleTypeId(e.target.value)}>
              <option value="">-- Select Module Type --</option>
              {moduleTypes.map(m => <option key={m.feedbackmoduletype_id} value={m.feedbackmoduletype_id}>{m.fbmoduletypename}</option>)}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {/* PDF Upload */}
          <div className="form-group">
            <label>PDF File</label>
            <input type="file" onChange={e => setPdfFile(e.target.files[0])} />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" className="btn btn-success" style={{ padding: "10px 30px" }}>Add Feedback</button>
        </div>
      </form>
    </div>
  );
}
