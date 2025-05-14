// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/" className="text-xl font-bold">AlgoTracer</Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
