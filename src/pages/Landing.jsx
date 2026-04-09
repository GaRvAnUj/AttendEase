import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Landing() {
  return (
    <div className="landing-container">
      <motion.div
        className="landing-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          Smart <span className="gradient-text">Attendance</span>
          <br />
          Management
        </h1>
        
      </motion.div>

      <motion.div
        className="landing-roles"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Link to="/student/login" className="action-card">
            <div className="action-card-icon">
              <GraduationCap size={32} />
            </div>
            <h3>I'm a Student</h3>
            <p>Mark attendance, view history, and track your records</p>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link to="/faculty/login" className="action-card">
            <div
              className="action-card-icon"
              style={{
                background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                boxShadow: "0 8px 25px rgba(236, 72, 153, 0.3)",
              }}
            >
              <Users size={32} />
            </div>
            <h3>I'm Faculty</h3>
            <p>Open sessions, view reports, and manage attendance</p>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
