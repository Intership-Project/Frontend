// services/course.js
import axios from 'axios';
import { createError, createUrl } from '../utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

// GET all courses
export async function getCourses() {
  try {
    const res = await axios.get(createUrl('course'), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error('GET /course error:', err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}


// CREATE a course
export async function createCourse(data) {
  try {
    const res = await axios.post(createUrl('course'), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error('POST /course error:', err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}



// UPDATE a course
export async function updateCourse(id, data) {
  try {
    const res = await axios.put(createUrl(`course/${id}`), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`PUT /course/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}



// DELETE a course
export async function deleteCourse(id) {
  try {
    const res = await axios.delete(createUrl(`course/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`DELETE /course/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}
