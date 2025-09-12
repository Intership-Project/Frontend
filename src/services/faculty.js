import axios from "axios";
import { createUrl, createError } from "../utils";

export async function register(name, email, password, roleId, courseId = null) {
    try {
        const url = createUrl('faculty/register')
        const body = {
            facultyname: name,
            email,
            password,
            role_id: roleId,
        }

        if (roleId == 3 && courseId) {
            body.course_id = courseId
        }
        const response = await axios.post(url, body)
        return response.data

    } catch (ex) {
        return { status: 'error', error: ex.message }
    }
}


// LOGIN Faculty
export async function login(email, password, courseId = null) {
    try {
        const url = createUrl('faculty/login')
        const body = {

            email,
            password

        }

        if (courseId) {
            body.course_id = courseId; 
        }



        const response = await axios.post(url, body)
        return response.data

    } catch (ex) {
        return { status: 'error', error: ex.message }
    }
}




// Change faculty password
export async function changeFacultyPassword(oldPassword, newPassword) {
    try {
        const url = createUrl('faculty/changepassword')
        const body = { oldPassword, newPassword }

        // Include JWT token in headers
        const token = sessionStorage.getItem('token') // must store JWT at login
        const headers = {
            token: token, // backend reads token from headers.token
        }

        const response = await axios.put(url, body, { headers })
        return response.data
    } catch (ex) {
        return { status: 'error', error: ex.response?.data?.error || ex.message }
    }
}
