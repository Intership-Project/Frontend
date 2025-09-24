import axios from "axios";
import { createError, createUrl } from "../utils";

function getToken() {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("Auth token not found. Please login.");
  return token;
}

// GET all feedback types
export async function getFeedbackTypes() {
  try {
    const res = await axios.get(createUrl("feedbacktype"), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error("GET /feedbacktype error:", err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// GET single feedback type by ID
export async function getFeedbackTypeById(id) {
  try {
    const res = await axios.get(createUrl(`feedbacktype/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`GET /feedbacktype/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// CREATE new feedback type
export async function createFeedbackType(data) {
  try {
    const res = await axios.post(createUrl("feedbacktype"), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error("POST /feedbacktype error:", err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// DELETE feedback type
export async function deleteFeedbackType(id) {
  try {
    const res = await axios.delete(createUrl(`feedbacktype/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`DELETE /feedbacktype/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}
