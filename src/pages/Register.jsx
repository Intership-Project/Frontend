import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { register as facultyRegister } from "../services/faculty"
import { register as adminRegister } from "../services/admin"

export function Register() {
  const [userType, setUserType] = useState("faculty") // faculty or admin
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")
  const [courseId, setCourseId] = useState("")

  const navigate = useNavigate()

  const onRegister = async () => {
    if (!name.trim()) {
      toast.warn("Enter name")
      return
    }
    if (!email.trim()) {
      toast.warn("Enter email")
      return
    }
    if (!password.trim()) {
      toast.warn("Enter password")
      return
    }

    if (userType === "faculty") {
      if (!roleId) {
        toast.warn("Select role")
        return
      }
      if (roleId === "3" && !courseId) {
        toast.warn("Select course for Course Coordinator")
        return
      }
    }

    try {
      let result
      if (userType === "faculty") {
        result = await facultyRegister(name, email, password, roleId, courseId)
      } else {
        result = await adminRegister(name, email, password)
      }

      console.log("API result:", result)

      if (result.status === "success") {
        toast.success("Successfully registered")
        navigate("/")
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (err) {
      toast.error(err.message || "Error occurred")
    }
  }

  return (
    <>
      <h1 className="title">Register</h1>

      <div className="row">
        <div className="col"></div>
        <div className="col">
          <div className="form">

            {/* User Type */}
            <div className="mb-3">
              <label>User Type</label>
              <select
                className="form-control"
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value)
                  setRoleId("")
                  setCourseId("")
                }}
              >
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
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

            {/* Role → Only for faculty */}
            {userType === "faculty" && (
              <div className="mb-3">
                <label>Role</label>
                <select
                  className="form-control"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value="">-- Select Role --</option>
                  <option value="1">Trainer</option>
                  <option value="2">Lab Mentor</option>
                  <option value="3">Course Coordinator</option>
                </select>
              </div>
            )}

            {/* Course → Only for Course Coordinator */}
            {userType === "faculty" && roleId === "3" && (
              <div className="mb-3">
                <label>Course</label>
                <select
                  className="form-control"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  <option value="1">DMC 2024</option>
                  <option value="2">DAC 2024</option>
                  <option value="3">DBDA 2024</option>
                  <option value="4">DESD 2024</option>
                </select>
              </div>
            )}

            {/* Register Button */}
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
  )
}

export default Register
