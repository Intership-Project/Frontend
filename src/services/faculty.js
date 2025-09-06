import axios from "axios";
import { createUrl, createError } from "./utils";

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
            body.course_id = courseId; //match backend expectation
        }



        const response = await axios.post(url, body)
        return response.data

    } catch (ex) {
        return { status: 'error', error: ex.message }
    }
}