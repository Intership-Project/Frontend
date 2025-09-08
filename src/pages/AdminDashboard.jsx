import React, { useEffect, useState } from 'react';
import { fetchAllScheduleFeedbacks, deleteScheduleFeedback } from '../services/schedulefeedback';

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = async () => {
    try {
      const response = await fetchAllScheduleFeedbacks();

      if (response.status === 'error') {
        alert(response.error);
        window.location.href = '/login';
        return;
      }

      setFeedbacks(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch schedule feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    const response = await deleteScheduleFeedback(id);

    if (response.status === 'error') {
      alert(`Delete failed: ${response.error}`);
    } else {
      alert('Deleted successfully');
      setFeedbacks(feedbacks.filter(fb => fb.schedulefeedback_id !== id));
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Authentication required. Please login.');
      window.location.href = '/login';
      return;
    }
    loadFeedbacks();
  }, []);

  if (loading) return <p>Loading schedule feedbacks...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Schedule Feedbacks</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            padding: '6px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th>Course</th>
            <th>Subject</th>
            <th>Faculty</th>
            <th>Batch</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb.schedulefeedback_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{fb.schedulefeedback_id}</td>
              <td>{fb.coursename}</td>
              <td>{fb.subjectname}</td>
              <td>{fb.facultyname}</td>
              <td>{fb.batchname || 'N/A'}</td>
              <td>{new Date(fb.StartDate).toLocaleDateString()}</td>
              <td>{new Date(fb.EndDate).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => window.location.href = `/admin/edit-schedule/${fb.schedulefeedback_id}`}
                  style={{
                    backgroundColor: '#3498db',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(fb.schedulefeedback_id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
