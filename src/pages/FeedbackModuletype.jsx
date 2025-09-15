import React, { useEffect, useState } from 'react';
import { createFeedbackModuleType, deleteFeedbackModuleType, getFeedbackModuleTypesByType } from '../services/feedbackmoduletype';
import { getFeedbackTypes } from '../services/feedbacktype';

export default function FeedbackModuleType() {
  const [moduleTypes, setModuleTypes] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [formData, setFormData] = useState({ fbmoduletypename: '', feedbacktype_id: '' });

  useEffect(() => {
    loadModuleTypes();
    loadFeedbackTypes();
  }, []);

  const loadModuleTypes = async () => {
    const res = await  getFeedbackModuleTypesByType();
    if (res.status === 'success') setModuleTypes(res.data);
  };

  const loadFeedbackTypes = async () => {
    const res = await getFeedbackTypes();
    if (res.status === 'success') setFeedbackTypes(res.data);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createFeedbackModuleType(formData);
    if (res.status === 'success') {
      alert('Feedback module type added successfully');
      setModuleTypes([res.data, ...moduleTypes]);
      setFormData({ fbmoduletypename: '', feedbacktype_id: '' });
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this module type?')) return;
    const res = await deleteFeedbackModuleType(id);
    if (res.status === 'success') setModuleTypes(moduleTypes.filter(m => m.feedbackmoduletype_id !== id));
    else alert(`Error: ${res.error}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Feedback Module Types</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          required
          placeholder="Module Name"
          value={formData.fbmoduletypename}
          onChange={e => setFormData({...formData, fbmoduletypename: e.target.value})}
        />
        <select required value={formData.feedbacktype_id} onChange={e => setFormData({...formData, feedbacktype_id: e.target.value})}>
          <option value="">Select Feedback Type</option>
          {feedbackTypes.map(ft => <option key={ft.feedbacktype_id} value={ft.feedbacktype_id}>{ft.fbtypename}</option>)}
        </select>
        <button type="submit" style={{ backgroundColor: '#27ae60', color: '#fff', padding: '5px 15px', border: 'none', borderRadius: '5px' }}>
          Add
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
          <tr>
            <th>ID</th>
            <th>Module Name</th>
            <th>Feedback Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {moduleTypes.map(m => (
            <tr key={m.feedbackmoduletype_id}>
              <td>{m.feedbackmoduletype_id}</td>
              <td>{m.fbmoduletypename}</td>
              <td>{m.fbtypename}</td>
              <td>
                <button
                  onClick={() => handleDelete(m.feedbackmoduletype_id)}
                  style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}
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
