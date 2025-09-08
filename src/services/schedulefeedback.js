import axios from 'axios';
import { createError, createUrl } from './utils';

// Helper to get token from sessionStorage
function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

// Fetch all schedule feedbacks
export async function fetchAllScheduleFeedbacks() {
  try {
    const res = await axios.get(createUrl('schedulefeedback'), {
      headers: { token: getToken() }, // token included automatically
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
      headers: { token: getToken() }, // token included automatically
    });
    return res.data;
  } catch (error) {
    console.error('API delete error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}

// Add a new schedule feedback
export async function addScheduleFeedback(data) {
  try {
    const res = await axios.post(createUrl('schedulefeedback/register'), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (error) {
    console.error('API add error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}

// Update a schedule feedback
export async function updateScheduleFeedback(id, data) {
  try {
    const res = await axios.put(createUrl(`schedulefeedback/${id}`), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (error) {
    console.error('API update error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}
