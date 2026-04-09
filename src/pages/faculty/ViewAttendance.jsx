import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  Calendar,
  BookOpen,
  UserCheck,
  UserX,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAttendance, modifyAttendance } from "../../api/api";

function getISTDateInputValue() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const map = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return `${map.year}-${map.month}-${map.day}`;
}

export default function ViewAttendance() {
  const navigate = useNavigate();
  const facultyName = sessionStorage.getItem("facultyName");

  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(() => getISTDateInputValue());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [modifyingId, setModifyingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!facultyName) {
      navigate("/faculty/login");
    }
  }, []);

  async function handleFetch(e) {
    if (e) e.preventDefault();
    const normalizedCourseId = courseId.trim().toUpperCase();

    if (!normalizedCourseId) {
      toast.error("Please enter a Course ID");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const data = await getAttendance({ courseId: normalizedCourseId, date });
      setRecords(data);
      setFetched(true);
      toast.success(`Found ${data.length} student(s)`);
    } catch (err) {
      toast.error(err.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  }

  async function handleModify(studentId, action) {
    setModifyingId(studentId);
    try {
      await modifyAttendance({
        studentId,
        courseId: courseId.trim().toUpperCase(),
        date,
        action,
      });

      // Update local state
      setRecords((prev) =>
        prev.map((r) =>
          r.studentId === studentId
            ? { ...r, status: action === "present" ? "Present" : "Absent" }
            : r
        )
      );

      toast.success(
        `${studentId} marked as ${action === "present" ? "Present" : "Absent"}`
      );
    } catch (err) {
      toast.error(err.message || "Failed to modify attendance");
    } finally {
      setModifyingId(null);
    }
  }

  // Filter
  const filtered = records.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.studentId.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q)
    );
  });

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.length - presentCount;

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1 className="page-title">View & Manage Attendance</h1>
          <p className="page-subtitle">
            View student attendance and modify records as needed
          </p>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        className="glass-card no-hover"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ maxWidth: "700px", marginBottom: "1.5rem" }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Search size={18} /> Lookup Attendance
        </h3>
        <form onSubmit={handleFetch}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Course ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CS101"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value.toUpperCase())}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <Eye size={18} /> Fetch Attendance
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Results */}
      {fetched && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats Bar */}
          <div className="stats-grid" style={{ maxWidth: "700px" }}>
            <div className="stat-card">
              <div className="stat-icon indigo">
                <Users size={22} />
              </div>
              <div className="stat-info">
                <h3>{records.length}</h3>
                <p>Total Students</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon emerald">
                <UserCheck size={22} />
              </div>
              <div className="stat-info">
                <h3>{presentCount}</h3>
                <p>Present</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon rose">
                <UserX size={22} />
              </div>
              <div className="stat-info">
                <h3>{absentCount}</h3>
                <p>Absent</p>
              </div>
            </div>
          </div>

          {/* Search + Refresh */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search by ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "2.25rem" }}
              />
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleFetch}
              disabled={loading}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Table */}
          <div className="glass-card no-hover">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <Users size={40} />
                <h3>No students found</h3>
                <p>No students match your search query</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.studentId}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {r.studentId}
                      </td>
                      <td>{r.name}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            r.status === "Present" ? "present" : "absent"
                          }`}
                        >
                          {r.status === "Present" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {modifyingId === r.studentId ? (
                          <span className="spinner" style={{ width: 16, height: 16 }} />
                        ) : r.status === "Present" ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleModify(r.studentId, "absent")}
                          >
                            <XCircle size={14} /> Mark Absent
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleModify(r.studentId, "present")}
                          >
                            <CheckCircle2 size={14} /> Mark Present
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
