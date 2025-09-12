import { Route, Routes } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import ViewStudentFeedback from './pages/ViewStudentFeedback'
import AddFacultyFeedback from './pages/AddFacultyFeedback'
//import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import StudentFeedbackList from './pages/StudentFeedbackList'
import FeedbackReports from './pages/FeedbackReports'



function App() {

  return (
  <div className='container-fluid'>
    <Routes>
      <Route index element={<Login />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/ViewStudentFeedback' element={<ViewStudentFeedback />} />
      <Route path='/AddFacultyFeedback' element={<AddFacultyFeedback />} />
      {/* <Route path='/Profile' element={<Profile/>} /> */}
      <Route path='/ChangePassword' element={<ChangePassword />} />
      <Route path='/StudentFeedbackList' element={<StudentFeedbackList />} />
      <Route path='/FeedbackReports' element={<FeedbackReports />} />
      
      
      
    </Routes>

    <ToastContainer />

  </div>

  )
}

export default App
