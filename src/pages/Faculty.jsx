
import { useEffect, useState } from 'react';
import { addFaculty, deleteFaculty, fetchAllCourses, fetchAllFaculty, updateFaculty } from '../services/facultylist';

// Role mappings
const getRoleNameById = (id) => ({ 1:'Lab Mentor', 6:'Trainer', 7:'Course Coordinator' }[id] || 'Unknown');
const getRoleIdByName = (name) => ({ 'Lab Mentor':1, 'Trainer':6, 'Course Coordinator':7 }[name] || 1);

export default function Faculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalData, setModalData] = useState({ facultyname: '', email: '', password: '', role_id: 6, course_id: '' });
  const [editFacultyId, setEditFacultyId] = useState(null);

  useEffect(() => {
    loadFaculty();
    loadCourses();
  }, []);

  const loadFaculty = async () => {
    try {
      const response = await fetchAllFaculty();
      if (response.status === 'error') {
        alert(response.error?.message || JSON.stringify(response.error));
        window.location.href = '/login';
        return;
      }
      setFacultyList(response.data || []);
    } catch {
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    const response = await fetchAllCourses();
    if (response.status === 'success') setCourses(response.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty?')) return;
    const response = await deleteFaculty(id);
    if (response.status === 'error') {
      alert(`Delete failed: ${response.error?.message || JSON.stringify(response.error)}`);
    } else {
      alert('Faculty deleted successfully');
      setFacultyList(facultyList.filter(f => f.faculty_id !== id));
    }
  };

  const openAddModal = () => {
    setModalType('add');
    setModalData({ facultyname: '', email: '', password: '', role_id: 6, course_id: '' });
    setShowModal(true);
  };

  const openEditModal = (faculty) => {
    setModalType('edit');
    setEditFacultyId(faculty.faculty_id);
    setModalData({
      facultyname: faculty.facultyname,
      email: faculty.email,
      role_id: getRoleIdByName(faculty.rolename),
      password: '',
      course_id: faculty.course_id || ''
    });
    setShowModal(true);
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const payload = {
      facultyname: modalData.facultyname !== '' ? modalData.facultyname : null,
      email: modalData.email !== '' ? modalData.email : null,
      role_id: modalData.role_id ? Number(modalData.role_id) : null,
      course_id: modalData.role_id === 7
        ? (modalData.course_id !== '' ? Number(modalData.course_id) : null)
        : null,
      password: modalType === 'add'
        ? (modalData.password !== '' ? modalData.password : null)
        : undefined
    };

    if (modalType === 'add') {
      const response = await addFaculty(payload);
      if (response.status === 'error') {
        alert(`Add failed: ${response.error?.message || JSON.stringify(response.error)}`);
      } else {
        alert('Faculty added successfully');
        setFacultyList([...facultyList, {
          faculty_id: response.data.facultyId,
          facultyname: modalData.facultyname,
          email: modalData.email,
          rolename: getRoleNameById(payload.role_id),
          course_id: payload.course_id
        }]);
        setShowModal(false);
      }
    } else {
      const response = await updateFaculty(editFacultyId, payload);
      if (response.status === 'error') {
        alert(`Update failed: ${response.error?.message || JSON.stringify(response.error)}`);
      } else {
        alert('Faculty updated successfully');
        setFacultyList(facultyList.map(f =>
          f.faculty_id === editFacultyId
            ? { ...f, ...payload, rolename: getRoleNameById(payload.role_id) }
            : f
        ));
        setShowModal(false);
      }
    }
  };

  if (loading) return <p>Loading faculty data...</p>;
  if (error) return <p>{error}</p>;

  const trainerCount = facultyList.filter(f => f.rolename==='Trainer').length;
  const labMentorCount = facultyList.filter(f => f.rolename==='Lab Mentor').length;
  const courseCordinaterCount = facultyList.filter(f => f.rolename==='Course Coordinator').length;

  return (
    <div style={{ padding:'20px', fontFamily:'Arial, sans-serif' }}>
      <h1>Faculty Management</h1>
      <div style={{ display:'flex', gap:'20px', marginBottom:'20px' }}>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1 }}>
          <h3>Total Trainers</h3><p style={{ fontSize:'24px', fontWeight:'bold' }}>{trainerCount}</p>
        </div>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1 }}>
          <h3>Total Lab Mentors</h3><p style={{ fontSize:'24px', fontWeight:'bold' }}>{labMentorCount}</p>
        </div>
        <div style={{ padding:'15px', background:'#ecf0f1', borderRadius:'8px', flex:1 }}>
          <h3>Total Course Coordinators</h3><p style={{ fontSize:'24px', fontWeight:'bold' }}>{courseCordinaterCount}</p>
        </div>
      </div>
      <div style={{ marginBottom:'20px' }}>
        <button onClick={openAddModal} style={{ backgroundColor:'#27ae60', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer', fontWeight:'bold' }}>Add Faculty</button>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead style={{ backgroundColor:'#2c3e50', color:'#fff' }}>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {facultyList.map(f => (
            <tr key={f.faculty_id} style={{ borderBottom:'1px solid #ddd' }}>
              <td>{f.faculty_id}</td><td>{f.facultyname}</td><td>{f.email}</td><td>{f.rolename}</td>
              <td>
                <button onClick={()=>openEditModal(f)} style={{ marginRight:'5px', backgroundColor:'#3498db', color:'#fff', padding:'5px 10px', borderRadius:'5px' }}>Edit</button>
                <button onClick={()=>handleDelete(f.faculty_id)} style={{ backgroundColor:'#e74c3c', color:'#fff', padding:'5px 10px', borderRadius:'5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{ position:'fixed', top:0,left:0,right:0,bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <div style={{ background:'#fff', padding:'20px', borderRadius:'10px', width:'400px' }}>
            <h2>{modalType==='add' ? 'Add Faculty':'Edit Faculty'}</h2>
            <form onSubmit={handleModalSave}>
              <div style={{ marginBottom:'10px' }}>
                <label>Name:</label>
                <input type="text" required value={modalData.facultyname} onChange={e=>setModalData({...modalData, facultyname:e.target.value})} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom:'10px' }}>
                <label>Email:</label>
                <input type="email" required value={modalData.email} onChange={e=>setModalData({...modalData, email:e.target.value})} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }} />
              </div>
              {modalType==='add' && <div style={{ marginBottom:'10px' }}>
                <label>Password:</label>
                <input type="password" required value={modalData.password} onChange={e=>setModalData({...modalData,password:e.target.value})} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }} />
              </div>}
              <div style={{ marginBottom:'10px' }}>
                <label>Role:</label>
                <select value={modalData.role_id} onChange={e=>setModalData({...modalData, role_id:Number(e.target.value)})} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }}>
                  <option value={6}>Trainer</option>
                  <option value={1}>Lab Mentor</option>
                  <option value={7}>Course Coordinator</option>
                </select>
              </div>
              {modalData.role_id===7 && (
                <div style={{ marginBottom:'10px' }}>
                  <label>Course:</label>
                  <select value={modalData.course_id} onChange={e=>setModalData({...modalData, course_id:e.target.value})} style={{ width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc' }}>
                    <option value="">Select course</option>
                    {courses.map(c=><option key={c.course_id} value={c.course_id}>{c.coursename}</option>)}
                  </select>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
                <button type="button" onClick={()=>setShowModal(false)} style={{ padding:'8px 15px', borderRadius:'5px' }}>Cancel</button>
                <button type="submit" style={{ padding:'8px 15px', borderRadius:'5px', backgroundColor:'#27ae60', color:'#fff', border:'none' }}>{modalType==='add' ? 'Add':'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
