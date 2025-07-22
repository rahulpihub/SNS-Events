import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminSignInPage from './pages/admin/admin_signin';
import AdminCreateEventPage from './pages/admin/admin_create_event';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/adminsignin" element={<AdminSignInPage />} />
        <Route path="/admincreateevent" element={<AdminCreateEventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
