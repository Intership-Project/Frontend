// import { useEffect, useState } from 'react';
// import { fetchAllFilledFeedback, downloadAllFeedbacksPDF } from '../services/fillfeedback';

// export default function FilledFeedback() {
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadFeedback();
//   }, []);

//   const loadFeedback = async () => {
//     const response = await fetchAllFilledFeedback();
//     if (response.status === 'success') {
//       setFeedbackList(response.data);
//     } else {
//       alert(response.error?.message || JSON.stringify(response.error));
//     }
//     setLoading(false);
//   };

//   if (loading) return <p>Loading filled feedback...</p>;

//   // Group feedbacks by schedulefeedback_id and coursename
//   const groupedFeedback = feedbackList.reduce((acc, f) => {
//     if (!acc[f.schedulefeedback_id]) {
//       acc[f.schedulefeedback_id] = { courses: {} };
//     }
//     if (!acc[f.schedulefeedback_id].courses[f.coursename]) {
//       acc[f.schedulefeedback_id].courses[f.coursename] = [];
//     }
//     acc[f.schedulefeedback_id].courses[f.coursename].push(f);
//     return acc;
//   }, {});

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>Grouped Filled Feedbacks</h1>

//       {Object.entries(groupedFeedback).map(([scheduleId, scheduleData]) => (
//         <div key={scheduleId} style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
//           <h2>ScheduleFeedback ID: {scheduleId}</h2>

//           <button
//             onClick={() => downloadAllFeedbacksPDF(scheduleId)}
//             style={{
//               backgroundColor: '#2980b9',
//               color: '#fff',
//               padding: '8px 16px',
//               borderRadius: '5px',
//               border: 'none',
//               cursor: 'pointer',
//               marginBottom: '20px'
//             }}
//           >
//             Download Combined PDF for Schedule {scheduleId}
//           </button>

//           {Object.entries(scheduleData.courses).map(([courseName, feedbacks]) => (
//             <div key={courseName} style={{ marginBottom: '20px' }}>
//               <h3 style={{ color: '#34495e' }}>Course: {courseName}</h3>

//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
//                   <tr>
//                     <th style={{ padding: '8px' }}>Student</th>
//                     <th style={{ padding: '8px' }}>Comment</th>
//                     <th style={{ padding: '8px' }}>Rating</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {feedbacks.map(f => (
//                     <tr key={f.filledfeedbacks_id} style={{ borderBottom: '1px solid #ddd' }}>
//                       <td style={{ padding: '8px' }}>{f.studentname}</td>
//                       <td style={{ padding: '8px' }}>{f.comments || '-'}</td>
//                       <td style={{ padding: '8px' }}>{f.rating}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       ))}

//       {Object.keys(groupedFeedback).length === 0 && (
//         <p>No filled feedbacks found.</p>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { fetchAllFilledFeedback, downloadAllFeedbacksPDF } from '../services/fillfeedback';

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      const response = await fetchAllFilledFeedback();
      console.log('API Response:', response);  // Debugging

      if (response.status === 'success') {
        setFeedbackList(response.data);
      } else {
        alert(response.error?.message || 'Failed to load feedbacks');
      }
      setLoading(false);
    };

    loadFeedback();
  }, []);

  if (loading) return <p>Loading feedbacks...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>All Filled Feedbacks</h2>
      {feedbackList.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No feedbacks available.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>ID</th>
              <th>Schedule ID</th>
              <th>Course</th>
              <th>Student</th>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Comments</th>
              <th>Rating</th>
              <th>Download PDF</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map(fb => (
              <tr key={fb.filledfeedbacks_id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{fb.filledfeedbacks_id}</td>
                <td>{fb.schedulefeedback_id}</td>
                <td>{fb.coursename}</td>
                <td>{fb.studentname}</td>
                <td>{fb.subjectname}</td>
                <td>{fb.facultyname}</td>
                <td>{fb.StartDate}</td>
                <td>{fb.EndDate}</td>
                <td>{fb.comments || '-'}</td>
                <td>{fb.rating}</td>
                <td>
                  <button
                    onClick={() => downloadAllFeedbacksPDF(fb.schedulefeedback_id)}
                    style={{
                      backgroundColor: '#27ae60',
                      color: '#fff',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackList;
