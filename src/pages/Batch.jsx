import React, { useEffect, useState } from 'react';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../services/batch';
import { getCourses } from '../services/course';

export default function Batch() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalData, setModalData] = useState({ batchname: '', course_id: '' });
  const [editBatchId, setEditBatchId] = useState(null);

  useEffect(() => {
    loadBatches();
    loadCourses();
  }, []);

  const loadBatches = async () => {
    try {
      const res = await getBatches();
      if (res.status === 'success') setBatches(res.data);
      else setError(res.error || 'Failed to load batches');
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
    setModalData({ batchname: '', course_id: '' });
    setShowModal(true);
  };

  const openEditModal = (batch) => {
    setModalType('edit');
    setEditBatchId(batch.batch_id);
    setModalData({ batchname: batch.batchname, course_id: batch.course_id });
    setShowModal(true);
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const payload = {
      batchname: modalData.batchname || null,
      course_id: modalData.course_id || null,
    };

    const course = courses.find(c => Number(c.course_id) === Number(payload.course_id));

    if (modalType === 'add') {
      const res = await createBatch(payload);
      if (res.status === 'error') alert(`Add failed: ${res.error}`);
      else {
        alert('Batch added successfully');
        const newBatch = { ...res.data, coursename: course?.coursename || 'Unknown' };
        setBatches([...batches, newBatch]);
        setShowModal(false);
      }
    } else {
      const res = await updateBatch(editBatchId, payload);
      if (res.status === 'error') alert(`Update failed: ${res.error}`);
      else {
        alert('Batch updated successfully');
        setBatches(
          batches.map(b =>
            b.batch_id === editBatchId
              ? { ...b, ...payload, coursename: course?.coursename || 'Unknown' }
              : b
          )
        );
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) return;
    const res = await deleteBatch(id);
    if (res.status === 'error') alert(`Delete failed: ${res.error}`);
    else {
      alert('Batch deleted successfully');
      setBatches(batches.filter((b) => b.batch_id !== id));
    }
  };

  if (loading) return <p>Loading batches...</p>;
  if (error) return <p>{error}</p>;

  // Compute number of batches per course
  const batchCounts = courses.map(course => {
    const count = batches.filter(b => b.course_id === course.course_id).length;
    return { ...course, count };
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Batch Management</h1>

      {/* Course summary boxes */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {batchCounts.map(c => (
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
          Add Batch
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th>ID</th>
            <th>Batch Name</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b, index) => (
            <tr key={b.batch_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{index + 1}</td> {/* Sequential row number */}
              <td>{b.batchname}</td>
              <td>{b.coursename || 'Unknown'}</td>
              <td>
                <button
                  onClick={() => openEditModal(b)}
                  style={{
                    marginRight: '5px',
                    backgroundColor: '#3498db',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.batch_id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '10px',
              width: '400px',
            }}
          >
            <h2>{modalType === 'add' ? 'Add Batch' : 'Edit Batch'}</h2>
            <form onSubmit={handleModalSave}>
              <div style={{ marginBottom: '10px' }}>
                <label>Batch Name:</label>
                <input
                  type="text"
                  required
                  value={modalData.batchname}
                  onChange={(e) =>
                    setModalData({ ...modalData, batchname: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Course:</label>
                <select
                  required
                  value={modalData.course_id}
                  onChange={(e) =>
                    setModalData({ ...modalData, course_id: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
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
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '8px 15px', borderRadius: '5px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    backgroundColor: '#27ae60',
                    color: '#fff',
                    border: 'none',
                  }}
                >
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
