import axios from "axios";
import { createUrl, createError } from "../utils";

// Fetch files assigned to logged-in faculty
export async function fetchAssignedFiles() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return createError("Token missing");

    const res = await axios.get(createUrl("faculty/faculty-feedback"), {
      headers: { token },
    });

    if (res.data.status === "success") 
      return { status: "success", data: res.data.data };

    return createError(res.data.error || "Failed to fetch files");
  } catch (ex) {
    return createError(ex.response?.data?.error || ex.message);
  }
}
