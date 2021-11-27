import React from "react";
import { Link } from "react-router-dom";

/**
 * Creates the navbar that sticks to the top and is present on
 * all pages
 */
export default function Navbar() {
  return (
    <div className="navbar-fixed" >
    <nav className="z-depth-0" >
      <div className="nav-wrapper white" >
        <Link
          to="/"
          style={{
            fontFamily: "monospace",

          }}
          className="col s5 brand-logo center black-text"
        >
          <i className="material-icons">computer</i>
          PROCTO
        </Link>
      </div>
    </nav>
  </div>
  );
}
