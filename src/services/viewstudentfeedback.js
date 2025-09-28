import axios from "axios";
import { createError, createUrl } from "../utils";



// Helper to get token from session
function getToken() {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("Auth token not found. Please login.");
  return token;
}



// Fetch all feedbacks for CC's course
export async function fetchCourseFeedbacks(courseId) {
  try {
    const res = await axios.get(createUrl(`filledfeedback/course/${courseId}/grouped`), {
      headers: { token: getToken() },
    });
    return res.data; 

  } catch (err) {
    console.error("fetchCourseFeedbacks error:", err);
    return createError(err.response?.data?.error || err.message);
  }
}




//  Download PDF of all responses for a schedule
export async function downloadStudentResponsesPDF(schedulefeedback_id) {
  try {
    const res = await axios.get(
      createUrl(`filledfeedback/download/schedule/${schedulefeedback_id}`),
      {
        headers: { token: getToken() },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `schedule-${schedulefeedback_id}-responses.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("downloadStudentResponsesPDF error:", err);
    alert("Failed to download PDF");
  }
}
