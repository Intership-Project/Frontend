import React, { useEffect, useState } from 'react';
import {
  fetchAllScheduleFeedbacks,
  updateScheduleFeedback,
  deleteScheduleFeedback,
  updateFeedbackStatus
} from '../services/schedulefeedback';
import { fetchAllStudents } from '../services/student';
import { fetchAllFaculty } from '../services/facultylist';
import { getCourses } from '../services/course';
import { getSubjects } from '../services/subject';
import { getFeedbackTypes } from '../services/feedbacktype';
import { createUrl } from '../utils';
import axios from 'axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const getToken = () => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('Auth token not found. Please login.');
    return token;
  };

  const loadData = async () => {
    try {
      const [fbRes, stRes, faRes, coRes, subRes, ftRes] = await Promise.all([
        fetchAllScheduleFeedbacks(),
        fetchAllStudents(),
        fetchAllFaculty(),
        getCourses(),
        getSubjects(),
        getFeedbackTypes()
      ]);

      if ([fbRes, stRes, faRes, coRes, subRes, ftRes].some(res => !res || res.status === 'error')) {
        alert('Error fetching data');
        return;
      }

      setFeedbacks(fbRes.data.map(fb => ({ ...fb, status: fb.status || 'inactive' })));
      setStudents(stRes.data);
      setFaculty(faRes.data);
      setCourses(coRes.data);
      setSubjects(subRes.data);
      setFeedbackTypes(ftRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(createUrl(`schedulefeedback/${id}`), { headers: { token: getToken() } });
      if (res.data.status === 'success' && res.data.data) {
        const fb = res.data.data;

        // Ensure course_id matches the subject
        const subject = subjects.find(s => s.subject_id === fb.subject_id);
        const course_id = subject ? subject.course_id : fb.course_id;

        // Filter subjects for the selected course
        const filteredSubs = subjects.filter(s => s.course_id === course_id);

        setFilteredSubjects(filteredSubs);
        setModalData({
          ...fb,
          course_id,
          subject_id: fb.subject_id,
          StartDate: fb.StartDate ? fb.StartDate.split('T')[0] : '',
          EndDate: fb.EndDate ? fb.EndDate.split('T')[0] : ''
        });
        setEditingId(id);
        setShowModal(true);
      } else {
        alert('Feedback not found!');
      }
    } catch (err) {
      console.error('Edit load error:', err);
      alert('Error fetching feedback details');
    }
  };

  const handleCourseChange = (course_id) => {
    setModalData({ ...modalData, course_id, subject_id: '' });
    const filteredSubs = subjects.filter(s => s.course_id === parseInt(course_id));
    setFilteredSubjects(filteredSubs);
  };

  const handleSave = async () => {
    try {
      const res = await updateScheduleFeedback(editingId, modalData);
      if (res.status === 'success') {
        // Update the table immediately
        setFeedbacks(feedbacks.map(fb => 
          fb.schedulefeedback_id === editingId
            ? {
                ...fb,
                ...modalData,
                coursename: courses.find(c => c.course_id === parseInt(modalData.course_id))?.coursename,
                subjectname: subjects.find(s => s.subject_id === parseInt(modalData.subject_id))?.subjectname
              }
            : fb
        ));
        setShowModal(false);
        setEditingId(null);
        alert('Feedback updated successfully!');
      } else {
        alert('Update failed: ' + res.error);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error saving feedback');
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

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h4>Total Students</h4>
          <p>{students.length}</p>
        </div>
        <div className="stat-card">
          <h4>Total Faculty</h4>
          <p>{faculty.length}</p>
        </div>
        <div className="stat-card">
          <h4>Total Courses</h4>
          <p>{courses.length}</p>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Schedule Feedbacks</h3>
        <table className="feedback-table">
          <thead>
            <tr>
              <th>ID</th>
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
              <tr key={fb.schedulefeedback_id}>
                <td>{fb.schedulefeedback_id}</td>
                <td>{fb.coursename || 'N/A'}</td>
                <td>{fb.subjectname || 'N/A'}</td>
                <td>{fb.fbtypename || 'N/A'}</td>
                <td>{fb.StartDate ? new Date(fb.StartDate).toLocaleDateString() : 'N/A'}</td>
                <td>{fb.EndDate ? new Date(fb.EndDate).toLocaleDateString() : 'N/A'}</td>
                <td>{fb.status}</td>
                <td>
                  <button onClick={() => handleEdit(fb.schedulefeedback_id)} className="btn btn-edit">Edit</button>
                  <button
                    onClick={() => handleDelete(fb.schedulefeedback_id, fb.responsesCount > 0)}
                    disabled={fb.responsesCount > 0}
                    className={fb.responsesCount > 0 ? "btn btn-delete-disabled" : "btn btn-delete"}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleStatus(fb.schedulefeedback_id)}
                    className={fb.status === 'active' ? "btn btn-toggle-active" : "btn btn-toggle-inactive"}
                  >
                    {fb.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Feedback</h3>

            {/* Course (dropdown) */}
            <div className="modal-field">
              <label>Course</label>
              <select
                value={modalData.course_id || ''}
                onChange={e => handleCourseChange(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.coursename}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject (dropdown) */}
            <div className="modal-field">
              <label>Subject</label>
              <select
                value={modalData.subject_id || ''}
                onChange={e => setModalData({ ...modalData, subject_id: e.target.value })}
              >
                <option value="">Select Subject</option>
                {filteredSubjects.map(sub => (
                  <option key={sub.subject_id} value={sub.subject_id}>{sub.subjectname}</option>
                ))}
              </select>
            </div>

            {/* Feedback Type (dropdown) */}
            <div className="modal-field">
              <label>Feedback Type</label>
              <select
                value={modalData.feedbacktype_id || ''}
                onChange={e => setModalData({ ...modalData, feedbacktype_id: e.target.value })}
              >
                <option value="">Select Feedback Type</option>
                {feedbackTypes.map(ft => (
                  <option key={ft.feedbacktype_id} value={ft.feedbacktype_id}>{ft.fbtypename}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="modal-field">
              <label>Start Date</label>
              <input
                type="date"
                value={modalData.StartDate || ''}
                onChange={e => setModalData({ ...modalData, StartDate: e.target.value })}
              />
            </div>

            {/* End Date */}
            <div className="modal-field">
              <label>End Date</label>
              <input
                type="date"
                value={modalData.EndDate || ''}
                onChange={e => setModalData({ ...modalData, EndDate: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleSave} className="modal-save">Save</button>
              <button onClick={() => setShowModal(false)} className="modal-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
