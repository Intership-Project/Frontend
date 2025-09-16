

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddFeedback from './pages/AddFeedback';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './pages/AdminLayout';
import Batch from './pages/Batch';
import Course from './pages/Course';
import Dashboard from './pages/Dashboard';
import Faculty from './pages/Faculty';
import FeedbackModuleType from './pages/FeedbackModuletype';
import FeedbackQuestion from './pages/FeedbackQuestion';
import FeedbackType from './pages/FeedbackType';
import FilledFeedback from './pages/FilledFeedback';
import Login from './pages/Login';
import Register from './pages/Register';
import ScheduleForm from './pages/ScheduleForm';
import Student from './pages/Student';
import Subject from './pages/Subject';

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
                 <Route path="subjects" element={<Subject/>} />

                   <Route path="schedule" element={<ScheduleForm/>} />

                 <Route path="questions" element={<FeedbackQuestion/>} />
                 <Route path="FeedbackTypes" element={<FeedbackType/>} />

                 <Route path="add-feedback" element={<AddFeedback/>} />
                 <Route path="FeedbackModuleTypes" element={<FeedbackModuleType/>} />

                 <Route path="feedback" element={<FilledFeedback/>} />



          </Route>
        </Routes>

        <ToastContainer />
      </div>
    
  );
}

export default App;

