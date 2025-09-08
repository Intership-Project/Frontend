import axios from 'axios'
import { createUrl } from './utils'

// Get token from sessionStorage
const getToken = () => sessionStorage.getItem('token')

// GET all courses
export const getCourses = async () => {
  try {
    const res = await axios.get(createUrl('course'), {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return res.data
  } catch (err) {
    return { status: 'error', error: err.response?.data?.error || err.message }
  }
}

// CREATE a new course
export const createCourse = async (coursename) => {
  try {
    const res = await axios.post(
      createUrl('course'),
      { coursename },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    )
    return res.data
  } catch (err) {
    return { status: 'error', error: err.response?.data?.error || err.message }
  }
}

// UPDATE course
export const updateCourse = async (course_id, coursename) => {
  try {
    const res = await axios.put(
      createUrl(`course/${course_id}`),
      { coursename },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    )
    return res.data
  } catch (err) {
    return { status: 'error', error: err.response?.data?.error || err.message }
  }
}

// DELETE course
export const deleteCourse = async (course_id) => {
  try {
    const res = await axios.delete(createUrl(`course/${course_id}`), {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return res.data
  } catch (err) {
    return { status: 'error', error: err.response?.data?.error || err.message }
  }
}
