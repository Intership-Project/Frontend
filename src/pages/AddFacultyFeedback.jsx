import React, { useState, useEffect } from "react";
import FacultySidebar from "../components/FacultySidebar";
import "../components/FacultySidebar.css"; 
import { toast } from "react-toastify";
import {
  addFacultyFeedback,
  fetchSubjects,
  fetchFaculties,
  fetchFeedbackTypes,
  fetchModuleTypes,
  fetchFacultyBatches,
  fetchMyCourse,
} from "../services/addfacultyfeedback";
import "./AddFacultyFeedback.css";




function AddFacultyFeedback() {
  const [courseId, setCourseId] = useState(""); // CC's assigned course
  const [batchId, setBatchId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [feedbackTypeId, setFeedbackTypeId] = useState("");
  const [feedbackModuleTypeId, setFeedbackModuleTypeId] = useState("");
  const [date, setDate] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const [batches, setBatches] = useState([]);
  const [facultyRoleId, setFacultyRoleId] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [feedbackModuleTypes, setFeedbackModuleTypes] = useState([]);

  // Fetch CC's course and subjects
  useEffect(() => {
    async function loadInitialData() {
      const courseRes = await fetchMyCourse();
      if (courseRes.status === "success" && courseRes.data) {
        console.log("CC's course:", courseRes.data);
        setCourseId(courseRes.data.course_id);

        // Load subjects of this course
        const subjRes = await fetchSubjects(courseRes.data.course_id);
        console.log("Subjects API raw response:", subjRes);

        if (subjRes.status === "success") {
          const data = subjRes.data;
          setSubjects(Array.isArray(data) ? data : [data]); // wrap single object into array
        } else {
          toast.error(subjRes.error || "Failed to fetch subjects");
          setSubjects([]);
        }
      } else {
        toast.error(courseRes.error || "Failed to fetch your course");
      }
    }

    loadInitialData();
  }, []);


  // Load faculties
  useEffect(() => {
    async function loadFaculties() {
      const res = await fetchFaculties();
      if (res.status === "success") setFaculties(res.data || []);
      else toast.error(res.error || "Failed to load faculties");
    }
    loadFaculties();
  }, []);

  // Load batches when faculty changes
  useEffect(() => {
    async function loadBatches() {
      if (!facultyId) {
        setBatches([]);
        setFacultyRoleId(null);
        setBatchId("");
        return;
      }
      const res = await fetchFacultyBatches(facultyId);
      if (res.status === "success") {
        setBatches(res.batches || []);
        setFacultyRoleId(res.role_id);
        if (res.role_id !== 1) setBatchId("");
      } else {
        setBatches([]);
        setFacultyRoleId(null);
        setBatchId("");
        toast.error(res.error || "Failed to load batches");
      }
    }
    loadBatches();
  }, [facultyId]);

  // Load feedback types
  useEffect(() => {
    async function loadFeedbackTypes() {
      const res = await fetchFeedbackTypes();
      if (res.status === "success") setFeedbackTypes(res.data || []);
      else setFeedbackTypes([]);
    }
    loadFeedbackTypes();
  }, []);

  // Load module types after feedback type is selected
  useEffect(() => {
    async function loadModuleTypes() {
      const res = await fetchModuleTypes(feedbackTypeId);
      if (res.status === "success") setFeedbackModuleTypes(res.data || []);
      else setFeedbackModuleTypes([]);
    }
    if (feedbackTypeId) loadModuleTypes();
  }, [feedbackTypeId]);

  // Form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      !subjectId ||
      !facultyId ||
      !feedbackTypeId ||
      !feedbackModuleTypeId ||
      !date
    ) {
      toast.warn("Please fill all required fields");
      return;
    }

    const result = await addFacultyFeedback({
      courseId,
      batchId: facultyRoleId === 1 ? batchId : null,
      subjectId,
      facultyId,
      moduleTypeId: feedbackModuleTypeId,
      feedbackTypeId,
      date,
      pdfFile,
    });

    if (result.status === "success") {
      toast.success("Feedback added successfully");
      setBatchId("");
      setSubjectId("");
      setFacultyId("");
      setFeedbackTypeId("");
      setFeedbackModuleTypeId("");
      setDate("");
      setPdfFile(null);
      setBatches([]);
      setSubjects(subjects); // keep subjects 
      setFeedbackModuleTypes([]);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <>
      <FacultySidebar />
      <div className="container">
        <h2>Add Faculty Feedback</h2>
        <form onSubmit={onSubmit}>
          {/* Faculty */}
          <div className="form-group">
            <label>Faculty</label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            >
              <option value="">-- Select Faculty --</option>
              {faculties.map((f) => (
                <option key={f.faculty_id} value={f.faculty_id}>
                  {f.facultyname}
                </option>
              ))}
            </select>
          </div>

          {/* Batch (only for Lab Mentor) */}
          {facultyRoleId === 1 && (
            <div className="form-group">
              <label>Batch</label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              >
                <option value="">-- Select Batch --</option>
                {batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batchname}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          <div className="form-group">
            <label>Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">-- Select Subject --</option>
              {Array.isArray(subjects) &&
                subjects.map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subjectname}
                  </option>
                ))}
            </select>
          </div>

          {/* Feedback Type */}
          <div className="form-group">
            <label>Feedback Type</label>
            <select
              value={feedbackTypeId}
              onChange={(e) => setFeedbackTypeId(e.target.value)}
            >
              <option value="">-- Select Feedback Type --</option>
              {feedbackTypes.map((t) => (
                <option key={t.feedbacktype_id} value={t.feedbacktype_id}>
                  {t.fbtypename}
                </option>
              ))}
            </select>
          </div>

          {/* Feedback Module Type */}
          <div className="form-group">
            <label>Feedback Module Type</label>
            <select
              value={feedbackModuleTypeId}
              onChange={(e) => setFeedbackModuleTypeId(e.target.value)}
            >
              <option value="">-- Select Module Type --</option>
              {feedbackModuleTypes.map((m) => (
                <option key={m.feedbackmoduletype_id} value={m.feedbackmoduletype_id}>
                  {m.fbmoduletypename}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* PDF Upload */}
          <div className="form-group">
            <label>PDF File</label>
            <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
          </div>

          <button type="submit" className="btn btn-success">
            Add Feedback
          </button>
        </form>
      </div>
    </>
  );
}

export default AddFacultyFeedback;



