// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ authState, setAuthState }) => {
  const handleLogout = () => {
    localStorage.removeItem('User'); // Optional: Remove user data from localStorage
    setAuthState({ User: null}); // Update auth state
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Getevents!
        </Link>

        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" className="text-white hover:text-gray-300">
              Events
            </Link>
          </li>
          
          {!authState.user ? (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-white hover:text-gray-300">
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
                   <li>
            <Link to="/booked/events" className="text-white hover:text-gray-300">
              Booked Events
            </Link>
          </li>
           
            <li>
         
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
