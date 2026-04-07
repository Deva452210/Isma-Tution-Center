'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/slices/uiSlice';
import logo from '../assets/Isma-Logo.svg';

const Header = () => {
  const isMobileMenuOpen = useSelector((state) => state.ui.isSidebarOpen);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState(null);
  const [rollNumber, setRollNumber] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Check local storage for logged-in user details
    const storedName = localStorage.getItem('userName');
    const storedRoll = localStorage.getItem('rollNumber');
    if (storedName) {
      setUserName(storedName);
    }
    if (storedRoll) {
      setRollNumber(storedRoll);
    }
  }, []);

  const handleMenuToggle = () => {
    dispatch(toggleSidebar());
  };

  const closeMenu = () => {
    if (isMobileMenuOpen) {
      dispatch(toggleSidebar());
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsDropdownOpen(false); // Close avatar dropdown
    closeMenu(); // Close mobile menu if open
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('rollNumber');
    setUserName(null);
    setRollNumber(null);
    setShowLogoutConfirm(false);
    // Hard refresh to clear any cached states across the app
    window.location.href = '/';
  };

  // Extract first letter for Avatar
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : '?';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm relative">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={handleMenuToggle} className="p-2 -ml-2 text-gray-800 hover:text-brand transition-colors focus:outline-none">
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMenu}>
            <img src={logo.src} alt="ISMA Logo" className="h-7 sm:h-10 w-auto mr-1.5 sm:mr-2" />
            <span className="text-lg sm:text-2xl font-black italic tracking-tighter text-brand">ISMA</span>
            <span className="text-lg sm:text-2xl font-black italic tracking-tighter ml-1 whitespace-nowrap">TUTION CENTER</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center space-x-8">
            <Link href="/students-hub" className="text-gray-800 font-medium hover:text-brand transition-colors">Student's Hub</Link>
            <Link href="/gallery" className="text-gray-800 font-medium hover:text-brand transition-colors">Graduates</Link>
          </nav>

          {/* Contact and Auth Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            <a href="tel:+919043303030" className="hidden sm:flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-full border border-brand hover:bg-green-50 transition-colors">
              <Phone className="w-5 h-5 text-brand" />
              <span className="hidden lg:block ml-2 font-semibold text-brand">73588 70782</span>
            </a>

            {/* Auth Block */}
            {userName ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center shadow-md hover-scale hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                >
                  {firstLetter}
                </button>

                {/* Avatar Dropdown */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 transform opacity-100 scale-100 transition-all origin-top-right"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">Hi, {userName}</p>
                    </div>
                    {rollNumber === '1234' && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center font-medium transition-colors border-b border-gray-100"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 sm:px-6 sm:py-2 rounded-full bg-brand text-white font-semibold shadow-md hover-scale hover:shadow-lg transition-all border border-transparent text-sm sm:text-base">
                Log In
              </Link>
            )}

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg px-4 py-6 flex flex-col space-y-4 font-medium text-lg">
            <Link
              href="/students-hub"
              className="flex w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 hover:text-brand hover:bg-green-50 transition-all border border-transparent"
              onClick={closeMenu}
            >
              Student's Hub
            </Link>
            <Link
              href="/gallery"
              className="flex w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 hover:text-brand hover:bg-green-50 transition-all border border-transparent"
              onClick={closeMenu}
            >
              Gallery
            </Link>

            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
              <a href="tel:+919043303030" className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-brand text-brand hover:bg-green-50 transition-colors font-semibold">
                <Phone className="w-5 h-5 mr-2" />
                Call 90433 03030
              </a>
              {!userName && (
                <Link
                  href="/signup"
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-brand text-white font-semibold text-center hover:bg-green-800 transition-colors"
                  onClick={closeMenu}
                >
                  Sign Up For Free
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm transform scale-100 transition-transform origin-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign out?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of your student account?</p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
