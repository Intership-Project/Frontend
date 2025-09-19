import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as facultyLogin } from '../services/facultylogin';
import { login as adminLogin } from '../services/admin';

export function Login() {
  const [userType, setUserType] = useState('faculty'); // faculty or admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');
  const [showCourseSelect, setShowCourseSelect] = useState(false);

  const navigate = useNavigate();

  const onLogin = async () => {
    if (!email.trim()) {
      toast.warn('Enter email');
      return;
    }
    if (!password.trim()) {
      toast.warn('Enter password');
      return;
    }

    let result;

    if (userType === 'faculty') {
      if (showCourseSelect && !courseId) {
        toast.warn('Select course');
        return;
      }
      result = await facultyLogin(email, password, showCourseSelect ? courseId : null);

      if (result?.status === 'success') {
        const data = result.data;
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usertype', 'Faculty');
        sessionStorage.setItem('rolename', data.rolename);
        sessionStorage.setItem('username', data.username);
        toast.success('Faculty login successful');

        if (data.rolename === 'Course Coordinator') navigate('/homecc');
        else if (data.rolename === 'Trainer' || data.rolename === 'Lab Mentor') navigate('/homefaculty');
        else navigate('/home');
      } else {
        const err = result?.error || '';
        if (err.toLowerCase().includes('course selection required')) {
          setShowCourseSelect(true);
          toast.info('Please select a course to continue');
        } else {
          toast.error(err || 'Something went wrong');
        }
      }
    } else if (userType === 'admin') {
      result = await adminLogin(email, password);
      if (result?.status === 'success') {
        const data = result.data;
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usertype', 'Admin');
        sessionStorage.setItem('adminId', data.adminId);
        toast.success('Admin login successful');
        navigate('/admin/Home');
      } else {
        toast.error(result?.error || 'Invalid email or password');
      }
    }
  };

  return (
    <>
      <h1 className="title">Login</h1>

      <div className="row">
        <div className="col"></div>
        <div className="col">
          <div className="form">
            {/* User type selection */}
            <div className="mb-3">
              <label>Login As</label>
              <select
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setShowCourseSelect(false);
                }}
                className="form-control"
              >
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@test.com"
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="form-control"
              />
            </div>

            {/* Faculty only: Course selection */}
            {userType === 'faculty' && showCourseSelect && (
              <div className="mb-3">
                <label>Select Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
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

            {/* Forgot Password */}
            <div className="mb-2">
              <Link to={`/forgotpassword/${userType}`} style={{ fontSize: '14px' }}>
                Forgot Password?
              </Link>
            </div>

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
  );
}

export default Login;
