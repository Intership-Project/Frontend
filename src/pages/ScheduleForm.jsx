// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   getBatchesByCourse,
//   getCourses,
//   getFaculties,
//   getFeedbackModules,
//   getFeedbackTypes,
//   getSubjectsByCourse,
// } from "../services/scheduleform";

// const ScheduleForm = () => {
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [feedbackTypes, setFeedbackTypes] = useState([]);
//   const [feedbackModules, setFeedbackModules] = useState([]);
//   const [roles] = useState([
//     { id: 6, name: "Trainer" },
//     { id: 1, name: "Lab Mentor" },
//   ]);
//   const [faculties, setFaculties] = useState([]);
//   const [batches, setBatches] = useState([]);

//   const [form, setForm] = useState({
//     course_id: "",
//     subject_id: "",
//     feedbacktype_id: "",
//     feedbackmoduletype_id: "",
//     role_id: "",
//     faculty_id: "",
//     batch_id: "",
//     StartDate: "",
//     EndDate: "",
//   });

//   // Load Courses & Feedback Types
//   useEffect(() => {
//     getCourses().then((res) => res.status === "success" && setCourses(res.data));
//     getFeedbackTypes().then(
//       (res) => res.status === "success" && setFeedbackTypes(res.data)
//     );
//   }, []);

//   // Load Subjects by course
//   useEffect(() => {
//     if (!form.course_id) return setSubjects([]);
//     getSubjectsByCourse(form.course_id).then(
//       (res) => res.status === "success" && setSubjects(res.data)
//     );
//   }, [form.course_id]);

//   // Load Feedback Modules by feedback type
//   useEffect(() => {
//     if (!form.feedbacktype_id) return setFeedbackModules([]);
//     getFeedbackModules(form.feedbacktype_id).then(
//       (res) => res.status === "success" && setFeedbackModules(res.data)
//     );
//   }, [form.feedbacktype_id]);

//   // Load Faculties by role
//   useEffect(() => {
//     if (!form.role_id) return setFaculties([]);
//     getFaculties(form.role_id).then(
//       (res) => res.status === "success" && setFaculties(res.data)
//     );
//   }, [form.role_id]);

//   // Load Batches by course (only for Lab Mentor)
//   useEffect(() => {
//     if (!form.course_id || form.role_id !== "1") return setBatches([]);
//     getBatchesByCourse(form.course_id).then(
//       (res) => res.status === "success" && setBatches(res.data)
//     );
//   }, [form.course_id, form.role_id]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   // Add & save to backend
//   const handleAdd = async () => {
//     try {
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         alert("Authentication required. Please login.");
//         window.location.href = "/login";
//         return;
//       }

//       // Convert empty strings to null, and batch_id null if role is not Lab Mentor
//       const payload = { ...form };
//       Object.keys(payload).forEach((key) => {
//         if (payload[key] === "" || (key === "batch_id" && form.role_id !== "1")) {
//           payload[key] = null;
//         }
//       });

//       const res = await axios.post(
//         "http://localhost:4000/schedulefeedback",
//         payload,
//         { headers: { token } }
//       );

//       if (res.data.status === "success") {
//         alert("Schedule saved successfully!");
//         setForm({
//           course_id: "",
//           subject_id: "",
//           feedbacktype_id: "",
//           feedbackmoduletype_id: "",
//           role_id: "",
//           faculty_id: "",
//           batch_id: "",
//           StartDate: "",
//           EndDate: "",
//         });
//       } else {
//         alert("Error saving schedule: " + JSON.stringify(res.data.error));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error connecting to backend");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Schedule Feedback</h2>

