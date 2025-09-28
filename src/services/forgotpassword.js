import axios from "axios";
import { createUrl, createError } from "../utils";



// Send reset token to user (faculty/admin)
export async function forgotPassword(userType, email) {
  try {
    const res = await axios.post(createUrl(`${userType}/forgotpassword`), { email });
    console.log("Forgot password response:", res.data);
    return res.data; // { status: "success", data: { resetToken } }
  } catch (err) {
    console.error("Forgot password error:", err);
    return createError(err.response?.data?.error || err.message);
  }
}

// Reset password using resetToken
export async function resetPassword(userType, resetToken, newPassword) {
  try {
    const res = await axios.post(createUrl(`${userType}/resetpassword`), {
      resetToken,   // Must match backend
      newPassword,  // Must match backend
    });
    console.log("Reset password response:", res.data);
    return res.data; // { status: "success" }
  } catch (err) {
    console.error("Reset password error:", err);
    return createError(err.response?.data?.error || err.message);
  }
}
