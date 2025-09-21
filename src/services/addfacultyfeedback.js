import axios from "axios";
import { createUrl, createError } from "../utilss";




// // Fetch feedback details for a specific schedule
// export async function getCCFeedbackDetails(schedulefeedback_id) {
//   try {
//     const token = sessionStorage.getItem("token"); 
//     const res = await axios.get(
//       createUrl(`coursecordinator/feedbacks/${schedulefeedback_id}`),
//       { headers: { token } }
//     );

//     if (res.data.status === "success") {
//       return res.data.data;
//     } else {
//       return createError(res.data.error || "Failed to fetch details");
//     }
//   } catch (err) {
//     return createError(err.message || "Server error");
//   }
// }



// Fetch CC assigned course
export async function fetchMyCourse() {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(createUrl("coursecordinator/my-course"), { headers: { token } });
    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return { status: "error", error: res.data.error || "Failed to fetch course" };
  } catch (err) {
    return { status: "error", error: err.message || "Server error" };
  }
}



// Fetch faculties 
export async function fetchFaculties() {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(createUrl("faculty/trainers-labs"), { headers: { token } });

    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return { status: "error", error: res.data.error || "Failed to fetch faculties" };
  } catch (err) {
    return { status: "error", error: err.message || "Server error" };
  }
}




// Fetch batches for a faculty
export async function fetchFacultyBatches(facultyId) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(createUrl(`batch/batches/${facultyId}`), {
      headers: { token }
    });

    if (res.data.status === "success") {
      return { status: "success", batches: res.data.data.batches, role_id: res.data.data.role_id };
    }
    return { status: "error", error: res.data.error || "Failed to fetch batches" };
  } catch (err) {
    return { status: "error", error: err.message || "Server error" };
  }
}





// Fetch subjects for a course
export async function fetchSubjects(courseId) {
  try {
    const token = sessionStorage.getItem("token");
    console.log("Calling /subject with courseId:", courseId, "token:", token);
    const res = await axios.get(createUrl(`subject/course/${courseId}`), { headers: { token } });
    console.log("Raw axios subject response:", res.data);
    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return { status: "error", error: res.data.error || "Failed to fetch subjects" };
  } catch (err) {
    return { status: "error", error: err.message || "Server error" };
  }
}




// Fetch feedback types for a course
export async function fetchFeedbackTypes() {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(createUrl(`feedbacktype`), { headers: { token } });
    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return { status: "error", error: res.data.error || "Failed to fetch feedback types" };
  } catch (err) {
    return { status: "error", error: err.message || "Server error" };
  }
}


// Fetch module types for selected feedback type
export async function fetchModuleTypes(feedbackTypeId) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(createUrl(`feedbackmoduletype/type/${feedbackTypeId}`), { headers: { token } });
    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return { status: "error", error: res.data.error || "Failed to fetch module types" };
  } catch (err) {
    return { status: "error", error: err.message || "Server error" };
  }
}



// Add faculty feedback
export async function addFacultyFeedback({ courseId, batchId, subjectId, facultyId, moduleTypeId, feedbackTypeId, date, pdfFile }) {
  try {
    const url = createUrl("coursecordinator/add-feedback");
    const formData = new FormData();
    formData.append("course_id", courseId);
    if (batchId) formData.append("batch_id", batchId);
    formData.append("subject_id", subjectId);
    formData.append("faculty_id", facultyId);
    formData.append("feedbackmoduletype_id", moduleTypeId);
    formData.append("feedbacktype_id", feedbackTypeId);
    formData.append("date", date);
    if (pdfFile) formData.append("pdf_file", pdfFile);

    const token = sessionStorage.getItem("token");
    const headers = { token, "Content-Type": "multipart/form-data" };
    const response = await axios.post(url, formData, { headers });
    return response.data;
  } catch (ex) {
    return { status: "error", error: ex.response?.data?.error || ex.message };
  }
}
