import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Overview from "./pages/Dashboard/Overview";
import Settings from "./pages/Dashboard/Settings";
import Chat from "./pages/Chat/Chat";
import AuthCallback from "./pages/Auth/AuthCallback";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/auth/callback"
        element={<AuthCallback />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/dashboard/overview"
        element={<Overview />}
      />

      <Route
        path="/dashboard/settings"
        element={<Settings />}
      />

      <Route
        path="/chat/:repoId"
        element={<Chat />}
      />
    </Routes>
  );
}

export default App;