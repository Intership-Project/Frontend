import { createUrl } from './utils';

// Courses
export const getCourses = async () => {
  const res = await fetch(createUrl('/course'));
  const data = await res.json();
  return data.status === 'success' ? data.data : [];
};

// Subjects by course
export const getSubjectsByCourse = async (course_id) => {
  const res = await fetch(createUrl(`/subject/course/${course_id}`));
  const data = await res.json();
  return data.status === 'success' ? data.data : [];
};

// Feedback types
export const getFeedbackTypes = async () => {
  const res = await fetch(createUrl('/feedbacktype'));
  const data = await res.json();
  return data.status === 'success' ? data.data : [];
};

// Feedback modules by feedback type
export const getFeedbackModules = async (feedbacktype_id) => {
  const res = await fetch(createUrl(`/feedbackmoduletype/feedbacktype/${feedbacktype_id}`));
  const data = await res.json();
  return data.status === 'success' ? data.data : [];
};

// Faculties by role
export const getFaculties = async (role) => {
  const res = await fetch(createUrl(`/faculty/role/${role}`));
  const data = await res.json();
  return data.status === 'success' ? data.data : [];
};

// Batches by course
export const getBatchesByCourse = async (course_id) => {
  const res = await fetch(createUrl(`/batch/course/${course_id}`));
  const data = await res.json();
  return data.status === 'success' ? data.data : [];
};
