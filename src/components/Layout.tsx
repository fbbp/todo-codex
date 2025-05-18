import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
