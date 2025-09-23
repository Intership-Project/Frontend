import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register as facultyRegister, fetchCourses } from "../services/facultylogin";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCourses() {
      const result = await fetchCourses();
      if (result.status === "success") {
        setCourses(result.data);
      } else {
        toast.error(result.error || "Failed to fetch courses");
      }
    }
    loadCourses();
  }, []);

  const onRegister = async () => {
    if (!name.trim()) return toast.warn("Enter name");
    if (!email.trim()) return toast.warn("Enter email");
    if (!password.trim()) return toast.warn("Enter password");
    if (!roleId) return toast.warn("Select role");
    if (roleId === "3" && !courseId) return toast.warn("Select course");

    const result = await facultyRegister(name, email, password, roleId, courseId);
    if (result.status === "success") {
      toast.success("Successfully registered");
      navigate("/");
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <>
      <h1 className="title">Faculty Register</h1>

      <div className="row">
        <div className="col"></div>
        <div className="col">
          <div className="form">
            {/* Name */}
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="abc@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label>Role</label>
              <select
                className="form-control"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="">-- Select Role --</option>
                <option value="6">Trainer</option>
                <option value="1">Lab Mentor</option>
                <option value="7">Course Coordinator</option>
              </select>
            </div>

            {/* Course - only visible for CC */}
            {roleId === "7" && (
              <div className="mb-3">
                <label>Course</label>
                <select
                  className="form-control"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.coursename}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Already have account + Register button */}
            <div className="mb-3">
              <div>
                Already have an account? <Link to="/login">Login here</Link>
              </div>
              <button onClick={onRegister} className="btn btn-primary mt-2">
                Register
              </button>
            </div>
          </div>
        </div>
        <div className="col"></div>
      </div>
    </>
  );
}

export default Register;
