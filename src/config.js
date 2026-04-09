// AWS API Gateway Base URL
// Read from environment variable for security - do not hardcode URLs in production
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.MODE === "production") {
  console.warn(
    "Warning: VITE_API_BASE_URL environment variable is not set. This may cause API calls to fail."
  );
}
