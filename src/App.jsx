import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

// Faculty / CC pages
import HomeCC from "./pages/HomeCC";
import HomeFaculty from "./pages/HomeFaculty";

// Feedback pages
import ViewStudentFeedback from "./pages/ViewStudentFeedback";
import AddFacultyFeedback from "./pages/AddFacultyFeedback";
import StudentFeedbackList from "./pages/StudentFeedbackList";
import AddFeedback from "./pages/AddFeedback";
import FilledFeedback from "./pages/FilledFeedback";
import FeedbackType from "./pages/FeedbackType";
import FeedbackModuleType from "./pages/FeedbackModuletype";
import FeedbackQuestion from "./pages/FeedbackQuestion";

// Admin pages
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Batch from "./pages/Batch";
import Course from "./pages/Course";
import Faculty from "./pages/Faculty";
import Student from "./pages/Student";
import Subject from "./pages/Subject";
import ScheduleForm from "./pages/ScheduleForm";

function App() {
  return (
    <div className="container-fluid">
      <Routes>
        {/* Public routes */}
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword/:userType" element={<ForgotPassword />} />
        <Route
          path="/resetpassword/:userType/:resetToken"
          element={<ResetPassword />}
        />

        {/* Faculty / CC dashboards */}
        <Route path="/homecc" element={<HomeCC />} />
        <Route path="/homefaculty" element={<HomeFaculty />} />

        {/* Feedback routes */}
        <Route path="/viewstudentfeedback" element={<ViewStudentFeedback />} />
        <Route path="/addfacultyfeedback" element={<AddFacultyFeedback />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/studentfeedbacklist" element={<StudentFeedbackList />} />

        {/* Admin routes (nested layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<Course />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="students" element={<Student />} />
          <Route path="batches" element={<Batch />} />
          <Route path="subjects" element={<Subject />} />
          <Route path="schedule" element={<ScheduleForm />} />
          <Route path="questions" element={<FeedbackQuestion />} />
          <Route path="feedback-types" element={<FeedbackType />} />
          <Route path="add-feedback" element={<AddFeedback />} />
          <Route path="feedback-module-types" element={<FeedbackModuleType />} />
          <Route path="feedback" element={<FilledFeedback />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
