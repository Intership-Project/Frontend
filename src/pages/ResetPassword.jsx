import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../services/forgotpassword";
import "./ForgotPassword.css";

export default function ResetPassword() {
  const { userType, resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.warn("Enter all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword(userType, resetToken, password);

      if (res.status === "success") {
        toast.success("Password reset successful! Please login.");
        navigate("/login");
      } else {
        toast.error(res.error || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <h2 className="fp-title">Reset Password ({userType})</h2>
        <div className="fp-form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="fp-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="fp-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            className="fp-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="fp-button-group">
          <button className="fp-button fp-submit" onClick={handleReset}>
            Reset Password
          </button>
          <button
            className="fp-button fp-cancel"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
