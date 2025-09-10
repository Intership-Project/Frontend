

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import Faculty from './pages/Faculty';
import Student from './pages/Student';
import Batch from './pages/Batch';

import Course from './pages/Course'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    
      <div className='container'>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
             <Route path="courses" element={<Course />} />
             <Route path="faculty" element={<Faculty />} />
              <Route path="students" element={<Student />} />
                 <Route path="batches" element={<Batch />} />

          </Route>
        </Routes>

        <ToastContainer />
      </div>
    
  );
}

export default App;

