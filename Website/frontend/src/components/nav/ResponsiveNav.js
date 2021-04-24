import React from 'react';
import "./css/ResponsiveNav.css"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { translate } from "../../utils/langManager"
import { NavLink } from "react-router-dom"
import { setMenuOpen } from "./ResponsiveButton"



const ResponsiveNav = ({ open }) => {
  const isResponsive = useMediaQuery('(max-width: 1030px)');

  return (
    <ul className="responsive-nav-ul" open={open} style={{ transform: open ? 'translateX(0)' : 'translateX(100%)', display: isResponsive ? "flex" : "none" }}>
      <NavLink className="responsive-navlink " exact activeClassName="current" to="/" onClick={() => setMenuOpen(false)}>
        <li className="responsive-navlink"><i className="fad fa-home"></i> {translate("nav-home")}</li>
      </NavLink>

      <NavLink className="responsive-navlink" exact activeClassName="current" to="/Downloads" onClick={() => setMenuOpen(false)}>
        <li className="responsive-navlink"><i className="fad fa-download"></i> {translate("downloads")}</li>
      </NavLink>

      <a href="https://github.com/dd060606/OpenPasswordManager" rel="noopener noreferrer" className="responsive-navlink" target="_blank"><li className="responsive-navlink"><i className="fab fa-github"></i> GitHub</li></a>

      <NavLink className="responsive-navlink" exact activeClassName="current" to="/" onClick={() => setMenuOpen(false)}>
        <li className="responsive-navlink"><i className="fad fa-lock-alt"></i> {translate("my-password-manager")}</li>
      </NavLink>

    </ul>
  )
}

export default ResponsiveNav