import axios from 'axios';
import { createError, createUrl } from './utils';

// Get token from sessionStorage
function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

// Fetch all schedule feedbacks
export async function fetchAllScheduleFeedbacks() {
  try {
    const res = await axios.get(createUrl('schedulefeedback'), {
      headers: { token: getToken() }, // send token in 'token' header
    });
    return res.data;
  } catch (error) {
    console.error('API fetch error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}

// Delete a schedule feedback
export async function deleteScheduleFeedback(id) {
  try {
    const res = await axios.delete(createUrl(`schedulefeedback/${id}`), {
      headers: { token: getToken() }, // send token in 'token' header
    });
    return res.data;
  } catch (error) {
    console.error('API delete error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}
