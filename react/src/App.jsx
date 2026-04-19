import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TrainerLogin from "./pages/TrainerLogin";
import ClientLogin from "./pages/ClientLogin";
import TrainerDashboard from "./pages/TrainerDashboard";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={<Navigate to="/trainer/login" replace />}
            />
            <Route path="/trainer/login" element={<TrainerLogin />} />
            <Route path="/client/login" element={<ClientLogin />} />

            {/* Protected Trainer Routes */}
            <Route
              path="/trainer/dashboard"
              element={
                <ProtectedRoute requireRole="trainer">
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Client Routes */}
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute requireRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
