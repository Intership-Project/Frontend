import React, { useEffect, useState } from 'react';
import { createCourse, deleteCourse, getCourses, updateCourse } from '../services/course';

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [coursename, setCoursename] = useState(''); // permanent input
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

  // Add course
  const handleAddCourse = async () => {
    if (!coursename.trim()) return alert('Enter course name');
    try {
      const response = await createCourse({ coursename });
      if (response.status === 'error') return alert(response.error);
      setCourses([...courses, response.data]);
      setCoursename(''); // clear input after adding
    } catch (err) {
      alert('Error adding course');
      console.error(err);
    }
  };

  // Edit course (prompt for new name)
  const handleEdit = async (course) => {
    const updatedName = prompt('Enter new course name', course.coursename);
    if (!updatedName) return;
    try {
      const response = await updateCourse(course.course_id, { coursename: updatedName });
      if (response.status === 'error') return alert(response.error);
      setCourses(courses.map(c => c.course_id === course.course_id ? { ...c, coursename: updatedName } : c));
    } catch (err) {
      alert('Error updating course');
      console.error(err);
    }
  };

  // Delete course
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
      <h1 style={{ marginBottom: '20px' }}>Courses</h1>

      {/* Input field + Add button */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={coursename}
          onChange={(e) => setCoursename(e.target.value)}
          placeholder="Enter course name"
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button
          onClick={handleAddCourse}
          style={{
            padding: '8px 15px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Add Course
        </button>
      </div>

      {/* Courses Table */}
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
                <button
                  onClick={() => handleEdit(c)}
                  style={{
                    backgroundColor: '#3498db',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginRight: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.course_id)}
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
//completed