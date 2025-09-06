import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login } from '../services/faculty'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [courseId, setCourseId] = useState('')
  const [showCourseSelect, setShowCourseSelect] = useState(false)

  const navigate = useNavigate()

  const onLogin = async () => {
    if (!email.trim()) {
      toast.warn('Enter email')
      return
    }
    if (!password.trim()) {
      toast.warn('Enter password')
      return
    }

    // If course selection is already requested, send course_id too
    if (showCourseSelect) {
      if (!courseId) {
        toast.warn('Select course')
        return
      }
      const result = await login(email, password, courseId)
      console.log('API result (with course):', result)

      if (result?.status === 'success') {
        const data = result.data
        sessionStorage['token'] = data.token
        toast.success('Login successful')
        navigate('/dashboard')
      } else {
        toast.error(result?.error || 'Something went wrong')
      }

      return
    }

    // First try: login without course_id
    const result = await login(email, password)
    console.log('API result:', result)

    if (result?.status === 'success') {
      const data = result.data
      sessionStorage['token'] = data.token
      toast.success('Login successful')
      navigate('/dashboard')
    } else {
      const err = result?.error || ''
      // If backend requires course selection for CC, show the dropdown
      if (err.toLowerCase().includes('course selection required')) {
        setShowCourseSelect(true)
        toast.info('Please select a course to continue')
      } else {
        toast.error(err || 'Something went wrong')
      }
    }
  }

  return (
    <>
      <h1 className="title">Login</h1>

      <div className="row">
        <div className="col"></div>
        <div className="col">
          <div className="form">
            <div className="mb-3">
              <label>Email</label>
              <input
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="abc@test.com"
                className="form-control"
                value={email}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="XXXXXXXXX"
                className="form-control"
                value={password}
              />
            </div>

            {/* Show course dropdown only when backend requested it */}
            {showCourseSelect && (
              <div className="mb-3">
                <label>Select Course</label>
                <select
                  value={courseId}
                  onChange={e => setCourseId(e.target.value)}
                  className="form-control"
                >
                  <option value="">-- Select Course --</option>
                  <option value="1">DMC 2024</option>
                  <option value="2">DAC 2024</option>
                  <option value="3">DBDA 2024</option>
                  <option value="4">DESD 2024</option>
                </select>
              </div>
            )}

            <div className="mb-3">
              <div>
                Don&apos;t have an account? <Link to="/register">Register here</Link>
              </div>
              <button onClick={onLogin} className="btn btn-primary mt-2">
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="col"></div>
      </div>
    </>
  )
}

export default Login

















































