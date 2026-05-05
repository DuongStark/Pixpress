import { Navigate, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import EditPage from "./pages/EditPage";
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
          <Route path="/result/:jobId" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
