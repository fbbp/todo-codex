import { Link } from 'react-router-dom';
import { useUI } from '../store/useUI';

export function Navbar() {
  const open = useUI((s) => s.menuOpen);
  const toggle = useUI((s) => s.toggleMenu);

  return (
    <header className="flex items-center justify-between p-4 shadow">
      <button type="button" onClick={toggle} className="md:hidden focus-ring">
        Menu
      </button>
      <nav className={`${open ? 'block' : 'hidden'} md:flex gap-4`}>
        <Link to="/" className="focus-ring">
          Home
        </Link>
        <Link to="/all" className="focus-ring">
          All
        </Link>
        <Link to="/categories" className="focus-ring">
          Categories
        </Link>
        <Link to="/settings" className="focus-ring">
          Settings
        </Link>
      </nav>
    </header>
  );
}
