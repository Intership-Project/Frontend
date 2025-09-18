import { Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import Register from './pages/Register'
import Login from './pages/Login'
import HomeCC from './pages/HomeCC'
import ViewStudentFeedback from './pages/ViewStudentFeedback'
import AddFacultyFeedback from './pages/AddFacultyFeedback'
import ChangePassword from './pages/ChangePassword'
import StudentFeedbackList from './pages/StudentFeedbackList'
import HomeFaculty from './pages/HomeFaculty'

function App() {
  return (
    <div className='container-fluid'>
      <Routes>
        <Route index element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* CC ka dashboard */}
        <Route path='/homecc' element={<HomeCC />} />

        {/* Faculty/Lab Mentor/Trainer ka dashboard */}
        <Route path='/homefaculty' element={<HomeFaculty />} />

        <Route path='/viewstudentfeedback' element={<ViewStudentFeedback />} />
        <Route path='/addfacultyfeedback' element={<AddFacultyFeedback />} />
        <Route path='/changepassword' element={<ChangePassword />} />
        <Route path='/studentfeedbacklist' element={<StudentFeedbackList />} />
      </Routes>

      <ToastContainer />
    </div>
  )
}

export default App
