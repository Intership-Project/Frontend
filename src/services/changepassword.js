import axios from "axios";
import { createUrl, createError } from "../utils";



// Change faculty password
export async function changeFacultyPassword(oldPassword, newPassword) {
    try {
        const url = createUrl('faculty/changepassword')
        const body = { oldPassword, newPassword }

        
        const token = sessionStorage.getItem('token')
        const headers = {
            token: token, 
        }

        const response = await axios.put(url, body, { headers })
        return response.data
    } catch (ex) {
        return { status: 'error', error: ex.response?.data?.error || ex.message }
    }
}



