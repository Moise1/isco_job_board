import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function TopBar() {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.users); 
    
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Dispatch logout action or do your logout logic here
    dispatch({ type: "auth/logout" }); // example
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold">
        Hey, {user || 'User'}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none"
        >
          Profile ▼
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                // Navigate to account page
                // e.g. navigate("/account")
              }}
            >
              Account
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                // Navigate to settings page
                // e.g. navigate("/settings")
              }}
            >
              Settings
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
