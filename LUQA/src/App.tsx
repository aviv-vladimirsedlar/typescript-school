import { Box } from "@gemini/core";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useCurrentUser } from "./features/auth/hooks/useCurrentUser";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import Users from "./pages/UsersPage";

const App: React.FC = () => {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        height="100%"
        width="100%"
        textAlign="center"
        padding="spacing.32"
      >
        Loading...
      </Box>
    );
  }
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute type="protected" />}>
          <Route path="/" element={<Home />} />

          <Route path="/users" element={<Users />} />
        </Route>

        <Route element={<ProtectedRoute type="auth" />}>
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>
        <Route path="/auth/register" element={<ProtectedRoute type="auth" />}>
          <Route path="/auth/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
