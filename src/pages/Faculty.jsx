import React, { useEffect, useState } from 'react';
import { fetchAllFaculty, deleteFaculty } from '../services/facultylist';

export default function Faculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFaculty = async () => {
    try {
      const response = await fetchAllFaculty();

      if (response.status === 'error') {
        alert(response.error);
        window.location.href = '/login';
        return;
      }

      setFacultyList(response.data || []);
    } catch (err) {
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty?')) return;

    const response = await deleteFaculty(id);

    if (response.status === 'error') {
      alert(`Delete failed: ${response.error}`);
    } else {
      alert('Faculty deleted successfully');
      setFacultyList(facultyList.filter(f => f.faculty_id !== id));
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  if (loading) return <p>Loading faculty data...</p>;

  if (error)
    return (
      <div style={{ padding: '20px' }}>
        <h2>Error loading faculty</h2>
        <p>{error}</p>
      </div>
    );

  // Correct counts based on exact role names
  const trainerCount = facultyList.filter(f => f.rolename === 'Trainer').length;
  const labMentorCount = facultyList.filter(f => f.rolename === 'Lab Mentor').length;
  const courseCordinaterCount = facultyList.filter(f => f.rolename === 'CourseCordinater').length;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Faculty Management</h1>
        
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', background: '#ecf0f1', borderRadius: '8px', flex: 1 }}>
          <h3>Total Trainers</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{trainerCount}</p>
        </div>
        <div style={{ padding: '15px', background: '#ecf0f1', borderRadius: '8px', flex: 1 }}>
          <h3>Total Lab Mentors</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{labMentorCount}</p>
        </div>
        <div style={{ padding: '15px', background: '#ecf0f1', borderRadius: '8px', flex: 1 }}>
          <h3>Total Course Coordinators</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{courseCordinaterCount}</p>
        </div>
      </div>

      {/* Add Faculty Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => window.location.href = '/admin/add-faculty'}
          style={{
            backgroundColor: '#27ae60',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add Faculty
        </button>
      </div>

      {/* Faculty List Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {facultyList.map(faculty => (
            <tr key={faculty.faculty_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{faculty.faculty_id}</td>
              <td>{faculty.facultyname}</td>
              <td>{faculty.email}</td>
              <td>{faculty.rolename}</td>
              <td>
                <button
                  onClick={() => window.location.href = `/admin/edit-faculty/${faculty.faculty_id}`}
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
                  onClick={() => handleDelete(faculty.faculty_id)}
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
