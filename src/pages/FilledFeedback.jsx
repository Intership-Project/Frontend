// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function FilledFeedback() {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedData, setExpandedData] = useState({});
//   const [expandedFeedback, setExpandedFeedback] = useState(null);
//   const [loadingExpanded, setLoadingExpanded] = useState(null);

//   // Load all feedbacks grouped by schedule
//   const loadFeedbacks = async () => {
//     try {
//       const res = await axios.get('http://localhost:4000/filledfeedback/grouped-by-schedule', {
//         headers: { token: sessionStorage.getItem('token') }
//       });
//       if (res.data.status === 'success') {
//         setFeedbacks(res.data.data);
//       } else {
//         alert(res.data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Failed to load feedbacks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch expanded feedback (questions + answers)
//   const fetchFeedbackDetails = async (filledfeedbacks_id) => {
//     if (expandedFeedback === filledfeedbacks_id) {
//       setExpandedFeedback(null);
//       return;
//     }

//     setLoadingExpanded(filledfeedbacks_id);
//     try {
//       const res = await axios.get(`http://localhost:4000/filledfeedback/${filledfeedbacks_id}`, {
//         headers: { token: sessionStorage.getItem('token') }
//       });
//       if (res.data.status === 'success') {
//         setExpandedData(prev => ({
//           ...prev,
//           [filledfeedbacks_id]: res.data.data
//         }));
//         setExpandedFeedback(filledfeedbacks_id);
//       } else {
//         alert(res.data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Failed to load feedback details');
//     } finally {
//       setLoadingExpanded(null);
//     }
//   };

//   // Download PDF
//   const handleDownload = async (schedulefeedback_id) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:4000/filledfeedback/download/schedule/${schedulefeedback_id}`,
//         { responseType: 'blob', headers: { token: sessionStorage.getItem('token') } }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `schedule-${schedulefeedback_id}-responses.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to download PDF');
//     }
//   };

//   useEffect(() => {
//     loadFeedbacks();
//   }, []);

//   if (loading) return <p>Loading feedbacks...</p>;

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial' }}>
//       <h1>Filled Feedbacks</h1>
//       {feedbacks.map(({ schedule, feedbacks }) => (
//         <div key={schedule.schedulefeedback_id} style={{ marginBottom: '40px' }}>
//           <h2>{schedule.coursename} - {schedule.subjectname} ({schedule.facultyname})</h2>
//           <button
//             onClick={() => handleDownload(schedule.schedulefeedback_id)}
//             style={{
//               padding: '8px 15px',
//               backgroundColor: '#3498db',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               marginBottom: '10px'
//             }}
//           >
//             Download All Responses PDF
//           </button>

//           {feedbacks.length === 0 ? (
//             <p>No feedbacks yet.</p>
//           ) : (
//             <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
//               <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
//                 <tr>
//                   <th style={{ padding: '10px' }}>Student Name</th>
//                   <th>Comments</th>
//                   <th>Rating</th>
//                   <th>View</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {feedbacks.map(fb => (
//                   <React.Fragment key={fb.filledfeedbacks_id}>
//                     <tr style={{ borderBottom: '1px solid #ddd' }}>
//                       <td style={{ padding: '10px' }}>{fb.studentname}</td>
//                       <td>{fb.comments}</td>
//                       <td>{fb.rating ?? '-'}</td>
//                       <td>
//                         <button
//                           onClick={() => fetchFeedbackDetails(fb.filledfeedbacks_id)}
//                           style={{
//                             padding: '5px 10px',
//                             backgroundColor: '#27ae60',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '3px',
//                             cursor: 'pointer'
//                           }}
//                         >
//                           {expandedFeedback === fb.filledfeedbacks_id ? 'Hide' : 'View'}
//                         </button>
//                       </td>
//                     </tr>

