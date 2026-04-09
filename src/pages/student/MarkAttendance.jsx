import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardCheck, Send, Clock, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { markAttendance } from "../../api/api";

export default function MarkAttendance() {
  const navigate = useNavigate();
  const studentId = sessionStorage.getItem("studentId");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!studentId) {
      navigate("/student/login");
      return;
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!courseId.trim()) {
      toast.error("Please enter the Course ID");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = now.toTimeString().split(" ")[0].slice(0, 5); // HH:MM

      await markAttendance({
        studentId,
        courseId: courseId.trim(),
        date,
        time,
      });

      setSuccess(true);
      toast.success("Attendance marked successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  }

  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");

  if (success) {
    return (
      <div className="page-container">
        <motion.div
          className="success-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ minHeight: "60vh" }}
        >
          <div className="success-icon">
            <ClipboardCheck size={36} color="white" />
          </div>
          <h2>Attendance Marked!</h2>
          <p>Your attendance for <strong>{courseId}</strong> has been recorded.</p>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
            Checked in at {hours}:{minutes}
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSuccess(false);
                setCourseId("");
              }}
            >
              Mark Another
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/student/dashboard")}
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-subtitle">Check in for your current class session</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: "800px" }}>
        {/* Clock Card */}
        <motion.div
          className="glass-card no-hover"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-md)",
              background: "rgba(6, 182, 212, 0.15)",
              color: "#22d3ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <Clock size={24} />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Current Time
          </p>
          <p
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            {hours}:{minutes}
            <span style={{ fontSize: "1.5rem", opacity: 0.6 }}>:{seconds}</span>
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Mark Form */}
        <motion.div
          className="glass-card no-hover"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "var(--radius-sm)",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Course Check-in</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Enter the course ID shared by your faculty
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Course ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CS101"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                className="form-input"
                value={studentId}
                disabled
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <Send size={18} /> Mark Present
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Info box */}
      <motion.div
        className="glass-card no-hover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ maxWidth: "800px", marginTop: "1.5rem" }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-sm)",
              background: "rgba(245, 158, 11, 0.15)",
              color: "#fbbf24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              Time Window
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              You can only mark attendance when your faculty has opened a session.
              Make sure to check in within the allowed time window (usually 15 minutes).
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
