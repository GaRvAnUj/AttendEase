import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  History,
  BookOpen,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { getStudentAttendance } from "../../api/api";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const studentId = sessionStorage.getItem("studentId");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) {
      navigate("/student/login");
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getStudentAttendance(studentId);
      setRecords(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const totalPresent = records.filter((r) => r.status === "Present").length;
  const totalRecords = records.length;
  const percentage = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

  // unique courses
  const courses = [...new Set(records.map((r) => r.courseId))];

  // recent records (last 5)
  const recent = [...records]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1 className="page-title">Welcome back!</h1>
          <p className="page-subtitle">Student ID: {studentId}</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Loading your data...</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Stats */}
          <motion.div className="stats-grid" variants={item}>
            <div className="stat-card">
              <div className="stat-icon indigo">
                <BookOpen size={22} />
              </div>
              <div className="stat-info">
                <h3>{courses.length}</h3>
                <p>Courses</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon emerald">
                <CheckCircle2 size={22} />
              </div>
              <div className="stat-info">
                <h3>{totalPresent}</h3>
                <p>Days Present</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon rose">
                <XCircle size={22} />
              </div>
              <div className="stat-info">
                <h3>{totalRecords - totalPresent}</h3>
                <p>Days Absent</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon cyan">
                <TrendingUp size={22} />
              </div>
              <div className="stat-info">
                <h3>{percentage}%</h3>
                <p>Attendance Rate</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <h2 className="section-title">
              <ClipboardCheck size={18} /> Quick Actions
            </h2>
            <div className="quick-actions">
              <Link to="/student/mark-attendance" className="quick-action">
                <div
                  className="quick-action-icon"
                  style={{
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "#818cf8",
                  }}
                >
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h4>Mark Attendance</h4>
                  <p>Check in for your current class</p>
                </div>
              </Link>

              <Link to="/student/attendance" className="quick-action">
                <div
                  className="quick-action-icon"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34d399",
                  }}
                >
                  <History size={20} />
                </div>
                <div>
                  <h4>View History</h4>
                  <p>Check your attendance records</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item}>
            <h2 className="section-title">
              <Calendar size={18} /> Recent Activity
            </h2>
            <div className="glass-card no-hover">
              {recent.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={40} />
                  <h3>No attendance records yet</h3>
                  <p>Your recent attendance will appear here</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, i) => (
                      <tr key={i}>
                        <td>{r.date}</td>
                        <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                          {r.courseId}
                        </td>
                        <td>
                          <span className={`badge badge-${r.status === "Present" ? "present" : "absent"}`}>
                            {r.status === "Present" ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