//                     {expandedFeedback === fb.filledfeedbacks_id && (
//                       <tr>
//                         <td colSpan={4} style={{ backgroundColor: '#ecf0f1', padding: '10px' }}>
//                           {loadingExpanded === fb.filledfeedbacks_id ? (
//                             <p>Loading questions and answers...</p>
//                           ) : (
//                             expandedData[fb.filledfeedbacks_id]?.responses.map((r, idx) => (
//                               <div key={idx} style={{ marginBottom: '8px' }}>
//                                 <strong>Q{idx + 1}:</strong> {r.question} <br />
//                                 <strong>Answer:</strong> {r.response_rating}
//                               </div>
//                             ))
//                           )}
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FilledFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedData, setExpandedData] = useState({});
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [loadingExpanded, setLoadingExpanded] = useState(null);

  // Load all feedbacks grouped by schedule
  const loadFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:4000/filledfeedback/grouped-by-schedule', {
        headers: { token: sessionStorage.getItem('token') }
      });
      if (res.data.status === 'success') {
        setFeedbacks(res.data.data);
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch expanded feedback (questions + answers)
  const fetchFeedbackDetails = async (filledfeedbacks_id) => {
    if (expandedFeedback === filledfeedbacks_id) {
      setExpandedFeedback(null);
      return;
    }

    setLoadingExpanded(filledfeedbacks_id);
    try {
      const res = await axios.get(`http://localhost:4000/filledfeedback/${filledfeedbacks_id}`, {
        headers: { token: sessionStorage.getItem('token') }
      });
      if (res.data.status === 'success') {
        setExpandedData(prev => ({
          ...prev,
          [filledfeedbacks_id]: res.data.data
        }));
        setExpandedFeedback(filledfeedbacks_id);
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load feedback details');
    } finally {
      setLoadingExpanded(null);
    }
  };

  // Download PDF (updated)
  const handleDownload = async (schedulefeedback_id) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication required.');

      const response = await axios.get(
        `http://localhost:4000/filledfeedback/download/schedule/${schedulefeedback_id}`,
        { responseType: 'blob', headers: { token } } // ensures binary PDF
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule-${schedulefeedback_id}-responses.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // cleanup
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF: ' + err.message);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  if (loading) return <p>Loading feedbacks...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Filled Feedbacks</h1>
      {feedbacks.map(({ schedule, feedbacks }) => (
        <div key={schedule.schedulefeedback_id} style={{ marginBottom: '40px' }}>
          <h2>{schedule.coursename} - {schedule.subjectname} ({schedule.facultyname})</h2>
          <button
            onClick={() => handleDownload(schedule.schedulefeedback_id)}
            style={{
              padding: '8px 15px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            Download All Responses PDF
          </button>

          {feedbacks.length === 0 ? (
            <p>No feedbacks yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
                <tr>
                  <th style={{ padding: '10px' }}>Student Name</th>
                  <th>Comments</th>
                  <th>Rating</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map(fb => (
                  <React.Fragment key={fb.filledfeedbacks_id}>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px' }}>{fb.studentname}</td>
                      <td>{fb.comments}</td>
                      <td>{fb.rating ?? '-'}</td>
                      <td>
                        <button
                          onClick={() => fetchFeedbackDetails(fb.filledfeedbacks_id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#27ae60',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          {expandedFeedback === fb.filledfeedbacks_id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>

                    {expandedFeedback === fb.filledfeedbacks_id && (
                      <tr>
                        <td colSpan={4} style={{ backgroundColor: '#ecf0f1', padding: '10px' }}>
                          {loadingExpanded === fb.filledfeedbacks_id ? (
                            <p>Loading questions and answers...</p>
                          ) : (
                            expandedData[fb.filledfeedbacks_id]?.responses.map((r, idx) => (
                              <div key={idx} style={{ marginBottom: '8px' }}>
                                <strong>Q{idx + 1}:</strong> {r.question} <br />
                                <strong>Answer:</strong> {r.response_rating}
                              </div>
                            ))
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
