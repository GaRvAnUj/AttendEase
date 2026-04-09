# AttendEase 🚀

**AttendEase** is a modern, full-stack attendance management system designed for educational institutions. It provides a seamless experience for both students and faculty, leveraging the power of **AWS Serverless** architecture and a highly interactive **React** frontend.

## 🌟 Features

### For Students
- **Dashboard**: Overview of attendance status and upcoming classes.
- **Mark Attendance**: Mark attendance for ongoing sessions using secure API calls.
- **Attendance History**: Track attendance records across different courses.
- **Timetable**: View personal class schedules.

### For Faculty
- **Faculty Dashboard**: Manage classes and view real-time statistics.
- **Attendance Management**: Open/Close attendance sessions and manually modify records.
- **View Attendance**: Detailed view of student attendance per course and date.
- **Timetable Management**: Create and update the faculty's teaching schedule.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with modern aesthetics
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend (AWS)**: 
  - **AWS Lambda** (Serverless functions)
  - **Amazon API Gateway** (RESTful APIs)
  - **Amazon DynamoDB** (NoSQL Database)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AttendEase.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AttendEase
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your AWS API Gateway endpoint:
   ```env
   VITE_API_BASE_URL=https://your-api-gateway-id.execute-api.your-region.amazonaws.com/prod
   ```

**⚠️ IMPORTANT:** The `.env` file is NOT pushed to GitHub (see `.gitignore`). Keep your API keys and endpoints secure!

### Development
Run the development server:
```bash
npm run dev
```

### Building for Production
Create an optimized production build:
```bash
npm run build
```

## ☁️ Deployment on AWS

### AWS Amplify (Recommended)
1. Connect your GitHub repository to **AWS Amplify Hosting**.
2. Amplify will automatically detect the Vite build settings.
3. Deploy and enjoy continuous integration!

### S3 + CloudFront
1. Build the project: `npm run build`.
2. Upload the `dist/` directory contents to an S3 bucket configured for static website hosting.
3. Set up **Amazon CloudFront** for SSL and handle Single Page Application (SPA) routing (404 redirects to `index.html`).

## � Project Structure
```
src/
├── components/       # Reusable React components
├── pages/           # Page components
│   ├── student/     # Student-related pages
│   └── faculty/     # Faculty-related pages
├── api/             # API integration layer
├── assets/          # Images and static assets
├── App.jsx          # Main App component
└── config.js        # Configuration settings
```

## 🔑 Key Routes

### Student Routes
- `/student/login` - Student login page
- `/student/register` - Student registration
- `/student/dashboard` - Student dashboard
- `/student/mark-attendance` - Mark attendance
- `/student/attendance-history` - View attendance history
- `/student/timetable` - View timetable

### Faculty Routes
- `/faculty/login` - Faculty login page
- `/faculty/register` - Faculty registration
- `/faculty/dashboard` - Faculty dashboard
- `/faculty/view-attendance` - View student attendance
- `/faculty/timetable` - Manage timetable
