// services/batch.js
import axios from 'axios';
import { createUrl, createError, createSuccess } from './utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

// GET all batches
export async function getBatches() {
  try {
    const res = await axios.get(createUrl('batch'), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error('GET /batch error:', err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// CREATE a new batch
export async function createBatch(data) {
  try {
    const res = await axios.post(createUrl('batch'), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error('POST /batch error:', err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// UPDATE a batch
export async function updateBatch(id, data) {
  try {
    const res = await axios.put(createUrl(`batch/${id}`), data, {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`PUT /batch/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}

// DELETE a batch
export async function deleteBatch(id) {
  try {
    const res = await axios.delete(createUrl(`batch/${id}`), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(`DELETE /batch/${id} error:`, err.response || err.message);
    return createError(err.response?.data?.error || err.message);
  }
}
