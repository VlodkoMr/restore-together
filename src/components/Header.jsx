import React, { useEffect, useState } from "react";
import logoIcon from "../assets/images/logo.png";
import logoutIcon from "../assets/images/logout.png";
import logoWhiteIcon from "../assets/images/logo-white.png";
import { Button } from './basic/Button';
import { Container, Link, NavLink } from '../assets/styles/common.style';
import { login, logout } from '../near/utils';

export const Header = ({ currentUser, color }) => {
  // const [scroll, setScroll] = useState(false);
  // useEffect(() => {
  //   // Change header bg on scroll
  //   window.addEventListener("scroll", () => {
  //     setScroll(window.scrollY > 60);
  //   });
  // }, []);

  return (
    <div className={`${color === "dark" ? "border-b" : ""}`}>
      <Container
        className={`flex flex-row justify-between py-5 
          ${color === "dark" ? "text-neutral-700" : "text-white"}`
        }>
        <div className="xl:w-72 w-48">
          <Link to="/">
            <img src={color === "dark" ? logoIcon : logoWhiteIcon} alt="logo" width="140" />
          </Link>
        </div>

        <div className="pt-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/facilities">Facilities</NavLink>
          <NavLink to="/add-facility">Add Facility</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>

        <div className="xl:w-72 w-48 pt-1 text-right">
          {currentUser ? (
            <>
              <div className="mt-2 flex flex-row place-content-end">
                <p className="pt-0.5">{currentUser.accountId}</p>
                <img src={logoutIcon}
                     alt="logout"
                     title="Logout"
                     className="w-6 h-6 ml-6 cursor-pointer hover:opacity-80 transition"
                     onClick={logout} />
              </div>
            </>
          ) : (
            <Button title="LogIn" onClick={login} secondary />
          )}
        </div>
      </Container>
    </div>
  );
};
