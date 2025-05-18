import { Link } from 'react-router-dom';
import { useUI } from '../store/useUI';

export function Navbar() {
  const open = useUI((s) => s.menuOpen);
  const toggle = useUI((s) => s.toggleMenu);

  return (
    <header className="flex items-center justify-between p-4 shadow">
      <button type="button" onClick={toggle} className="md:hidden">
        Menu
      </button>
      <nav className={`${open ? 'block' : 'hidden'} md:flex gap-4`}>
        <Link to="/">Home</Link>
        <Link to="/all">All</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </header>
  );
}
