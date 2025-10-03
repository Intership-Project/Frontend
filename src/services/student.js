import axios from 'axios';
import { createError, createUrl } from '../utils';

const API_BASE = 'student';

// Get JWT token from sessionStorage
const getToken = () => sessionStorage.getItem('token');



// Fetch all students
export const fetchAllStudents = async () => {
  try {
    const res = await axios.get(createUrl(`${API_BASE}/getall`), {
      headers: { token: getToken() }
    });
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};



// Add student 
export const addStudent = async (data) => {
  try {
    const res = await axios.post(createUrl(`${API_BASE}/register`), data, {
      headers: { token: getToken() }
    });
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};


//Update student 
export const updateStudent = async (id, data) => {
  try {
    const res = await axios.put(createUrl(`${API_BASE}/update/${id}`), data, {
      headers: { token: getToken() }
    });
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};



//Delete student
export const deleteStudent = async (id) => {
  try {
    const res = await axios.delete(createUrl(`${API_BASE}/delete/${id}`), {
      headers: { token: getToken() }
    });
    return res.data;
  } catch (err) {
    return createError(err.response?.data?.error || err.message);
  }
};
