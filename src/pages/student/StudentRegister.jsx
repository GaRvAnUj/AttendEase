import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { registerStudent } from "../../api/api";

export default function StudentRegister() {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    department: "",
    year: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.studentId || !form.name || !form.email || !form.department || !form.year || !form.password) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+20\d{2}@vitstudent\.ac\.in$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email must be in format: firstname.lastname20XX@vitstudent.ac.in");
      return;
    }

    const studentIdRegex = /^\d{2}[A-Z]{3}\d{4}$/;
    if (!studentIdRegex.test(form.studentId)) {
      toast.error("Invalid Student ID ");
      return;
    }

    setLoading(true);
    try {
      await registerStudent(form);
      toast.success("Registration successful!");
      navigate("/student/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
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
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
            }}
          >
            <UserPlus size={28} />
          </div>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Register as a new student</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Student ID *</label>
            <input
              type="text"
              className="form-input"
              value={form.studentId}
              onChange={(e) => update("studentId", e.target.value.toUpperCase())}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-input"
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
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
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-success btn-block btn-lg" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                Register <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/student/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
