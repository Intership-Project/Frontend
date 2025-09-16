import axios from 'axios';

const API_BASE = 'http://localhost:4000';
const getToken = () => sessionStorage.getItem('token');

export const fetchAllFilledFeedback = async () => {
  try {
    const res = await axios.get(`${API_BASE}/filledfeedback`, { headers: { token: getToken() } });
    return res.data;
  } catch (err) {
    return { status: 'error', error: err.response?.data?.error || err.message };
  }
};

export const downloadSingleFeedbackPDF = async (id) => {
  try {
    const res = await axios.get(`${API_BASE}/filledfeedback/download/${id}`, {
      headers: { token: getToken() },
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `filledfeedback-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert(err.response?.data?.error || err.message || 'Error downloading PDF');
  }
};
