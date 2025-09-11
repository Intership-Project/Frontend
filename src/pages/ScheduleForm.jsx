// src/pages/ScheduleForm.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/scheduleform';


const ScheduleForm = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [feedbackModules, setFeedbackModules] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFeedbackType, setSelectedFeedbackType] = useState('');
  const [selectedFeedbackModule, setSelectedFeedbackModule] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  // Fetch courses and feedback types on mount
  useEffect(() => {
    API.getCourses().then(res => res.status === 'success' && setCourses(res.data));
    API.getFeedbackTypes().then(res => res.status === 'success' && setFeedbackTypes(res.data));
  }, []);

  // Fetch subjects when course changes
  useEffect(() => {
    if (!selectedCourse) {
      setSubjects([]);
      return;
    }
    API.getSubjectsByCourse(selectedCourse).then(res => res.status === 'success' && setSubjects(res.data));
  }, [selectedCourse]);

  // Fetch batches when course changes and role = Lab Mentor
  useEffect(() => {
    if (!selectedCourse || selectedRole !== 'Lab Mentor') {
      setBatches([]);
      return;
    }
    API.getBatchesByCourse(selectedCourse).then(res => res.status === 'success' && setBatches(res.data));
  }, [selectedCourse, selectedRole]);

  // Fetch feedback modules when feedback type changes
  useEffect(() => {
    if (!selectedFeedbackType) {
      setFeedbackModules([]);
      return;
    }
    API.getFeedbackModules(selectedFeedbackType).then(res => res.status === 'success' && setFeedbackModules(res.data));
  }, [selectedFeedbackType]);

  // Fetch faculties when role changes
  useEffect(() => {
    if (!selectedRole) {
      setFaculties([]);
      return;
    }
    API.getFaculties(selectedRole).then(res => res.status === 'success' && setFaculties(res.data));
  }, [selectedRole]);

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      course: selectedCourse,
      subject: selectedSubject,
      feedbackType: selectedFeedbackType,
      feedbackModule: selectedFeedbackModule,
      role: selectedRole,
      faculty: selectedFaculty,
      batch: selectedBatch
    };
    console.log('Schedule payload:', payload);
    alert('Check console for payload');
  };

  return (
    <div className="schedule-form-container">
      <h2>Schedule Feedback</h2>
      <form className="schedule-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course:</label>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.coursename}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} required>
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subjectname}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Feedback Type:</label>
          <select value={selectedFeedbackType} onChange={e => setSelectedFeedbackType(e.target.value)} required>
            <option value="">Select Feedback Type</option>
            {feedbackTypes.map(f => <option key={f.feedbacktype_id} value={f.feedbacktype_id}>{f.fbtypename}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Feedback Module:</label>
          <select value={selectedFeedbackModule} onChange={e => setSelectedFeedbackModule(e.target.value)} required>
            <option value="">Select Feedback Module</option>
            {feedbackModules.map(m => <option key={m.feedbackmoduletype_id} value={m.feedbackmoduletype_id}>{m.fbmoduletypename}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="Trainer">Trainer</option>
            <option value="Lab Mentor">Lab Mentor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Faculty:</label>
          <select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)} required>
            <option value="">Select Faculty</option>
            {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.facultyname}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Batch:</label>
          <select
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            disabled={selectedRole === 'Trainer'}
            required={selectedRole === 'Lab Mentor'}
          >
            <option value="">Select Batch</option>
            {batches.map(b => <option key={b.batch_id} value={b.batch_id}>{b.batchname}</option>)}
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ScheduleForm;
