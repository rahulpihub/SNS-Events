import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminSignInPage from './pages/admin/admin_signin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/adminsignin" element={<AdminSignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
