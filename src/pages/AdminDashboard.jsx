// import React from 'react'

// export function AdminDashboard() {
//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <p>Welcome to the admin dashboard where you can manage the system.</p>
//     </div>
//   )
// }

// export default AdminDashboard
// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState({});
  const [moduleTypes, setModuleTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedule feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/schedulefeedback");
      if (res.data.status === "success") {
        setFeedbacks(res.data.data);
      } else {
        setError("Failed to fetch schedule feedbacks");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  // Fetch feedback type table
  const fetchFeedbackTypes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/feedbacktypes"); // Adjust route
      if (res.data.status === "success") {
        const map = {};
        res.data.data.forEach((ft) => {
          map[ft.feedbacktype_id] = ft.feedbacktype_name;
        });
        setFeedbackTypes(map);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch feedback module type table
  const fetchModuleTypes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/feedbackmoduletypes"); // Adjust route
      if (res.data.status === "success") {
        const map = {};
        res.data.data.forEach((mt) => {
          map[mt.feedbackmoduletype_id] = mt.feedbackmoduletype_name;
        });
        setModuleTypes(map);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchFeedbacks(), fetchFeedbackTypes(), fetchModuleTypes()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading schedule feedbacks...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Schedule Feedbacks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Course</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Faculty</th>
              <th className="py-2 px-4 border-b">Batch</th>
              <th className="py-2 px-4 border-b">Feedback Type</th>
              <th className="py-2 px-4 border-b">Module Type</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f.schedulefeedback_id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{f.schedulefeedback_id}</td>
                <td className="py-2 px-4 border-b">{f.coursename}</td>
                <td className="py-2 px-4 border-b">{f.subjectname}</td>
                <td className="py-2 px-4 border-b">{f.facultyname}</td>
                <td className="py-2 px-4 border-b">{f.batchname || "N/A"}</td>
                <td className="py-2 px-4 border-b">{feedbackTypes[f.feedbacktype_id] || f.feedbacktype_id}</td>
                <td className="py-2 px-4 border-b">{moduleTypes[f.feedbackmoduletype_id] || f.feedbackmoduletype_id}</td>
                <td className="py-2 px-4 border-b">{new Date(f.StartDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{new Date(f.EndDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
