import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowRight, IdCard, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { loginFaculty } from "../../api/api";

export default function FacultyLogin() {
  const [facultyId, setFacultyId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!facultyId.trim()) {
      toast.error("Please enter your Faculty ID");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const data = await loginFaculty(facultyId.trim(), password);
      // Store facultyId in session
      sessionStorage.setItem("facultyName", data.facultyId);
      toast.success("Welcome, " + data.facultyId + "!");
      navigate("/faculty/dashboard");
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
          <div
            className="auth-icon"
            style={{
              background: "linear-gradient(135deg, #ec4899, #f43f5e)",
              boxShadow: "0 8px 25px rgba(236, 72, 153, 0.3)",
            }}
          >
            <Users size={28} />
          </div>
          <h2>Faculty Login</h2>
          <p className="auth-subtitle">Sign in with your Faculty ID and password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IdCard size={13} /> Faculty ID
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. FAC001"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Lock size={13} /> Password
              </span>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-block btn-lg"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #ec4899, #f43f5e)",
              color: "white",
              boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
            }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            Don't have an account? <Link to="/faculty/register">Register here</Link>
          </div>
          <div>
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
