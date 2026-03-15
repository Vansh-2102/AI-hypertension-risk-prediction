import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinkClass =
  'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const renderLinks = () => (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${navLinkClass} ${isActive ? 'text-rose-600' : 'text-slate-700 hover:text-rose-600'}`
        }
        onClick={() => setOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/predict"
        className={({ isActive }) =>
          `${navLinkClass} ${isActive ? 'text-rose-600' : 'text-slate-700 hover:text-rose-600'}`
        }
        onClick={() => setOpen(false)}
      >
        Predict
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `${navLinkClass} ${isActive ? 'text-rose-600' : 'text-slate-700 hover:text-rose-600'}`
        }
        onClick={() => setOpen(false)}
      >
        History
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `${navLinkClass} ${isActive ? 'text-rose-600' : 'text-slate-700 hover:text-rose-600'}`
        }
        onClick={() => setOpen(false)}
      >
        About
      </NavLink>
    </>
  );

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🫀</span>
            <span className="font-semibold text-lg text-slate-900">
              Predictive Pulse
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {renderLinks()}
          </div>
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-rose-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-3 border-t border-slate-200">
            <div className="flex flex-col space-y-1 pt-3">{renderLinks()}</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

