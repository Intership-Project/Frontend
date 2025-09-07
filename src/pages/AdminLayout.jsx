
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          background: '#2c3e50',
          padding: '30px 20px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ fontSize: '26px', marginBottom: '30px', textAlign: 'center' }}>Admin Panel</h2>

        <nav style={{ flexGrow: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {/** Dashboard */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/dashboard"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                🏠 <span>Dashboard</span>
              </Link>
            </li>

            {/** Courses */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/courses"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                📚 <span>Courses</span>
              </Link>
            </li>

            {/** Faculty */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/faculty"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                👩‍🏫 <span>Faculty</span>
              </Link>
            </li>

            {/** Batches */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/batches"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                🗂️ <span>Batches</span>
              </Link>
            </li>

            {/** Students */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/students"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                🎓 <span>Students</span>
              </Link>
            </li>

            {/** Subjects */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/subjects"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                📘 <span>Subjects</span>
              </Link>
            </li>

            {/** Schedule Feedback */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/schedule"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                🗓️ <span>Schedule Feedback</span>
              </Link>
            </li>

            {/** Feedback Response */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/feedback"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                📊 <span>Feedback Response</span>
              </Link>
            </li>

            {/** Add Feedback */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/add-feedback"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                📝 <span>Add Feedback</span>
              </Link>
            </li>

            {/** Questions */}
            <li style={{ marginBottom: '20px', fontSize: '20px' }}>
              <Link
                to="/admin/questions"
                style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                ❓ <span>Questions</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: '30px', background: '#f4f6f8' }}>
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
}
