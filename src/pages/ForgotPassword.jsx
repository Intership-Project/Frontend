import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../services/forgotpassword";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const { userType } = useParams(); // "faculty" or "admin"
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warn("Enter your registered email");
      return;
    }

    try {
      const res = await forgotPassword(userType, email);

      if (res.status === "success") {
        const { resetToken } = res.data;
        toast.success("Reset link sent! Redirecting to reset page...");
        // Navigate to reset page with token
        navigate(`/resetpassword/${userType}/${resetToken}`);
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <h2 className="fp-title">Forgot Password ({userType})</h2>
        <form onSubmit={handleSubmit}>
          <div className="fp-form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="fp-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="fp-button-group">
            <button type="submit" className="fp-button fp-submit">
              Send Reset Link
            </button>
            <button
              type="button"
              className="fp-button fp-cancel"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
