import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const isUserSignedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSignedOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className="flex justify-around p-3 border-b border-zinc-800 font-semibold
     items-center bg-[#205bd4] text-white"
    >
      <Link to="/">
        <h1 className="text-3xl">BankNow</h1>
      </Link>
      <ul className="flex gap-6">
        {isUserSignedIn ? (
          <>
            <Link to="/account">
              <li>Account</li>
            </Link>
            <Link to="/login">
              <li>
                <button onClick={handleSignedOut}>Sign Out</button>
              </li>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <li>Loign</li>
            </Link>
            <Link to="/signup">
              <li>Signup</li>
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
