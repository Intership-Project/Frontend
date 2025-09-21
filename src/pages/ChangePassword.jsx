import React, { useState } from 'react'
import FacultySidebar from "../components/FacultySidebar";
import "../components/FacultySidebar.css"; 
import { changeFacultyPassword } from '../services/facultylogin';
import { toast } from 'react-toastify'
import './ChangePassword.css'


function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onChangePassword = async () => {
    if (oldPassword.length === 0) {
      toast.warn('Please enter old password')
    } else if (newPassword.length === 0) {
      toast.warn('Please enter new password')
    } else if (confirmPassword.length === 0) {
      toast.warn('Please confirm new password')
    } else if (newPassword !== confirmPassword) {
      toast.warn('New password and confirm password do not match')
    } else {
      const result = await changeFacultyPassword(oldPassword, newPassword)
      if (result['status'] === 'success') {
        toast.success(result['data']) // "Password changed successfully"
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(result['error'])
      }
    }
  }

  return (
    <>
      <FacultySidebar />
      <div className="change-password-container">
        <h2 className="page-header">Change Password</h2>
        <div className="row mb-3">
          <div className="col">
            <label>Old Password:</label>
            <input
              type="password"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>New Password:</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <button onClick={onChangePassword} className="btn btn-primary">
              Change Password
            </button>
          </div>
        </div>
      </div>


    </>
  )
}


export default ChangePassword
