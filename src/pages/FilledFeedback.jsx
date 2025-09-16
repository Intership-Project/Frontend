import { useEffect, useState } from 'react';
import { fetchAllFilledFeedback, downloadSingleFeedbackPDF } from '../services/fillfeedback';

export default function FilledFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    const response = await fetchAllFilledFeedback();
    if (response.status === 'success') {
      setFeedbackList(response.data);
    } else {
      alert(response.error?.message || JSON.stringify(response.error));
    }
    setLoading(false);
  };

  if (loading) return <p>Loading filled feedback...</p>;

  return (
    <div style={{ padding:'20px', fontFamily:'Arial, sans-serif' }}>
      <h1>Filled Feedback List</h1>
      <table style={{ width:'100%', borderCollapse:'collapse', marginTop:'20px' }}>
        <thead style={{ backgroundColor:'#2c3e50', color:'#fff' }}>
          <tr>
            <th>FilledFeedback ID</th>
            <th>ScheduleFeedback ID</th>
            <th>Course</th>
            <th>Student</th>
            <th>Comment</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map(f => (
            <tr key={f.filledfeedbacks_id} style={{ borderBottom:'1px solid #ddd' }}>
              <td>{f.filledfeedbacks_id}</td>
              <td>{f.schedulefeedback_id}</td>
              <td>{f.coursename}</td>
              <td>{f.studentname}</td>
              <td>{f.comments || '-'}</td>
              <td>{f.rating}</td>
              <td>
                <button
                  onClick={() => downloadSingleFeedbackPDF(f.filledfeedbacks_id)}
                  style={{ backgroundColor:'#27ae60', color:'#fff', padding:'5px 10px', borderRadius:'5px', border:'none', cursor:'pointer' }}
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
