
import React, { useEffect, useState } from 'react';
import { fetchAllStudents, addStudent, updateStudent, deleteStudent } from '../services/student';
import { getCourses } from '../services/course';
import { getBatches } from '../services/batch';

export default function Student() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalData, setModalData] = useState({
    studentname: '',
    email: '',
    password: '',
    course_id: '',
    batch_id: ''
  });
  const [editStudentId, setEditStudentId] = useState(null);

  useEffect(() => {
    loadStudents();
    loadCourses();
    loadBatches();
  }, []);

  const loadStudents = async () => {
    const res = await fetchAllStudents();
    if (res.status === 'success') setStudents(res.data);
    else setError(res.error?.message || JSON.stringify(res.error));
    setLoading(false);
  };

  const loadCourses = async () => {
    const res = await getCourses();
    if (res.status === 'success') setCourses(res.data);
  };

  const loadBatches = async () => {
    const res = await getBatches();
    if (res.status === 'success') setBatches(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    const res = await deleteStudent(id);
    if (res.status === 'success') {
      setStudents(students.filter(s => s.student_id !== id));
      alert('Student deleted successfully');
    } else {
      alert(`Delete failed: ${res.error?.message || JSON.stringify(res.error)}`);
    }
  };

  const openAddModal = () => {
    setModalType('add');
    setModalData({ studentname: '', email: '', password: '', course_id: '', batch_id: '' });
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setModalType('edit');
    setEditStudentId(student.student_id);
    setModalData({
      studentname: student.studentname,
      email: student.email,
      password: '',
      course_id: student.course_id || '',
      batch_id: student.batch_id || ''
    });
    setShowModal(true);
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const payload = {
      studentname: modalData.studentname,
      email: modalData.email,
      course_id: modalData.course_id ? Number(modalData.course_id) : null,
      batch_id: modalData.batch_id ? Number(modalData.batch_id) : null,
      password: modalType === 'add' ? modalData.password : undefined
    };

    if (modalType === 'add') {
      const res = await addStudent(payload);
      if (res.status === 'success') {
        setStudents([...students, { ...payload, student_id: res.data.student_id }]);
        setShowModal(false);
      } else alert(res.error?.message || JSON.stringify(res.error));
    } else {
      const res = await updateStudent(editStudentId, payload);
      if (res.status === 'success') {
        setStudents(students.map(s => s.student_id === editStudentId ? { ...s, ...payload } : s));
        setShowModal(false);
      } else alert(res.error?.message || JSON.stringify(res.error));
    }
  };

  const getCourseName = (id) => {
    const course = courses.find(c => c.course_id === id);
    return course ? course.coursename : 'Unknown';
  };

  const getBatchName = (id) => {
    const batch = batches.find(b => b.batch_id === id);
    return batch ? batch.batchname : 'Unknown';
  };

  // Calculate total students per course
  const studentCountPerCourse = courses.map(c => ({
    course_id: c.course_id,
    coursename: c.coursename,
    count: students.filter(s => s.course_id === c.course_id).length
  }));

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Student Management</h1>

      {/* Summary Boxes for Students per Course */}
      <div style={{
        display: 'flex',
        gap: '15px',
        margin: '20px 0',
        flexWrap: 'nowrap',
        overflowX: 'auto'
      }}>
        {studentCountPerCourse.map(c => (
          <div
            key={c.course_id}
            style={{
              flex: '0 0 150px',
              padding: '15px',
              background: '#ecf0f1',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <h4 style={{ margin: '0 0 5px 0' }}>{c.coursename}</h4>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              {c.count} Student{c.count !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={openAddModal}
          style={{ backgroundColor: '#27ae60', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Add Student
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Batch</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.student_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{s.student_id}</td>
              <td>{s.studentname}</td>
              <td>{s.email}</td>
              <td>{getCourseName(s.course_id)}</td>
              <td>{getBatchName(s.batch_id)}</td>
              <td>
                <button onClick={() => openEditModal(s)} style={{ marginRight: '5px', backgroundColor: '#3498db', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>Edit</button>
                <button onClick={() => handleDelete(s.student_id)} style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{ position: 'fixed', top:0,left:0,right:0,bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <div style={{ background:'#fff', padding:'20px', borderRadius:'10px', width:'400px' }}>
            <h2>{modalType==='add' ? 'Add Student' : 'Edit Student'}</h2>
            <form onSubmit={handleModalSave}>
              <div style={{ marginBottom: '10px' }}>
                <label>Name:</label>
                <input type="text" required value={modalData.studentname} onChange={e => setModalData({ ...modalData, studentname: e.target.value })} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Email:</label>
                <input type="email" required value={modalData.email} onChange={e => setModalData({ ...modalData, email: e.target.value })} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }} />
              </div>
              {modalType==='add' && <div style={{ marginBottom: '10px' }}>
                <label>Password:</label>
                <input type="password" required value={modalData.password} onChange={e => setModalData({ ...modalData, password: e.target.value })} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }} />
              </div>}
              <div style={{ marginBottom: '10px' }}>
                <label>Course:</label>
                <select value={modalData.course_id} onChange={e => setModalData({ ...modalData, course_id: Number(e.target.value) })} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.coursename}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Batch:</label>
                <select value={modalData.batch_id} onChange={e => setModalData({ ...modalData, batch_id: Number(e.target.value) })} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }}>
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b.batch_id} value={b.batch_id}>{b.batchname}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding:'8px 15px', borderRadius:'5px' }}>Cancel</button>
                <button type="submit" style={{ padding:'8px 15px', borderRadius:'5px', backgroundColor:'#27ae60', color:'#fff', border:'none' }}>{modalType==='add' ? 'Add' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
