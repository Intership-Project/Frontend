import axios from "axios";
import { createUrl, createError } from "../utils";



// Fetch dashboard stats for a course
export async function fetchDashboardStats(courseId) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(createUrl(`filledfeedback/stats/${courseId}`), {
      headers: { token },
    });
    console.log("API returned:", res.data);
    return res.data;
  } catch (ex) {
    return createError(ex.response?.data?.error || ex.message);
  }
}

// Fetch recent feedbacks for a course
export async function fetchRecentFeedbacks(courseId) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(createUrl(`filledfeedback/recent/${courseId}`), { headers: { token } });
    return res.data;
  } catch (ex) {
    return createError(ex.response?.data?.error || ex.message);
  }
}


// Update feedback status (Pending -> Reviewed)
export async function updateFeedbackStatus(feedbackId, status) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.put(
      createUrl(`filledfeedback/${feedbackId}/status`), 
      { status }, 
      { headers: { token } }
    );
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
}



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



export async function getFeedbackDetails(feedbackId) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(createUrl(`filledfeedback/details/${feedbackId}`), {
      headers: { token },
    });
    console.log("Feedback details response:", res.data); 
    return res.data; 
  } catch (err) {
    console.error(err);
    return { status: "error", data: [] };
  }
}