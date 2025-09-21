// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("");

//   useEffect(() => {
//     const rolename = sessionStorage.getItem("rolename");
//     if (rolename) setRole(rolename.toLowerCase());
//   }, []);

//   const onLogout = () => {
//     sessionStorage.clear();
//     navigate("/");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
//       <div className="container-fluid">
//         <div className="collapse navbar-collapse">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">

//             {/* Role-based Home */}
//             {role === "course coordinator" && (
//               <li className="nav-item">
//                 <Link className="nav-link" to="/homecc">Home</Link>
//               </li>
//             )}

//             {(role === "trainer" || role === "lab mentor") && (
//               <li className="nav-item">
//                 <Link className="nav-link" to="/homefaculty">Home</Link>
//               </li>
//             )}

//             {/* Only for Course Coordinator */}
//             {role === "course coordinator" && (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/viewstudentfeedback">View Student Feedback</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/addfacultyfeedback">Add Faculty Feedback</Link>
//                 </li>
//               </>
//             )}

//             {/* Change Password - always visible */}
//             <li className="nav-item">
//               <Link className="nav-link" to="/changepassword">Change Password</Link>
//             </li>

//             {/* Logout */}
//             <li className="nav-item">
//               <button
//                 onClick={onLogout}
//                 className="nav-link btn btn-link text-light"
//               >
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;






import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FacultySidebar.css";

function FacultySidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const rolename = sessionStorage.getItem("rolename");
    if (rolename) setRole(rolename.toLowerCase());
  }, []);

  const onLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Faculty Panel</h3>
      </div>
      <ul className="sidebar-menu">
        {/* Role-based Home */}
        {role === "course coordinator" && (
          <li>
            <Link to="/homecc">🏠 Home</Link>
          </li>
        )}
        {(role === "trainer" || role === "lab mentor") && (
          <li>
            <Link to="/homefaculty">🏠 Home</Link>
          </li>
        )}

        {/* Only for Course Coordinator */}
        {role === "course coordinator" && (
          <>
            <li>
              <Link to="/viewstudentfeedback">📊 View Student Feedback</Link>
            </li>
            <li>
              <Link to="/addfacultyfeedback">➕ Add Faculty Feedback</Link>
            </li>
          </>
        )}

        {/* Common for all faculty */}
        <li>
          <Link to="/changepassword">🔑 Change Password</Link>
        </li>

        <li>
          <button onClick={onLogout} className="sidebar-btn">
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default FacultySidebar;

