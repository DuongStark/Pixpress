import { Navigate, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import EditPage from "./pages/EditPage";
import ExportPage from "./pages/ExportPage";
import ResultPage from "./pages/ResultPage";
import UploadPage from "./pages/UploadPage";

export default function App() {
  return (
    <div className="appShell">
      <AppHeader />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/edit/:imageId" element={<EditPage />} />
          <Route path="/export/:exportId" element={<ExportPage />} />
          <Route path="/result/:jobId" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppFooter />
      <SpeedInsights />
    </div>
  );
}
