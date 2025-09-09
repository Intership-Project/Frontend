// pages/Course.jsx
import React, { useEffect, useState } from 'react';
import { createCourse, deleteCourse, getCourses, updateCourse } from '../services/course';

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [coursename, setCoursename] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load courses from backend
  const loadCourses = async () => {
    try {
      const response = await getCourses();
      if (response.status === 'error') {
        alert(response.error);
        return;
      }
      setCourses(response.data || []);
    } catch (err) {
      alert('Failed to fetch courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add or update course
  const handleSave = async () => {
    if (!coursename) return alert('Enter course name');
    try {
      if (editingCourse) {
        const response = await updateCourse(editingCourse.course_id, { coursename });
        if (response.status === 'error') return alert(response.error);
        setCourses(courses.map(c => c.course_id === editingCourse.course_id ? { ...c, coursename } : c));
        setEditingCourse(null);
      } else {
        const response = await createCourse({ coursename });
        if (response.status === 'error') return alert(response.error);
        setCourses([...courses, response.data]);
      }
      setCoursename('');
    } catch (err) {
      alert('Error saving course');
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setCoursename(course.coursename);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      const response = await deleteCourse(id);
      if (response.status === 'error') return alert(response.error);
      setCourses(courses.filter(c => c.course_id !== id));
    } catch (err) {
      alert('Error deleting course');
      console.error(err);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Login required');
      window.location.href = '/login';
      return;
    }
    loadCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Courses</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '6px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={coursename}
          onChange={(e) => setCoursename(e.target.value)}
          placeholder="Enter course name"
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button onClick={handleSave} style={{ padding: '8px 15px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {editingCourse ? 'Update Course' : 'Add Course'}
        </button>
        {editingCourse && (
          <button onClick={() => { setEditingCourse(null); setCoursename(''); }} style={{ padding: '8px 15px', marginLeft: '10px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th>Course Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.course_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{c.course_id}</td>
              <td>{c.coursename}</td>
              <td>
                <button onClick={() => handleEdit(c)} style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(c.course_id)} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
