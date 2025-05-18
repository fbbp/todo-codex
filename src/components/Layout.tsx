import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex gap-4 p-4 shadow">
        <Link to="/">Home</Link>
        <Link to="/all">All</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
