import axios from 'axios';
import { createError, createUrl } from './utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

// GET grouped feedbacks by schedule
export async function getGroupedFeedbacks() {
  try {
    const res = await axios.get(createUrl('filledfeedback/grouped-by-schedule'), {
      headers: { token: getToken() },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return createError(err.response?.data?.error || err.message);
  }
}

// Download all responses PDF (without student info)
export async function downloadAllResponsesPDF(schedulefeedback_id) {
  try {
   const res = await axios.get(createUrl(`filledfeedback/download/schedule/${schedulefeedback_id}`), 
   
    {
      headers: { token: getToken() },
      responseType: 'blob', // important for PDF
    });

    // Trigger download
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `schedule-${schedulefeedback_id}-responses.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert('Failed to download PDF');
  }
}


