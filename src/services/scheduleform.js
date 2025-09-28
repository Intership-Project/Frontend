import axios from "axios";

const API_BASE = "http://localhost:4000";
const getToken = () => sessionStorage.getItem("token");

const handleError = (err) => ({
  status: "error",
  error: err.response?.data?.error || err.message || "Unknown error",
});


// Courses
export const getCourses = async () => {
  try {
    const res = await axios.get(`${API_BASE}/course`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// Batches by course
export const getBatchesByCourse = async (courseId) => {
  if (!courseId) return [];
  try {
    const res = await axios.get(`${API_BASE}/batch/course/${courseId}`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};



// Subjects by course
export const getSubjectsByCourse = async (courseId) => {
  if (!courseId) return [];
  try {
    const res = await axios.get(`${API_BASE}/subject/course/${courseId}`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};



// Faculties by role
export const getFaculties = async (roleId) => {
  if (!roleId) return [];
  try {
    const res = await axios.get(`${API_BASE}/faculty/role/${roleId}`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};



// Feedback types
export const getFeedbackTypes = async () => {
  try {
    const res = await axios.get(`${API_BASE}/feedbacktype`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};



// Feedback modules by feedback type
export const getFeedbackModules = async (feedbackTypeId) => {
  if (!feedbackTypeId) return [];
  try {
    const res = await axios.get(`${API_BASE}/feedbackmoduletype/type/${feedbackTypeId}`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};



// Update Schedule Feedback
export const updateScheduleFeedback = async (id, payload) => {
  try {
    const res = await axios.put(`${API_BASE}/schedulefeedback/${id}`, payload, {
      headers: { token: getToken() }
    });
    return res.data; 
  } catch (err) {
    return handleError(err);
  }
};


