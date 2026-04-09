import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowRight, Save } from "lucide-react";
import toast from "react-hot-toast";
import { registerFaculty } from "../../api/api";
import PasswordInput from "../../components/PasswordInput";

export default function FacultyRegister() {
  const [form, setForm] = useState({
    facultyId: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateName(field, value) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      const fn = updated.firstName.trim().toLowerCase();
      const ln = updated.lastName.trim().toLowerCase();
      
      if (fn && ln) {
        updated.email = `${fn}.${ln}@vit.ac.in`;
      } else if (fn) {
        updated.email = `${fn}@vit.ac.in`;
      } else {
        updated.email = "";
      }
      
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.facultyId || !form.firstName || !form.email || !form.department || !form.password) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)?@vit\.ac\.in$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email must be firstname.lastname@vit.ac.in or firstname@vit.ac.in");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        facultyId: form.facultyId,
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        department: form.department,
        password: form.password
      };
      await registerFaculty(payload);
      toast.success("Faculty Registration successful! Please log in.");
      navigate("/faculty/login");
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
              background: "var(--gradient-card)",
              color: "var(--accent-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Users size={28} />
          </div>
          <h2>Faculty Registration</h2>
          <p className="auth-subtitle">Create a new faculty account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Faculty ID *</label>
            <input
              type="text"
              className="form-input"
              value={form.facultyId}
              onChange={(e) => update("facultyId", e.target.value.toUpperCase())}
              placeholder="e.g. FAC101"
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                value={form.firstName}
                onChange={(e) => updateName("firstName", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={form.lastName}
                onChange={(e) => updateName("lastName", e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="rahul.kumar@vit.ac.in"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department *</label>
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
              <label className="form-label">Password *</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-lg" 
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <Save size={18} /> Complete Registration <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/faculty/login">Sign in here</Link>
        </div>
      </motion.div>
    </div>
  );
}
