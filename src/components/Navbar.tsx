import { Link } from 'react-router-dom';
import { useUI } from '../store/useUI';

export function Navbar() {
  const open = useUI((s) => s.menuOpen);
  const toggle = useUI((s) => s.toggleMenu);

  return (
    <header className="flex items-center justify-between p-4 shadow">
      <button type="button" onClick={toggle} className="md:hidden focus-ring">
        メニュー
      </button>
      <nav className={`${open ? 'block' : 'hidden'} md:flex gap-4`}>
        <Link to="/" className="focus-ring">
          ホーム
        </Link>
        <Link to="/all" className="focus-ring">
          すべて
        </Link>
        <Link to="/categories" className="focus-ring">
          カテゴリ
        </Link>
        <Link to="/settings" className="focus-ring">
          設定
        </Link>
      </nav>
    </header>
  );
}
