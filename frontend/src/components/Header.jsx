import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  HiOutlineUser,
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlinePlus,
  HiOutlineViewGrid,
} from "react-icons/hi"; // New Icons
import { GiHamburgerMenu } from "react-icons/gi"; // Hamburger Menu for mobile

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-[#f4f4f9] shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo Section */}
        <Link
          to="/"
          className="text-3xl font-bold text-[#089700] flex items-center space-x-2"
        >
          <span>Event Manager</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {user ? (
            <>
              <Link
                to="/create-event"
                className="flex items-center  text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#009756] hover:text-white transition duration-300 "
              >
                <HiOutlinePlus className="mr-2" />
                Create Event
              </Link>
              <Link
                to="/my-events"
                className="flex items-center  text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#009756] hover:text-white transition duration-300 "
              >
                <HiOutlineViewGrid className="mr-2" />
                My Events
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center  text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#009756] hover:text-white transition duration-300 "
              >
                <HiOutlineLogout className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-[#4b0097] hover:bg-[#4b0097] hover:text-white border border-gray-300 px-4 py-2 rounded-md font-semibold transition duration-300"
              >
                <HiOutlineLogin className="mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center bg-[#4b0097] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#4b0097] transition duration-300"
              >
                <HiOutlineUser className="mr-2" />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-3xl text-[#4b0097] focus:outline-none"
        >
          <GiHamburgerMenu />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg flex flex-col items-center space-y-6 py-4 px-8">
          {user ? (
            <>
              <Link
                to="/create-event"
                className="text-[#4b0097] text-lg font-semibold hover:text-[#102144] transition duration-300"
              >
                <HiOutlinePlus className="mr-2" />
                Create Event
              </Link>
              <Link
                to="/my-events"
                className="text-[#4b0097] text-lg font-semibold hover:text-[#102144] transition duration-300"
              >
                <HiOutlineViewGrid className="mr-2" />
                My Events
              </Link>
              <button
                onClick={handleLogout}
                className="text-[#dc363c] text-lg font-semibold hover:text-red-600 transition duration-300"
              >
                <HiOutlineLogout className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#4b0097] text-lg font-semibold hover:text-white hover:bg-[#4b0097] px-4 py-2 rounded-md transition duration-300"
              >
                <HiOutlineLogin className="mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="text-white text-lg font-semibold bg-[#4b0097] hover:bg-[#4b0097] px-4 py-2 rounded-md transition duration-300"
              >
                <HiOutlineUser className="mr-2" />
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
