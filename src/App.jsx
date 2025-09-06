import { Route, Routes } from "react-router-dom"
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return <div className='container'>
    <Routes>
      <Route index element={<Login />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/Dashboard' element={<Dashboard />} />
    </Routes>

    <ToastContainer />

  </div>


}

export default App
