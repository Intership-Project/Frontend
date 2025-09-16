import axios from "axios";
import { createUrl, createError } from "../utils";

const getToken = () => sessionStorage.getItem("token");




// Fetch all filled feedbacks (for faculty/CC view)
export async function fetchFacultyFilledFeedback() {
  try {
    const res = await axios.get(createUrl("coursecordinator/feedbacks"), {
      headers: { token: getToken() },
    });
    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return createError(res.data.error || "Failed to fetch feedbacks");
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
}

// Fetch feedback details for a specific schedulefeedback_id
export async function getFacultyFeedbackDetails(schedulefeedback_id) {
  try {
    const res = await axios.get(createUrl(`coursecordinator/feedbacks/${schedulefeedback_id}`), {
      headers: { token: getToken() },
    });
    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return createError(res.data.error || "Failed to fetch feedback details");
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
}

// Download a single filled feedback PDF by filledfeedbacks_id
export async function downloadSingleFeedbackPDF(filledfeedbacks_id) {
  try {
    const res = await axios.get(
    createUrl(`coursecordinator/download/${filledfeedbacks_id}`), 
    {
      headers: { token: getToken() },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `filledfeedback-${filledfeedbacks_id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { status: "success" };
  } catch (err) {
    return createError(err.response?.data?.error || err.message || "Failed to download PDF");
  }
}

// Fetch course assigned to logged-in CC
export async function fetchMyCourse() {
  try {
    const res = await axios.get(createUrl("coursecordinator/my-course"), {
      headers: { token: getToken() },
    });
    if (res.data.status === "success") return { status: "success", data: res.data.data };
    return { status: "error", error: res.data.error || "Failed to fetch course" };
  } catch (err) {
    return { status: "error", error: err.message || "Server error" };
  }
}
