import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useCurrentUser } from './common/hooks/useCurrentUser';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Movies from './pages/Movies';
import ProtectedRoute from './pages/ProtectedRoute';

const App: React.FC = () => {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return <div className="align-center flex h-screen w-screen justify-center">Loading...</div>;
  }
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute type="protected" />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
        </Route>

        <Route element={<ProtectedRoute type="auth" />}>
          <Route path="/auth/login" element={<Login />} />
        </Route>
        <Route path="/auth/register" element={<ProtectedRoute type="auth" />}>
          <Route path="/auth/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