//       <div style={styles.row}>
//         <label style={styles.label}>Course:</label>
//         <select
//           name="course_id"
//           value={form.course_id}
//           onChange={handleChange}
//           style={styles.select}
//         >
//           <option value="">Select Course</option>
//           {courses.map((c) => (
//             <option key={c.course_id} value={c.course_id}>
//               {c.coursename}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>Subject:</label>
//         <select
//           name="subject_id"
//           value={form.subject_id}
//           onChange={handleChange}
//           style={styles.select}
//         >
//           <option value="">Select Subject</option>
//           {subjects.map((s) => (
//             <option key={s.subject_id} value={s.subject_id}>
//               {s.subjectname}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>Feedback Type:</label>
//         <select
//           name="feedbacktype_id"
//           value={form.feedbacktype_id}
//           onChange={handleChange}
//           style={styles.select}
//         >
//           <option value="">Select Feedback Type</option>
//           {feedbackTypes.map((ft) => (
//             <option key={ft.feedbacktype_id} value={ft.feedbacktype_id}>
//               {ft.fbtypename}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>Feedback Module Type:</label>
//         <select
//           name="feedbackmoduletype_id"
//           value={form.feedbackmoduletype_id}
//           onChange={handleChange}
//           style={styles.select}
//         >
//           <option value="">Select Module</option>
//           {feedbackModules.map((fm) => (
//             <option key={fm.feedbackmoduletype_id} value={fm.feedbackmoduletype_id}>
//               {fm.fbmoduletypename}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>Role:</label>
//         <select
//           name="role_id"
//           value={form.role_id}
//           onChange={handleChange}
//           style={styles.select}
//         >
//           <option value="">Select Role</option>
//           {roles.map((r) => (
//             <option key={r.id} value={r.id}>
//               {r.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>Faculty:</label>
//         <select
//           name="faculty_id"
//           value={form.faculty_id}
//           onChange={handleChange}
//           style={styles.select}
//         >
//           <option value="">Select Faculty</option>
//           {faculties.map((f) => (
//             <option key={f.faculty_id} value={f.faculty_id}>
//               {f.facultyname}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>Batch:</label>
//         <select
//           name="batch_id"
//           value={form.batch_id}
//           onChange={handleChange}
//           disabled={form.role_id !== "1"}
//           style={styles.select}
//         >
//           <option value="">Select Batch</option>
//           {batches.map((b) => (
//             <option key={b.batch_id} value={b.batch_id}>
//               {b.batchname}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>Start Date:</label>
//         <input
//           type="date"
//           name="StartDate"
//           value={form.StartDate}
//           onChange={handleChange}
//           style={styles.select}
//         />
//       </div>

//       <div style={styles.row}>
//         <label style={styles.label}>End Date:</label>
//         <input
//           type="date"
//           name="EndDate"
//           value={form.EndDate}
//           onChange={handleChange}
//           style={styles.select}
//         />
//       </div>

//       <button style={styles.button} onClick={handleAdd}>
//         Add & Save
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "900px",
//     margin: "20px auto",
//     padding: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     backgroundColor: "#f9f9f9",
//     fontFamily: "Arial, sans-serif",
//   },
//   heading: { textAlign: "center", marginBottom: "20px" },
//   row: { display: "flex", marginBottom: "15px", alignItems: "center" },
//   label: { width: "180px", fontWeight: "bold" },
//   select: { flex: 1, padding: "5px", borderRadius: "5px", border: "1px solid #ccc" },
//   button: {
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

// export default ScheduleForm;


import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  getBatchesByCourse,
  getCourses,
  getFaculties,
  getFeedbackModules,
  getFeedbackTypes,
  getSubjectsByCourse,
} from "../services/scheduleform";

