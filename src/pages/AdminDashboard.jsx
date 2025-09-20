import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getCourses } from '../services/course';
import { fetchAllFaculty } from '../services/facultylist';
import {
  deleteScheduleFeedback,
  fetchAllScheduleFeedbacks,
  updateFeedbackStatus,
  updateScheduleFeedback
} from '../services/schedulefeedback';
import { fetchAllStudents } from '../services/student';
import { createUrl } from '../services/utils';

function getToken() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Auth token not found. Please login.');
  return token;
}

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    course_id: '',
    subject_id: '',
    faculty_id: '',
    batch_id: '',
    feedbacktype_id: '',
    feedbackmoduletype_id: '',
    StartDate: '',
    EndDate: ''
  });

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

      const updatedFb = fbRes.data.map(fb => ({
        ...fb,
        status: fb.status || 'inactive'
      }));
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

  // -------------------- EDIT FLOW --------------------

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(createUrl(`schedulefeedback/${id}`), {
        headers: { token: getToken() }
      });

      if (res.data.status === "success" && res.data.data) {
        const fb = res.data.data;

        setFormData({
          schedulefeedback_id: fb.schedulefeedback_id,
          course_id: fb.course_id,
          subject_id: fb.subject_id,
          faculty_id: fb.faculty_id,
          batch_id: fb.batch_id || "",
          feedbacktype_id: fb.feedbacktype_id,
          feedbackmoduletype_id: fb.feedbackmoduletype_id,
          StartDate: fb.StartDate ? fb.StartDate.split("T")[0] : "",
          EndDate: fb.EndDate ? fb.EndDate.split("T")[0] : "",
        });

        setEditingId(id);
        setShowModal(true);
      } else {
        alert("Feedback not found!");
      }
    } catch (err) {
      console.error("Edit load error:", err);
      alert("Error fetching feedback details");
    }
  };

  const handleSave = async () => {
    try {
      const res = await updateScheduleFeedback(editingId, formData);

      if (res.status === "success") {
        setFeedbacks(feedbacks.map(fb =>
          fb.schedulefeedback_id === editingId ? { ...fb, ...formData } : fb
        ));
        setShowModal(false);
        setEditingId(null);
        alert("Feedback updated successfully!");
      } else {
        alert("Update failed: " + res.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error saving feedback");
    }
  };

  // -------------------- DELETE --------------------
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

  // -------------------- TOGGLE STATUS --------------------
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1, textAlign:'center' }}>
          <h4>Total Students</h4>
          <p style={{ fontSize:'20px', fontWeight:'bold' }}>{students.length}</p>
        </div>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1, textAlign:'center' }}>
          <h4>Total Faculty</h4>
          <p style={{ fontSize:'20px', fontWeight:'bold' }}>{faculty.length}</p>
        </div>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1, textAlign:'center' }}>
          <h4>Total Courses</h4>
          <p style={{ fontSize:'20px', fontWeight:'bold' }}>{courses.length}</p>
        </div>
      </div>

      {/* Feedback Table */}
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
                <button
                  onClick={() => handleEdit(fb.schedulefeedback_id)}
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

      {/* Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '8px',
            width: '400px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3>Edit Feedback</h3>
            <label>Course ID</label>
            <input
              type="text"
              value={formData.course_id}
              onChange={e => setFormData({ ...formData, course_id: e.target.value })}
            />
            <label>Subject ID</label>
            <input
              type="text"
              value={formData.subject_id}
              onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
            />
            <label>Faculty ID</label>
            <input
              type="text"
              value={formData.faculty_id}
              onChange={e => setFormData({ ...formData, faculty_id: e.target.value })}
            />
            <label>Batch ID</label>
            <input
              type="text"
              value={formData.batch_id}
              onChange={e => setFormData({ ...formData, batch_id: e.target.value })}
            />
            <label>Feedback Type ID</label>
            <input
              type="text"
              value={formData.feedbacktype_id}
              onChange={e => setFormData({ ...formData, feedbacktype_id: e.target.value })}
            />
            <label>Feedback Module Type ID</label>
            <input
              type="text"
              value={formData.feedbackmoduletype_id}
              onChange={e => setFormData({ ...formData, feedbackmoduletype_id: e.target.value })}
            />
            <label>Start Date</label>
            <input
              type="date"
              value={formData.StartDate}
              onChange={e => setFormData({ ...formData, StartDate: e.target.value })}
            />
            <label>End Date</label>
            <input
              type="date"
              value={formData.EndDate}
              onChange={e => setFormData({ ...formData, EndDate: e.target.value })}
            />
            <div style={{ marginTop: '15px' }}>
              <button onClick={handleSave} style={{ background:'#2ecc71', color:'#fff', padding:'6px 12px', border:'none', borderRadius:'5px', marginRight:'10px' }}>
                Save
              </button>
              <button onClick={() => setShowModal(false)} style={{ background:'#e74c3c', color:'#fff', padding:'6px 12px', border:'none', borderRadius:'5px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
