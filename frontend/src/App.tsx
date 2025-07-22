import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/signin';
import AdminCreateEventPage from './pages/admin/admin_create_event';
import SignUpPage from './pages/signup';
import UserDashboard from './pages/user/user_dashboard';
import AdminDashboard from './pages/admin/admin_dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/admincreateevent" element={<AdminCreateEventPage />} />
        <Route path="/" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
