// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobSchedulingSimulator from './pages/JobSchedulingSimulator';

import './styles/scrollbar.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/jobSchedulingSimulator" element={<JobSchedulingSimulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
