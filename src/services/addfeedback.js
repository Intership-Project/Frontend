import axios from "axios";
import { createUrl } from "../utils";

const getToken = () => sessionStorage.getItem("token");

// Courses
export const getCourses = async () => {
  try {
    const res = await axios.get(createUrl("course"), { headers: { token: getToken() } });
    return res.data.status === "success" ? { status: "success", data: res.data.data } : { status: "error", error: res.data.error || "Failed to fetch courses" };
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
};

// Faculties
export async function getFaculties() {
  try {
    const res = await axios.get(createUrl("faculty/trainers-labs"), { headers: { token: getToken() } });
    return res.data.status === "success" ? { status: "success", data: res.data.data } : { status: "error", error: res.data.error || "Failed to fetch faculties" };
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
}

// Batches
export async function getBatchesByCourse(courseId) {
  try {
    const res = await axios.get(createUrl(`batch/course/${courseId}`), { headers: { token: getToken() } });
    if (res.data.status === "success") {
      let batches = Array.isArray(res.data.data) ? res.data.data : res.data.data?.batches || [];
      return { status: "success", batches };
    }
    return { status: "error", error: res.data.error || "Failed to fetch batches" };
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
}

// Subjects
export const getSubjectsByCourse = async (courseId) => {
  try {
    const res = await axios.get(createUrl(`subject/course/${courseId}`), { headers: { token: getToken() } });
    return res.data.status === "success" ? { status: "success", data: res.data.data } : { status: "error", error: res.data.error || "Failed to fetch subjects" };
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
};

// Feedback Types
export async function getFeedbackTypes() {
  try {
    const res = await axios.get(createUrl("feedbacktype"), { headers: { token: getToken() } });
    return res.data.status === "success" ? { status: "success", data: res.data.data } : { status: "error", error: res.data.error || "Failed to fetch feedback types" };
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
}

// Module Types
export async function getModuleTypesByFeedbackType(feedbackTypeId) {
  try {
    const res = await axios.get(createUrl(`feedbackmoduletype/type/${feedbackTypeId}`), { headers: { token: getToken() } });
    return res.data.status === "success" ? { status: "success", data: res.data.data } : { status: "error", error: res.data.error || "Failed to fetch module types" };
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
}

// Add Feedback
export async function addFeedback({ courseId, batchId, subjectId, facultyId, moduleTypeId, feedbackTypeId, date, pdfFile }) {
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

    const res = await axios.post(createUrl("addfeedback"), formData, { headers: { token: getToken(), "Content-Type": "multipart/form-data" } });
    return res.data;
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
}

// Get Feedback List
export const getFeedbackList = async () => {
  try {
    const res = await axios.get(createUrl("addfeedback"), { headers: { token: getToken() } });
    return res.data.status === "success" ? { status: "success", data: res.data.data } : { status: "error", error: res.data.error };
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
};





// Delete feedback
export const deleteFeedback = async (id) => {
  try {
    const res = await axios.delete(createUrl(`addfeedback/${id}`), { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
};


// Update Feedback
export const updateFeedback = async (id, { courseId, batchId, subjectId, facultyId, moduleTypeId, feedbackTypeId, date, pdfFile }) => {
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

    const res = await axios.put(createUrl(`addfeedback/update/${id}`), formData, {
      headers: { token: sessionStorage.getItem("token"), "Content-Type": "multipart/form-data" }
    });

    return res.data;
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
};
