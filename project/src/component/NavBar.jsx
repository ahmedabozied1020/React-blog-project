import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar bg-slate-700 text-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Blog
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 ">
          <li>
            <Link className="focus:text-base-100 focus:bg-slate-500" to="/modify">
              Modify
            </Link>
          </li>
          <li>
            <Link className="focus:text-base-100 focus:bg-slate-500" to="/register">
              SignUp
            </Link>
          </li>
          <li>
            <Link className="focus:text-base-100 focus:bg-slate-500" to="/login">
              LogIn
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
