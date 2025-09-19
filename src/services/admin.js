import axios from "axios"
import { createUrl, createError } from "../utilss"

// REGISTER admin
export async function register(name, email, password) {
  try {
    const url = createUrl("admin/register")
    const body = {
      username: name,
      email,
      password,
    }
    const response = await axios.post(url, body)
    return response.data
  } catch (ex) {
    return { status: "error", error: ex.message }
  }
}

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
