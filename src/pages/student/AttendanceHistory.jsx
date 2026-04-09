import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  History,
  CheckCircle2,
  XCircle,
  Filter,
  Calendar,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { getStudentAttendance } from "../../api/api";

export default function AttendanceHistory() {
  const navigate = useNavigate();
  const studentId = sessionStorage.getItem("studentId");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const courses = [...new Set(records.map((r) => r.courseId))];

  const filtered = records.filter((r) => {
    if (filterCourse && r.courseId !== filterCourse) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPresent = filtered.filter((r) => r.status === "Present").length;
  const totalAbsent = filtered.length - totalPresent;
  const percentage =
    filtered.length > 0 ? Math.round((totalPresent / filtered.length) * 100) : 0;

  // Per-course breakdown
  const courseStats = courses.map((cid) => {
    const courseRecords = records.filter((r) => r.courseId === cid);
    const present = courseRecords.filter((r) => r.status === "Present").length;
    return {
      courseId: cid,
      total: courseRecords.length,
      present,
      percentage: courseRecords.length > 0 ? Math.round((present / courseRecords.length) * 100) : 0,
    };
  });

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1 className="page-title">Attendance History</h1>
          <p className="page-subtitle">Track your attendance across all courses</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Loading attendance records...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-card">
              <div className="stat-icon emerald">
                <CheckCircle2 size={22} />
              </div>
              <div className="stat-info">
                <h3>{totalPresent}</h3>
                <p>Present</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon rose">
                <XCircle size={22} />
              </div>
              <div className="stat-info">
                <h3>{totalAbsent}</h3>
                <p>Absent</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon cyan">
                <TrendingUp size={22} />
              </div>
              <div className="stat-info">
                <h3>{percentage}%</h3>
                <p>Overall Rate</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon indigo">
                <BookOpen size={22} />
              </div>
              <div className="stat-info">
                <h3>{courses.length}</h3>
                <p>Courses</p>
              </div>
            </div>
          </motion.div>

          {/* Course Breakdown */}
          {courseStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ marginBottom: "2rem" }}
            >
              <h2 className="section-title">
                <BookOpen size={18} /> Course Breakdown
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
                {courseStats.map((cs) => (
                  <div key={cs.courseId} className="glass-card no-hover" style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {cs.courseId}
                      </h4>
                      <span
                        className={`badge ${cs.percentage >= 75 ? "badge-present" : cs.percentage >= 50 ? "badge-active" : "badge-absent"}`}
                      >
                        {cs.percentage}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div
                      style={{
                        height: 6,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 3,
                        overflow: "hidden",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${cs.percentage}%`,
                          background:
                            cs.percentage >= 75
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : cs.percentage >= 50
                              ? "linear-gradient(90deg, #06b6d4, #22d3ee)"
                              : "linear-gradient(90deg, #ef4444, #f87171)",
                          borderRadius: 3,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {cs.present} present out of {cs.total} classes
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <h2 className="section-title">
              <Filter size={18} /> Filter Records
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <select
                className="form-input"
                style={{ width: "auto", minWidth: "180px" }}
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="">All Courses</option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className="form-input"
                style={{ width: "auto", minWidth: "180px" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </motion.div>

          {/* Records Table */}
          <motion.div
            className="glass-card no-hover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {sorted.length === 0 ? (
              <div className="empty-state">
                <History size={40} />
                <h3>No records found</h3>
                <p>
                  {records.length === 0
                    ? "You don't have any attendance records yet"
                    : "No records match the current filters"}
                </p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Calendar size={14} style={{ color: "var(--text-muted)" }} />
                          {r.date}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {r.courseId}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${r.status === "Present" ? "present" : "absent"}`}
                        >
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
          </motion.div>
        </>
      )}
    </div>
  );
}
