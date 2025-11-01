import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// --- ADDED Menu and X icons for the hamburger functionality ---
import { Smile, UserCircle, LogOut, LayoutDashboard, User, Menu, X } from 'lucide-react';

// The component receives the onSignOut function from its parent (ProtectedLayout)
const Header = ({ onSignOut }) => {
    const location = useLocation();
    // Existing state for the User Profile Dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // --- NEW state for the Main Mobile Navigation Menu ---
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const navItems = [
        { name: 'Home', href: '/HomePage' },
        { name: 'Support', href: '/SupportPage' },
        { name: 'Chat', href: '/ChatPage' },
        { name: 'Community', href: '/AnnouncementsPage' },
        { name: 'Resources', href: '/ArticlesPage' },
        { name: 'Track Mood', href: '/TrackMoodPage' },
        { name: 'Dashboard', href: '/WellnessDashboard' },

    ];

    // Existing toggle for the User Profile Dropdown
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // --- NEW toggle function for the Main Mobile Navigation ---
    const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

    // Handles sign out action: calls the prop function and closes the menu
    const handleSignOutClick = () => {
        if (onSignOut) {
            onSignOut();
        }
        // Close both menus
        setIsMenuOpen(false);
        setIsMobileNavOpen(false);
    };

    // Handles link click: closes both menus
    const handleLinkClick = () => {
        setIsMenuOpen(false);
        setIsMobileNavOpen(false);
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="container max-w-7xl mx-auto px-6 flex justify-between items-center h-14">

                {/* Logo/Brand Name */}
                <div className="flex items-center space-x-2 text-blue-600 font-semibold text-lg ml-4">
                    <Link to="/" className="hover:text-blue-800 transition-colors">
                        {/* Replaced 'BetterX' text with an image tag */}
                        <img src="/logo.png" alt="BetterX Logo" className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Navigation Links and Profile Menu Container */}
                <div className="flex items-center space-x-4"> {/* Adjusted space-x to 4 for mobile icon fitting */}

                    {/* --- NEW: HAMBURGER/CLOSE ICON (Visible only on mobile) --- */}
                    <button
                        className="md:hidden text-gray-600 hover:text-blue-600 transition-colors p-2 z-40"
                        onClick={toggleMobileNav}
                        aria-expanded={isMobileNavOpen}
                        aria-controls="mobile-nav-menu"
                        aria-label="Toggle main navigation"
                    >
                        {/* Show X icon when menu is open, otherwise show Menu icon */}
                        {isMobileNavOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>

                    {/* Main Navigation Links (Hidden on mobile, shown on desktop) */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`text-sm px-2 py-4 text-gray-600 hover:text-blue-500 transition-colors ${location.pathname === item.href
                                        ? 'font-semibold text-blue-700 border-b-2 border-blue-700'
                                        : 'border-b-2 border-transparent hover:border-blue-200'
                                    }`}                    >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile Icon and Dropdown (Existing Logic) */}
                    {/* Note: This button still controls the profile menu using isMenuOpen state */}
                    <div className="relative">
                        <button
                            onClick={toggleMenu}
                            className="p-1 rounded-full text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                            aria-label="Toggle user menu"
                        >
                            <UserCircle className="w-8 h-8" />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 overflow-hidden">

                                {/* My Profile Link */}
                                <Link
                                    to="/UserProfile"
                                    onClick={handleLinkClick}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-100"
                                >
                                    <User className="w-4 h-4" />
                                    <span>My Profile</span>
                                </Link>

                                {/* My Dashboard Link */}
                                <Link
                                    to="/WellnessDashboard"
                                    onClick={handleLinkClick}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-100"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>My Dashboard</span>
                                </Link>

                                {/* Divider */}
                                <div className="border-t border-gray-100 my-0"></div>

                                {/* Sign Out Button */}
                                <button
                                    onClick={handleSignOutClick}
                                    className="flex items-center space-x-3 px-4 py-2 w-full text-left text-red-500 hover:bg-red-50 transition duration-100"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- NEW: MOBILE NAVIGATION MENU CONTAINER --- */}
            {/* This slides in from the left when the hamburger icon is clicked */}
            <nav
                id="mobile-nav-menu"
                className={`md:hidden absolute top-14 left-0 w-full bg-white shadow-xl transition-transform duration-300 ease-in-out z-40 ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}      >
                <div className="flex flex-col p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={handleLinkClick} // Closes the mobile nav when a link is clicked
                            className={`block px-3 py-2 text-base rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === item.href
                                    ? 'font-semibold text-blue-700 bg-blue-100'
                                    : ''
                                }`}                >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;