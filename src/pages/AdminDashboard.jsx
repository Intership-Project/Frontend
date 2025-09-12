
import React, { useEffect, useState } from 'react';
import { fetchAllScheduleFeedbacks, deleteScheduleFeedback, updateFeedbackStatus } from '../services/schedulefeedback';
import { fetchAllStudents } from '../services/student';
import { fetchAllFaculty } from '../services/facultylist';
import { getCourses } from '../services/course';

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [fbRes, stRes, faRes, coRes] = await Promise.all([
        fetchAllScheduleFeedbacks(),
        fetchAllStudents(),
        fetchAllFaculty(),
        getCourses()
      ]);

      if ([fbRes, stRes, faRes, coRes].some(res => res.status === 'error')) {
        alert('Error fetching data');
        window.location.href = '/login';
        return;
      }

      const updatedFb = fbRes.data.map(fb => ({ ...fb, status: fb.status || 'inactive' }));
      setFeedbacks(updatedFb);
      setStudents(stRes.data);
      setFaculty(faRes.data);
      setCourses(coRes.data);

    } catch (err) {
      console.error(err);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, hasResponses) => {
    if (hasResponses) {
      alert('Cannot delete: feedback has responses.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    const res = await deleteScheduleFeedback(id);
    if (res.status === 'success') {
      setFeedbacks(feedbacks.filter(fb => fb.schedulefeedback_id !== id));
      alert('Deleted successfully');
    } else {
      console.error(res.error);
      alert(`Delete failed: ${res.error?.message || JSON.stringify(res.error)}`);
    }
  };

  const handleToggleStatus = async (id) => {
    const feedback = feedbacks.find(fb => fb.schedulefeedback_id === id);
    if (!feedback) return;

    const newStatus = feedback.status === 'active' ? 'inactive' : 'active';

    const res = await updateFeedbackStatus(id, newStatus);
    if (res.status === 'success') {
      setFeedbacks(feedbacks.map(fb =>
        fb.schedulefeedback_id === id ? { ...fb, status: newStatus } : fb
      ));
    } else {
      console.error(res.error);
      alert('Failed to update status');
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
    loadData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px 20px 0 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '38px' }}>Admin Dashboard</h2>
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

      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1, textAlign:'center' }}>
          <h4 style={{ margin: '0 0 5px 0' }}>Total Students</h4>
          <p style={{ fontSize:'20px', fontWeight:'bold', margin:0 }}>{students.length}</p>
        </div>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1, textAlign:'center' }}>
          <h4 style={{ margin: '0 0 5px 0' }}>Total Faculty</h4>
          <p style={{ fontSize:'20px', fontWeight:'bold', margin:0 }}>{faculty.length}</p>
        </div>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1, textAlign:'center' }}>
          <h4 style={{ margin: '0 0 5px 0' }}>Total Courses</h4>
          <p style={{ fontSize:'20px', fontWeight:'bold', margin:0 }}>{courses.length}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '10px', fontSize: '30px' }}>Schedule Feedbacks</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th>Course</th>
            <th>Subject</th>
            <th>Feedback Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb.schedulefeedback_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{fb.schedulefeedback_id}</td>
              <td>{fb.coursename || 'N/A'}</td>
              <td>{fb.subjectname || 'N/A'}</td>
              <td>{fb.fbtypename || 'N/A'}</td>
              <td>{new Date(fb.StartDate).toLocaleDateString()}</td>
              <td>{new Date(fb.EndDate).toLocaleDateString()}</td>
              <td>{fb.status}</td>
              <td>
                {/* Edit Button */}
                <button
                  onClick={() => window.location.href = `/admin/edit-schedule/${fb.schedulefeedback_id}`}
                  style={{
                    backgroundColor: '#3498db',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '5px',
                    fontWeight: 'bold'
                  }}
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(fb.schedulefeedback_id, fb.responsesCount > 0)}
                  disabled={fb.responsesCount > 0}
                  style={{
                    backgroundColor: fb.responsesCount > 0 ? '#95a5a6' : '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    cursor: fb.responsesCount > 0 ? 'not-allowed' : 'pointer',
                    marginRight: '5px',
                    fontWeight: 'bold'
                  }}
                  title={fb.responsesCount > 0 ? 'Cannot delete: has responses' : 'Delete'}
                >
                  Delete
                </button>

                {/* Toggle Status Button */}
                <button
                  onClick={() => handleToggleStatus(fb.schedulefeedback_id)}
                  style={{
                    backgroundColor: fb.status === 'active' ? '#2ecc71' : '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {fb.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Admindashboard