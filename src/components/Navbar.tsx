import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="font-bold text-2xl">Learning Hub</h1>
      <div className="space-x-6">
        <Link className="hover:text-gray-200" to="/">Home</Link>
        <Link className="hover:text-gray-200" to="/catalog">Catalog</Link>
        <Link className="hover:text-gray-200" to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}
