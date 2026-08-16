import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "@/lib/api";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import People from "@/pages/People";
import Donations from "@/pages/Donations";
import Campaigns from "@/pages/Campaigns";
import Projects from "@/pages/Projects";
import Courses from "@/pages/Courses";
import Cohorts from "@/pages/Cohorts";
import CohortDetail from "@/pages/CohortDetail";
import Attendance from "@/pages/Attendance";
import Certificates from "@/pages/Certificates";
import Cms from "@/pages/Cms";
import Crm from "@/pages/Crm";
import Roles from "@/pages/Roles";
import Audit from "@/pages/Audit";
import Settings from "@/pages/Settings";

function Protected({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/people" element={<Protected><People /></Protected>} />
        <Route path="/donations" element={<Protected><Donations /></Protected>} />
        <Route path="/campaigns" element={<Protected><Campaigns /></Protected>} />
        <Route path="/projects" element={<Protected><Projects /></Protected>} />
        <Route path="/lms/courses" element={<Protected><Courses /></Protected>} />
        <Route path="/lms/cohorts" element={<Protected><Cohorts /></Protected>} />
        <Route path="/lms/cohorts/:id" element={<Protected><CohortDetail /></Protected>} />
        <Route path="/lms/attendance" element={<Protected><Attendance /></Protected>} />
        <Route path="/certificates" element={<Protected><Certificates /></Protected>} />
        <Route path="/cms" element={<Protected><Cms /></Protected>} />
        <Route path="/crm" element={<Protected><Crm /></Protected>} />
        <Route path="/roles" element={<Protected><Roles /></Protected>} />
        <Route path="/audit" element={<Protected><Audit /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
