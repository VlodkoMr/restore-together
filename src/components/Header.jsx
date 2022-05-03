import React, { useEffect, useState } from "react";
import logoWhite from "../assets/images/logo-white.png";
import { Button } from './basic/Button';
import { NavLink } from '../assets/styles/common.style';
import { login } from '../near/utils';

export const Header = ({ currentUser }) => {
  // const [scroll, setScroll] = useState(false);
  // useEffect(() => {
  //   // Change header bg on scroll
  //   window.addEventListener("scroll", () => {
  //     setScroll(window.scrollY > 60);
  //   });
  // }, []);

  return (
    <>
      <div className="flex flex-row justify-between py-5">
        <div className="w-48">
          <img src={logoWhite} alt="logo" width="150" />
        </div>

        <div className="pt-4">
          <NavLink to="/">Homepage</NavLink>
          <NavLink to="/facilities">Facilities</NavLink>
          <NavLink to="/add-facility">Add Facility</NavLink>
          <NavLink to="/about">About Us</NavLink>
        </div>

        <div className="w-48 pt-1 text-right">
          <Button title="LogIn" onClick={login} secondary />
        </div>
      </div>
    </>
  );
};
