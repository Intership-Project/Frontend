import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeCC from "./pages/HomeCC";
import ViewStudentFeedback from "./pages/ViewStudentFeedback";
import AddFacultyFeedback from "./pages/AddFacultyFeedback";
import ChangePassword from "./pages/ChangePassword";
import StudentFeedbackList from "./pages/StudentFeedbackList";
import HomeFaculty from "./pages/HomeFaculty";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddFeedback from "./pages/AddFeedback";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";
import Batch from "./pages/Batch";
import Course from "./pages/Course";
import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import FeedbackModuleType from "./pages/FeedbackModuletype";
import FeedbackQuestion from "./pages/FeedbackQuestion";
import FeedbackType from "./pages/FeedbackType";
import FilledFeedback from "./pages/FilledFeedback";
import ScheduleForm from "./pages/ScheduleForm";
import Student from "./pages/Student";
import Subject from "./pages/Subject";

function App() {
  return (
    <div className="container-fluid">
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword/:userType" element={<ForgotPassword />} />
        <Route
          path="/resetpassword/:userType/:resetToken"
          element={<ResetPassword />}
        />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* CC Dashboard */}
        <Route path="/homecc" element={<HomeCC />} />

        {/* Faculty/Lab Mentor/Trainer Dashboard */}
        <Route path="/homefaculty" element={<HomeFaculty />} />

        {/* Feedback related routes */}
        <Route path="/viewstudentfeedback" element={<ViewStudentFeedback />} />
        <Route path="/addfacultyfeedback" element={<AddFacultyFeedback />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/studentfeedbacklist" element={<StudentFeedbackList />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<Course />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="students" element={<Student />} />
          <Route path="batches" element={<Batch />} />
          <Route path="subjects" element={<Subject />} />
          <Route path="schedule" element={<ScheduleForm />} />
          <Route path="questions" element={<FeedbackQuestion />} />
          <Route path="FeedbackTypes" element={<FeedbackType />} />
          <Route path="add-feedback" element={<AddFeedback />} />
          <Route path="FeedbackModuleTypes" element={<FeedbackModuleType />} />
          <Route path="feedback" element={<FilledFeedback />} />
        </Route>
      </Routes>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
