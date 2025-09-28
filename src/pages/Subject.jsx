import React, { useEffect, useState } from 'react';
import { getCourses } from '../services/course';
import { createSubject, deleteSubject, getSubjects, updateSubject } from '../services/subject';

export default function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalData, setModalData] = useState({ subjectname: '', course_id: '' });
  const [editSubjectId, setEditSubjectId] = useState(null);

  useEffect(() => {
    loadSubjects();
    loadCourses();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      if (res.status === 'success') setSubjects(res.data);
      else setError(res.error || 'Failed to load subjects');
    } catch {
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    const res = await getCourses();
    if (res.status === 'success') setCourses(res.data);
  };

  const openAddModal = () => {
    setModalType('add');
    setModalData({ subjectname: '', course_id: '' });
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setModalType('edit');
    setEditSubjectId(subject.subject_id);
    setModalData({ subjectname: subject.subjectname, course_id: subject.course_id });
    setShowModal(true);
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const payload = {
      subjectname: modalData.subjectname || null,
      course_id: modalData.course_id || null,
    };

    const course = courses.find(c => c.course_id === Number(payload.course_id));

    if (modalType === 'add') {
      const res = await createSubject(payload);
      if (res.status === 'error') alert(`Add failed: ${res.error}`);
      else {
        alert('Subject added successfully');
        const newSubject = { ...res.data, coursename: course?.coursename || 'Unknown' };
        setSubjects([...subjects, newSubject]);
        setShowModal(false);
      }
    } else {
      const res = await updateSubject(editSubjectId, payload);
      if (res.status === 'error') alert(`Update failed: ${res.error}`);
      else {
        alert('Subject updated successfully');
        setSubjects(
          subjects.map(s =>
            s.subject_id === editSubjectId
              ? { ...s, ...payload, coursename: course?.coursename || 'Unknown' }
              : s
          )
        );
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    const res = await deleteSubject(id);
    if (res.status === 'error') alert(`Delete failed: ${res.error}`);
    else {
      alert('Subject deleted successfully');
      setSubjects(subjects.filter((s) => s.subject_id !== id));
    }
  };

  if (loading) return <p>Loading subjects...</p>;
  if (error) return <p>{error}</p>;

  // Summary: number of subjects per course
  const subjectCounts = courses.map(course => {
    const count = subjects.filter(s => s.course_id === course.course_id).length;
    return { ...course, count };
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Subject Management</h1>

      {/* Course summary */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {subjectCounts.map(c => (
          <div key={c.course_id} style={{ padding: '15px', background: '#ecf0f1', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
            <h3>{c.coursename}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{c.count}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={openAddModal}
          style={{
            backgroundColor: '#27ae60',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Add Subject
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th>S.No</th>
            <th>Subject Name</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, index) => (
            <tr key={s.subject_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{index + 1}</td>
              <td>{s.subjectname}</td>
              <td>{s.coursename || 'Unknown'}</td>
              <td>
                <button
                  onClick={() => openEditModal(s)}
                  style={{ marginRight: '5px', backgroundColor: '#3498db', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.subject_id)}
                  style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', width: '400px' }}>
            <h2>{modalType === 'add' ? 'Add Subject' : 'Edit Subject'}</h2>
            <form onSubmit={handleModalSave}>
              <div style={{ marginBottom: '10px' }}>
                <label>Subject Name:</label>
                <input
                  type="text"
                  required
                  value={modalData.subjectname}
                  onChange={(e) => setModalData({ ...modalData, subjectname: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Course:</label>
                <select
                  required
                  value={modalData.course_id}
                  onChange={(e) => setModalData({ ...modalData, course_id: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.coursename}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 15px', borderRadius: '5px' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#27ae60', color: '#fff', border: 'none' }}>
                  {modalType === 'add' ? 'Add' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
