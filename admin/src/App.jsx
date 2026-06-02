import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div className="min-h-screen bg-surface text-white">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
