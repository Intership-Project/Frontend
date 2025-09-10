
import axios from 'axios';

const API_BASE = 'http://localhost:4000';
const getToken = () => sessionStorage.getItem('token');

const handleError = (error) => ({
  status: 'error',
  error: error.response?.data?.error || error.message
});

// Fetch all faculty
export const fetchAllFaculty = async () => {
  try {
    const res = await axios.get(`${API_BASE}/faculty`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// Fetch all courses
export const fetchAllCourses = async () => {
  try {
    const res = await axios.get(`${API_BASE}/course`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// Add faculty
export const addFaculty = async (data) => {
  try {
    const payload = {
      facultyname: data.facultyname || null,
      email: data.email || null,
      password: data.password || null,
      role_id: data.role_id ? Number(data.role_id) : null,
      ...(data.role_id === 7 ? { course_id: data.course_id ? Number(data.course_id) : null } : {})
    };
    const res = await axios.post(`${API_BASE}/faculty/register`, payload, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// Update faculty
export const updateFaculty = async (id, data) => {
  try {
    const payload = {
      facultyname: data.facultyname || null,
      email: data.email || null,
      role_id: data.role_id ? Number(data.role_id) : null,
      ...(data.role_id === 7 ? { course_id: data.course_id ? Number(data.course_id) : null } : {}),
      password: data.password !== undefined ? data.password : undefined
    };
    const res = await axios.put(`${API_BASE}/faculty/update/${id}`, payload, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// Delete faculty
export const deleteFaculty = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE}/faculty/${id}`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};
