import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/dashboard/overview" element={<h1>Overview</h1>} />
        <Route path="/dashboard/settings" element={<h1>Settings</h1>} />
        <Route path="/chat/:repoId" element={<h1>Chat</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;