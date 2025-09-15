import axios from 'axios';
import { createError, createUrl } from './utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

// GET all feedback module types
export async function getFeedbackModuleTypes() {
  try {
    const res = await axios.get(createUrl('feedbackmoduletype'), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
}

// CREATE new feedback module type
export async function createFeedbackModuleType(data) {
  try {
    const res = await axios.post(createUrl('feedbackmoduletype'), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
}

// DELETE feedback module type
export async function deleteFeedbackModuleType(id) {
  try {
    const res = await axios.delete(createUrl(`feedbackmoduletype/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
}

// GET module types by feedback type (frontend filtering)
export async function getFeedbackModuleTypesByType(feedbacktype_id) {
  try {
    // ✅ Fetch all feedback module types
    const res = await axios.get(createUrl("feedbackmoduletype"), {
      headers: { token: getToken() },
    });

    if (res.data.status !== "success") {
      return createError(res.data.error || "Failed to fetch module types");
    }

    // ✅ Filter by feedbacktype_id on frontend
    const filtered = res.data.data.filter(
      (m) => m.feedbacktype_id === parseInt(feedbacktype_id)
    );

    return { status: "success", data: filtered };
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
}

