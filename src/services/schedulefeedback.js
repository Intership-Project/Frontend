
import axios from 'axios';
import { createError, createUrl } from './utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

export async function fetchAllScheduleFeedbacks() {
  try {
    const res = await axios.get(createUrl('schedulefeedback'), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (error) {
    console.error('API fetch error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}



export async function deleteScheduleFeedback(id) {
  try {
    const res = await axios.delete(createUrl(`schedulefeedback/${id}`), {
      headers: { token: getToken() }
    });
    return res.data;
  } catch (error) {
    console.error('API delete error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}

export async function updateFeedbackStatus(id, status) {
  try {
    const res = await axios.patch(createUrl(`schedulefeedback/${id}/status`), { status }, {
      headers: { token: getToken() }
    });
    return res.data;
  } catch (error) {
    console.error('API status update error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}


// Update Schedule Feedback
export const updateScheduleFeedback = async (id, payload) => {
  try {
    const res = await axios.put(`${API_BASE}/schedulefeedback/${id}`, payload, {
      headers: { token: getToken() }
    });
    return res.data; // { status: 'success', data: updatedRecord }
  } catch (err) {
    return handleError(err);
  }
};