const ScheduleForm = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [feedbackModules, setFeedbackModules] = useState([]);
  const [roles] = useState([
    { id: 6, name: "Trainer" },
    { id: 1, name: "Lab Mentor" },
  ]);
  const [faculties, setFaculties] = useState([]);
  const [batches, setBatches] = useState([]);

  const [form, setForm] = useState({
    course_id: "",
    subject_id: "",
    feedbacktype_id: "",
    feedbackmoduletype_id: "",
    role_id: "",
    faculty_id: "",
    batch_id: "",
    StartDate: "",
    EndDate: "",
  });

  // Load Courses & Feedback Types
  useEffect(() => {
    getCourses().then((res) => res.status === "success" && setCourses(res.data));
    getFeedbackTypes().then(
      (res) => res.status === "success" && setFeedbackTypes(res.data)
    );
  }, []);

  // Load Subjects by course
  useEffect(() => {
    if (!form.course_id) return setSubjects([]);
    getSubjectsByCourse(form.course_id).then(
      (res) => res.status === "success" && setSubjects(res.data)
    );
  }, [form.course_id]);

  // Load Feedback Modules by feedback type
  useEffect(() => {
    if (!form.feedbacktype_id) return setFeedbackModules([]);
    getFeedbackModules(form.feedbacktype_id).then(
      (res) => res.status === "success" && setFeedbackModules(res.data)
    );
  }, [form.feedbacktype_id]);

  // Load Faculties by role
  useEffect(() => {
    if (!form.role_id) return setFaculties([]);
    getFaculties(form.role_id).then(
      (res) => res.status === "success" && setFaculties(res.data)
    );
  }, [form.role_id]);

  // Load Batches by course (only for Lab Mentor)
  useEffect(() => {
    if (!form.course_id) {
      setBatches([]);
      return;
    }

    if (form.role_id === "1") {
      getBatchesByCourse(form.course_id).then((res) => {
        if (res.status === "success" && Array.isArray(res.data)) {
          setBatches(res.data);
        } else if (Array.isArray(res)) {
          setBatches(res);
        } else {
          setBatches([]);
          console.warn("Batches could not be loaded:", res);
        }
      });
    } else {
      setBatches([]); // Trainer → clear
    }
  }, [form.course_id, form.role_id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add & save to backend
  const handleAdd = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Authentication required. Please login.");
        window.location.href = "/login";
        return;
      }

      // Convert empty strings to null, and batch_id null if role is not Lab Mentor
      const payload = { ...form };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || (key === "batch_id" && form.role_id !== "1")) {
          payload[key] = null;
        }
      });

      const res = await axios.post(
        "http://localhost:4000/schedulefeedback",
        payload,
        { headers: { token } }
      );

      if (res.data.status === "success") {
        alert("Schedule saved successfully!");
        setForm({
          course_id: "",
          subject_id: "",
          feedbacktype_id: "",
          feedbackmoduletype_id: "",
          role_id: "",
          faculty_id: "",
          batch_id: "",
          StartDate: "",
          EndDate: "",
        });
      } else {
        alert("Error saving schedule: " + JSON.stringify(res.data.error));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Schedule Feedback</h2>

      <div style={styles.row}>
        <label style={styles.label}>Course:</label>
        <select
          name="course_id"
          value={form.course_id}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>
              {c.coursename}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Subject:</label>
        <select
          name="subject_id"
          value={form.subject_id}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subjectname}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Feedback Type:</label>
        <select
          name="feedbacktype_id"
          value={form.feedbacktype_id}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Feedback Type</option>
          {feedbackTypes.map((ft) => (
            <option key={ft.feedbacktype_id} value={ft.feedbacktype_id}>
              {ft.fbtypename}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Feedback Module Type:</label>
        <select
          name="feedbackmoduletype_id"
          value={form.feedbackmoduletype_id}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Module</option>
          {feedbackModules.map((fm) => (
            <option key={fm.feedbackmoduletype_id} value={fm.feedbackmoduletype_id}>
              {fm.fbmoduletypename}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Role:</label>
        <select
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Faculty:</label>
        <select
          name="faculty_id"
          value={form.faculty_id}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Faculty</option>
          {faculties.map((f) => (
            <option key={f.faculty_id} value={f.faculty_id}>
              {f.facultyname}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Batch:</label>
        <select
          name="batch_id"
          value={form.batch_id}
          onChange={handleChange}
          disabled={form.role_id !== "1"} // Enabled only for Lab Mentor
          style={styles.select}
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b.batch_id} value={b.batch_id}>
              {b.batchname}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Start Date:</label>
        <input
          type="date"
          name="StartDate"
          value={form.StartDate}
          onChange={handleChange}
          style={styles.select}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>End Date:</label>
        <input
          type="date"
          name="EndDate"
          value={form.EndDate}
          onChange={handleChange}
          style={styles.select}
        />
      </div>

      <button style={styles.button} onClick={handleAdd}>
        Add & Save
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  heading: { textAlign: "center", marginBottom: "20px" },
  row: { display: "flex", marginBottom: "15px", alignItems: "center" },
  label: { width: "180px", fontWeight: "bold" },
  select: { flex: 1, padding: "5px", borderRadius: "5px", border: "1px solid #ccc" },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ScheduleForm;
