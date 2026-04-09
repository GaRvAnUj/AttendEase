import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, GraduationCap, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isStudent = path.startsWith("/student");
  const isFaculty = path.startsWith("/faculty");
  const isLanding = path === "/";

  const studentId = sessionStorage.getItem("studentId");
  const facultyName = sessionStorage.getItem("facultyName");

  function handleLogout() {
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">
          <GraduationCap size={18} />
        </span>
        AttendEase
      </Link>

      <div className="navbar-actions">
        <button 
          className="btn btn-ghost" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ padding: '0.4rem', borderRadius: '50%' }}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {isStudent && studentId && (
          <>
            <Link
              to="/student/dashboard"
              className={`nav-link ${path === "/student/dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to="/student/mark-attendance"
              className={`nav-link ${path === "/student/mark-attendance" ? "active" : ""}`}
            >
              Mark
            </Link>
            <Link
              to="/student/timetable"
              className={`nav-link ${path === "/student/timetable" ? "active" : ""}`}
            >
              Timetable
            </Link>
            <Link
              to="/student/attendance"
              className={`nav-link ${path === "/student/attendance" ? "active" : ""}`}
            >
              History
            </Link>
            <button className="btn btn-ghost" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </>
        )}

        {isFaculty && facultyName && (
          <>
            <Link
              to="/faculty/dashboard"
              className={`nav-link ${path === "/faculty/dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to="/faculty/timetable"
              className={`nav-link ${path === "/faculty/timetable" ? "active" : ""}`}
            >
              Timetable
            </Link>
            <Link
              to="/faculty/view-attendance"
              className={`nav-link ${path === "/faculty/view-attendance" ? "active" : ""}`}
            >
              Attendance
            </Link>
            <button className="btn btn-ghost" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </>
        )}

        {isLanding && (
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Powered by AWS
          </span>
        )}
      </div>
    </nav>
  );
}
