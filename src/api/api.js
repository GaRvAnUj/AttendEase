import { API_BASE } from "../config";

// Student APIs
export async function loginStudent(studentId, password) {
  const res = await fetch(`${API_BASE}/loginStudent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || data);
  return data;
}

export async function registerStudent(studentData) {
  const res = await fetch(`${API_BASE}/registerStudent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

export async function markAttendance({ studentId, courseId, date, time }) {
  const res = await fetch(`${API_BASE}/markAttendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, courseId, date, time }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

export async function getStudentAttendance(studentId) {
  const res = await fetch(`${API_BASE}/getStudentAttendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

// Faculty APIs
export async function loginFaculty(facultyId, password) {
  const res = await fetch(`${API_BASE}/loginFaculty`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ facultyId, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(typeof data === "string" ? data : data.message || "Login failed");
  return data;
}

export async function registerFaculty(facultyData) {
  const res = await fetch(`${API_BASE}/registerFaculty`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(facultyData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}


export async function openSession({ sessionId, courseId, date, startTime, endTime }) {
  const res = await fetch(`${API_BASE}/openSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, courseId, date, startTime, endTime }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

export async function getAttendance({ courseId, date }) {
  const res = await fetch(`${API_BASE}/getAttendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, date }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

export async function modifyAttendance({ studentId, courseId, date, action }) {
  const res = await fetch(`${API_BASE}/modifyAttendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, courseId, date, action }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

export async function getTimetable(facultyId) {
  const res = await fetch(`${API_BASE}/getTimetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ facultyId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

export async function addTimetableEntry(entryData) {
  const res = await fetch(`${API_BASE}/addTimetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

export async function getStudentTimetable(studentId) {
  const res = await fetch(`${API_BASE}/getStudentTimetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}
