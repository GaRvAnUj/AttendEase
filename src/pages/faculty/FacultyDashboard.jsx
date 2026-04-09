import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Eye,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { openSession } from "../../api/api";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const facultyName = sessionStorage.getItem("facultyName");

  const [courseId, setCourseId] = useState("");
  const [duration, setDuration] = useState("15");
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!facultyName) {
      navigate("/faculty/login");
      return;
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleStartSession(e) {
    e.preventDefault();
    if (!courseId.trim()) {
      toast.error("Please enter a Course ID");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const startH = now.getHours().toString().padStart(2, "0");
      const startM = now.getMinutes().toString().padStart(2, "0");
      const startTime = `${startH}:${startM}`;

      // Calculate end time
      const endDate = new Date(now.getTime() + parseInt(duration) * 60000);
      const endH = endDate.getHours().toString().padStart(2, "0");
      const endM = endDate.getMinutes().toString().padStart(2, "0");
      const endTime = `${endH}:${endM}`;

      const sessionId = `SES-${Date.now()}`;

      await openSession({
        sessionId,
        courseId: courseId.trim(),
        date,
        startTime,
        endTime,
      });

      setActiveSession({
        sessionId,
        courseId: courseId.trim(),
        date,
        startTime,
        endTime,
      });

      toast.success("Session started! Students can now mark attendance.");
    } catch (err) {
      toast.error(err.message || "Failed to open session");
    } finally {
      setLoading(false);
    }
  }

  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1 className="page-title">Faculty Dashboard</h1>
          <p className="page-subtitle">Welcome, {facultyName}</p>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show">
        {/* Top row: Clock + Quick Actions */}
        <motion.div
          variants={item}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}
        >
          {/* Clock */}
          <div className="glass-card no-hover" style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "rgba(236, 72, 153, 0.15)",
                color: "#f472b6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <Clock size={22} />
            </div>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                background: "linear-gradient(135deg, #ec4899, #f43f5e)",
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
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link to="/faculty/view-attendance" className="quick-action" style={{ flex: 1 }}>
              <div
                className="quick-action-icon"
                style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}
              >
                <Eye size={20} />
              </div>
              <div>
                <h4>View Attendance</h4>
                <p>See who's present & modify records</p>
              </div>
            </Link>

            <div className="quick-action" style={{ flex: 1, cursor: "default" }}>
              <div
                className="quick-action-icon"
                style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}
              >
                <Calendar size={20} />
              </div>
              <div>
                <h4>{currentTime.toISOString().split("T")[0]}</h4>
                <p>Today's date</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Session Banner */}
        {activeSession && (
          <motion.div
            variants={item}
            className="glass-card no-hover"
            style={{
              marginBottom: "1.5rem",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              background: "rgba(16, 185, 129, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                <Zap size={22} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  Session Active
                  <span className="badge badge-active">LIVE</span>
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  <strong>{activeSession.courseId}</strong> — {activeSession.startTime} to {activeSession.endTime}
                </p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/faculty/view-attendance")}
              >
                <Eye size={14} /> View
              </button>
            </div>
          </motion.div>
        )}

        {/* Start Session Form */}
        <motion.div variants={item}>
          <h2 className="section-title">
            <Play size={18} /> Start Attendance Session
          </h2>
          <div className="glass-card no-hover" style={{ maxWidth: "600px" }}>
            <form onSubmit={handleStartSession}>
              <div className="form-group">
                <label className="form-label">Course ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CS101"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <select
                  className="form-input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-block btn-lg"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                }}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <Play size={18} /> Start Session
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
