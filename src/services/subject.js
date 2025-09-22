// services/subject.js
import axios from 'axios';
import { createError, createUrl } from './utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

// GET all subjects
export async function getSubjects() {
  try {
    const res = await axios.get(createUrl('subject'), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error('GET /subject error:', err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// CREATE a new subject
export async function createSubject(data) {
  try {
    const res = await axios.post(createUrl('subject'), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error('POST /subject error:', err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// UPDATE a subject
export async function updateSubject(id, data) {
  try {
    const res = await axios.put(createUrl(`subject/${id}`), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`PUT /subject/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// DELETE a subject
export async function deleteSubject(id) {
  try {
    const res = await axios.delete(createUrl(`subject/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`DELETE /subject/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}
