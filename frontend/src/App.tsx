import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestBackend from './pages/TestBackend';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<TestBackend />} />
      </Routes>
    </Router>
  );
}

export default App;
