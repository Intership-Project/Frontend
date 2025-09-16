import { Route, Routes } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import Register from './pages/Register'
import Login from './pages/Login'
import HomeCC from './pages/HomeCC'
import ViewStudentFeedback from './pages/ViewStudentFeedback'
import AddFacultyFeedback from './pages/AddFacultyFeedback'
//import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import StudentFeedbackList from './pages/StudentFeedbackList'




function App() {

  return (
  <div className='container-fluid'>
    <Routes>
      <Route index element={<Login />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/Home' element={<HomeCC />} />
      <Route path='/homecc' element={<HomeCC />} />
      <Route path='/ViewStudentFeedback' element={<ViewStudentFeedback />} />
      <Route path='/AddFacultyFeedback' element={<AddFacultyFeedback />} />
      {/* <Route path='/Profile' element={<Profile/>} /> */}
      <Route path='/ChangePassword' element={<ChangePassword />} />
      <Route path='/StudentFeedbackList' element={<StudentFeedbackList />} />
      
      
      
      
    </Routes>

    <ToastContainer />

  </div>

  )
}

export default App
