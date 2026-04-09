import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { loginStudent } from "../../api/api";
import PasswordInput from "../../components/PasswordInput";

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!studentId.trim() || !password.trim()) {
      toast.error("Please enter Student ID and Password");
      return;
    }

    setLoading(true);
    try {
      await loginStudent(studentId.trim(), password);
      sessionStorage.setItem("studentId", studentId.trim());
      toast.success("Login successful!");
      navigate("/student/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <motion.div
        className="glass-card auth-card"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <div className="auth-icon">
            <GraduationCap size={28} />
          </div>
          <h2>Student Login</h2>
          <p className="auth-subtitle">Enter your Student ID to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input
              type="text"
              className="form-input"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/student/register">Register here</Link>
        </div>
      </motion.div>
    </div>
  );
}
