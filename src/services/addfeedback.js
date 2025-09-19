import axios from "axios";
import { createError, createUrl } from "./utils";

const getToken = () => sessionStorage.getItem("token");

// Fetch all courses
export const getCourses = async () => {
  try {
    const res = await axios.get(createUrl("course"), { headers: { token: getToken() } });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};

// Fetch batches by course
export const getBatchesByCourse = async (courseId) => {
  try {
    const res = await axios.get(createUrl(`batch/course/${courseId}`), { headers: { token: getToken() } });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};

// Fetch subjects by course
export const getSubjectsByCourse = async (courseId) => {
  try {
    const res = await axios.get(createUrl(`subject/course/${courseId}`), { headers: { token: getToken() } });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};

// Fetch faculties
export const getFaculties = async () => {
  try {
    const res = await axios.get(createUrl("faculty"), { headers: { token: getToken() } });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};

// Fetch feedback types
export const getFeedbackTypes = async () => {
  try {
    const res = await axios.get(createUrl("feedbacktype"), { headers: { token: getToken() } });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};

// Fetch module types by feedback type
export const getModuleTypesByFeedbackType = async (feedbacktype_id) => {
  try {
    const res = await axios.get(createUrl("feedbackmoduletype"), { headers: { token: getToken() } });
    if (res.data.status !== "success") return { status: "error", data: [] };
    const filtered = res.data.data.filter((m) => m.feedbacktype_id === parseInt(feedbacktype_id));
    return { status: "success", data: filtered };
  } catch (err) {
    return { status: "error", data: [] };
  }
};

// Add feedback
export const addFeedback = async ({ courseId, batchId, subjectId, facultyId, feedbackTypeId, moduleTypeId, date, pdfFile }) => {
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


    const res = await axios.post(createUrl("addfeedback"), formData, {

      headers: { token: getToken(), "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    return { status: "error", error: err.response?.data?.error || err.message };
  }
};


// Get all feedbacks
export const getFeedbackList = async () => {
  try {
    const res = await axios.get(createUrl("addfeedback"), { headers: { token: getToken() } });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
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

