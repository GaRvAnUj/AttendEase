import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import MarkAttendance from "./pages/student/MarkAttendance";
import AttendanceHistory from "./pages/student/AttendanceHistory";
import StudentTimetable from "./pages/student/StudentTimetable";
import FacultyLogin from "./pages/faculty/FacultyLogin";
import FacultyRegister from "./pages/faculty/FacultyRegister";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ViewAttendance from "./pages/faculty/ViewAttendance";
import Timetable from "./pages/faculty/Timetable";

function App() {
  return (
    <BrowserRouter>
      <div className="app-bg" />
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/mark-attendance" element={<MarkAttendance />} />
        <Route path="/student/attendance" element={<AttendanceHistory />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />

        {/* Faculty Routes */}
        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty/register" element={<FacultyRegister />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/timetable" element={<Timetable />} />
        <Route path="/faculty/view-attendance" element={<ViewAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
