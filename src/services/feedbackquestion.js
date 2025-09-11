import axios from "axios";
import { createError, createUrl } from "./utils";

function getToken() {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("Auth token not found. Please login.");
  return token;
}

// GET all feedback questions
export async function getFeedbackQuestions() {
  try {
    const res = await axios.get(createUrl("feedbackquestion"), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error("GET /feedbackquestion error:", err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// CREATE a new feedback question
export async function createFeedbackQuestion(data) {
  try {
    const res = await axios.post(createUrl("feedbackquestion"), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error("POST /feedbackquestion error:", err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// UPDATE a feedback question
export async function updateFeedbackQuestion(id, data) {
  try {
    const res = await axios.put(createUrl(`feedbackquestion/${id}`), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`PUT /feedbackquestion/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// DELETE a feedback question
export async function deleteFeedbackQuestion(id) {
  try {
    const res = await axios.delete(createUrl(`feedbackquestion/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`DELETE /feedbackquestion/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}
