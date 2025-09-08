import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { deleteCourse, getCourses, updateCourse } from '../services/course'

export default function Course() {
  const [courses, setCourses] = useState([])
  const [editingCourse, setEditingCourse] = useState(null)
  const [courseName, setCourseName] = useState('')

  // Fetch backend courses
  const fetchCourses = async () => {
    const result = await getCourses()
    if (result.status === 'success') setCourses(result.data)
    else toast.error(result.error || 'Failed to fetch courses')
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // Edit course
  const handleEdit = (course) => {
    setEditingCourse(course)
    setCourseName(course.coursename)
  }

  const handleUpdate = async () => {
    if (!courseName.trim()) return toast.warn('Enter course name')
    const result = await updateCourse(editingCourse.course_id, courseName)
    if (result.status === 'success') {
      toast.success('Course updated')
      setEditingCourse(null)
      setCourseName('')
      fetchCourses()
    } else toast.error(result.error || 'Update failed')
  }

  // Delete course
  const handleDelete = async (course_id) => {
    if (!window.confirm('Are you sure?')) return
    const result = await deleteCourse(course_id)
    if (result.status === 'success') {
      toast.success('Course deleted')
      fetchCourses()
    } else toast.error(result.error || 'Delete failed')
  }

  return (
    <div>
      <h2>Course List</h2>

      {editingCourse && (
        <div className="mb-3">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="form-control mb-2"
          />
          <button onClick={handleUpdate} className="btn btn-success me-2">Update</button>
          <button onClick={() => { setEditingCourse(null); setCourseName('') }} className="btn btn-secondary">Cancel</button>
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Extra Col 1</th>
            <th>Extra Col 2</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.course_id}>
              <td>{course.course_id}</td>
              <td>{course.coursename}</td>
              <td>{course.extra_col1 || '-'}</td>
              <td>{course.extra_col || '-'}</td>
              <td>
                <button onClick={() => handleEdit(course)} className="btn btn-warning btn-sm me-2">Edit</button>
                <button onClick={() => handleDelete(course.course_id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
