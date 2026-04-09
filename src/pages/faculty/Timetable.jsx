import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Clock, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getTimetable, addTimetableEntry } from "../../api/api";

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    courseId: "",
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "10:00",
    department: "",
    year: "",
  });

  const facultyId = sessionStorage.getItem("facultyId");

  useEffect(() => {
    fetchTimetable();
  }, []);

  async function fetchTimetable() {
    try {
      setLoading(true);
      const data = await getTimetable(facultyId);
      setTimetable(data.timetable || []);
    } catch (err) {
      toast.error(err.message || "Cannot load timetable. Ensure AWS API is deployed.");
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEntry(e) {
    e.preventDefault();
    if (!newEntry.courseId || !newEntry.startTime || !newEntry.endTime || !newEntry.department || !newEntry.year) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const payload = { ...newEntry, facultyId };
      await addTimetableEntry(payload);
      toast.success("Timetable entry added!");
      setAdding(false);
      fetchTimetable();
    } catch (err) {
      toast.error(err.message || "Failed to add entry");
    }
  }

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-info">
          <Calendar className="header-icon" />
          <div>
            <h1>My Timetable</h1>
            <p>Manage your weekly class schedule</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setAdding(!adding)}>
          <Plus size={18} /> Add Class
        </button>
      </motion.div>

      {adding && (
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginBottom: "2rem" }}
        >
          <h3 style={{ marginBottom: "1rem", color: "var(--text-accent)" }}>New Class Schedule</h3>
          <form onSubmit={handleAddEntry} style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div className="form-group">
              <label className="form-label">Course ID</label>
              <input
                type="text"
                className="form-input"
                value={newEntry.courseId}
                onChange={(e) => setNewEntry({ ...newEntry, courseId: e.target.value.toUpperCase() })}
                placeholder="e.g. CSE101"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-input"
                value={newEntry.department}
                onChange={(e) => setNewEntry({ ...newEntry, department: e.target.value })}
              >
                <option value="">Select Dept</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                className="form-input"
                value={newEntry.year}
                onChange={(e) => setNewEntry({ ...newEntry, year: e.target.value })}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Day of Week</label>
              <select
                className="form-input"
                value={newEntry.dayOfWeek}
                onChange={(e) => setNewEntry({ ...newEntry, dayOfWeek: e.target.value })}
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-input"
                value={newEntry.startTime}
                onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-input"
                value={newEntry.endTime}
                onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="btn btn-success" style={{ width: "100%" }}>
                <Save size={18} style={{ marginRight: "0.5rem" }} /> Save Class
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <span className="spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
        </div>
      ) : timetable.length === 0 ? (
        <div className="empty-state glass-card">
          <Clock size={48} className="empty-icon" />
          <h3>No Classes Scheduled</h3>
          <p>You haven't added any classes to your timetable yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {timetable.map((entry, idx) => (
            <motion.div
              key={idx}
              className="glass-card"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div>
                <h3 style={{ color: "var(--text-accent)", marginBottom: "0.25rem" }}>
                  {entry.courseId}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {entry.dayOfWeek} • {entry.startTime} - {entry.endTime} • {entry.department} Year {entry.year}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
