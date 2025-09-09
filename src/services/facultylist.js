// src/services/facultylist.js
import axios from 'axios';
import { createError, createUrl } from './utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

export async function fetchAllFaculty() {
  try {
    const res = await axios.get(createUrl('faculty'), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (error) {
    console.error('API fetch error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}

export async function deleteFaculty(id) {
  try {
    const res = await axios.delete(createUrl(`faculty/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (error) {
    console.error('API delete error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}

export async function updateFaculty(id, data) {
  try {
    const res = await axios.put(createUrl(`faculty/profile`), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (error) {
    console.error('API update error:', error.response || error.message);
    return createError(error.response?.data?.error || error.message);
  }
}
