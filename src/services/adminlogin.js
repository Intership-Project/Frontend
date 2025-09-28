import axios from "axios"
import { createUrl, createError } from "../utils"



// LOGIN admin
export async function login(email, password) {
  try {
    const url = createUrl("admin/login")
    const body = {
      email,
      password,
    }
    const response = await axios.post(url, body)
    return response.data
  } catch (ex) {
    return { status: "error", error: ex.message }
  }
}
