import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { getStudentTimetable } from "../../api/api";

export default function StudentTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = sessionStorage.getItem("studentId");

  useEffect(() => {
    fetchTimetable();
  }, []);

  async function fetchTimetable() {
    try {
      setLoading(true);
      const data = await getStudentTimetable(studentId);
      // Sort by day of week and start time
      const daysOrder = { "MONDAY": 1, "TUESDAY": 2, "WEDNESDAY": 3, "THURSDAY": 4, "FRIDAY": 5, "SATURDAY": 6, "SUNDAY": 7 };
      const sorted = (data.timetable || []).sort((a, b) => {
        if (daysOrder[a.dayOfWeek] !== daysOrder[b.dayOfWeek]) {
          return daysOrder[a.dayOfWeek] - daysOrder[b.dayOfWeek];
        }
        return a.startTime.localeCompare(b.startTime);
      });
      setTimetable(sorted);
    } catch (err) {
      toast.error(err.message || "Cannot load timetable.");
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

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
            <h1>My Class Timetable</h1>
            <p>View your upcoming subject periods</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-spinner">
          <span className="spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
        </div>
      ) : timetable.length === 0 ? (
        <div className="empty-state glass-card">
          <Clock size={48} className="empty-icon" />
          <h3>No Classes Scheduled</h3>
          <p>Your faculty hasn't added any schedules for your batch yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {timetable.map((entry, idx) => {
            const isToday = entry.dayOfWeek === today;
            return (
              <motion.div
                key={idx}
                className="glass-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.5rem",
                  borderLeft: isToday ? "4px solid var(--accent-primary)" : "none",
                  background: isToday ? "rgba(99, 102, 241, 0.05)" : "var(--glass-bg)"
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
                    <h3 style={{ color: "var(--text-accent)", margin: 0 }}>
                      {entry.courseId}
                    </h3>
                    {isToday && <span className="badge badge-active" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>TODAY</span>}
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0, marginTop: "0.25rem" }}>
                    {entry.dayOfWeek} • {entry.startTime} - {entry.endTime}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                    Faculty ID: {entry.facultyId}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
