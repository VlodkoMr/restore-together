import React, { useEffect, useState } from "react";
import logoIcon from "../assets/images/logo2.png";
import logoutIcon from "../assets/images/logout.png";
import logoutWhiteIcon from "../assets/images/logout-white.png";
import logoWhiteIcon from "../assets/images/logo-white2.png";
import { Button } from './basic/Button';
import { Container, Link, NavLink } from '../assets/styles/common.style';
import { login, logout } from '../near/utils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Header = ({ color, width }) => {
  const currentUser = useSelector(state => state.user.account);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Container width={width}
               className={`flex flex-row justify-between xl:justify-between sm:justify-around py-5 
                 ${color === "dark" ? "text-neutral-700 border-b-2" : "text-white max-w-[1500px]"}`}
    >
      <div className="xl:w-1/4 w-32">
        <Link to="/">
          <img src={color === "dark" ? logoIcon : logoWhiteIcon} alt="logo" width="140"/>
        </Link>
      </div>

      <div className={`pt-4 hidden md:block ${color === "dark" ? "" : "ml-4"}`}>
        <NavLink to="/">HOME</NavLink>
        <span className={`border-r ${color === "dark"
          ? "border-gray-200"
          : "opacity-20 border-gray-100"
        }`}>&nbsp;</span>
        <NavLink to="/facility">FACILITIES</NavLink>
        <span className={`border-r ${color === "dark"
          ? "border-gray-200"
          : "opacity-20 border-gray-100"
        }`}>&nbsp;</span>
        <NavLink to="/about">ABOUT US</NavLink>
      </div>

      <div className="text-right xl:w-1/4 hidden md:block">
        {currentUser.id ? (
          <div className="flex justify-end pt-1">
            <Button title="Add Facility"
                    onClick={() => navigate("/add-facility")}
                    noIcon
                    className={`bg-transparent mr-1 hidden lg:block
                    ${color === "dark"
                      ? "text-main border-main hover:text-main/90"
                      : "hover:border-mainLight hover:text-mainLight"}`}
            />

            <div className="mt-0 flex flex-row place-content-end">
              <Link to="/my"
                    className={`font-medium w-40 overflow-hidden cursor-pointer text-ellipsis ${color === "dark"
                      ? ""
                      : "text-gray-200 hover:text-white"
                    }`}>
                <small className="text-gray-400 inline-block">My Account</small>
                <span>{currentUser.id}</span>
              </Link>
              <img src={color === "dark" ? logoutIcon : logoutWhiteIcon}
                   alt="logout"
                   title="Logout"
                   className={`w-9 h-9 grayscale hover:grayscale-0 ml-4 mt-1 cursor-pointer transition ${color === "dark"
                     ? "opacity-50 hover:opacity-70"
                     : "opacity-40 hover:opacity-60"}`}
                   onClick={logout}/>
            </div>
          </div>
        ) : (
          <Button title="LogIn"
                  onClick={login}
                  className={`bg-transparent mt-1 ${color === "dark"
                    ? "text-main border-main hover:text-main/90"
                    : "hover:border-mainLight hover:text-mainLight"}`}
          />
        )}
      </div>

      <div className={"md:hidden relative"}>
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className={`px-2.5 py-2 ml-auto rounded-md lg:hidden focus:outline-none 
          ${mobileOpen && "bg-gray-600"} ${color === "dark" && !mobileOpen ? "text-gray-700" : "text-white"}`}>
          <svg
            className="w-7 h-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            {mobileOpen && (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            )}
            {!mobileOpen && (
              <path
                fillRule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              />
            )}
          </svg>
        </button>

        {mobileOpen && (
          <div className={`flex flex-col w-full absolute top-8 right-0 w-48 z-20 text-white
            bg-gray-600 px-4 py-3 text-right leading-8 rounded-b-lg rounded-l-lg`}>
            <Link onClick={() => setMobileOpen(false)} to={`/`}>HOME</Link>
            <Link onClick={() => setMobileOpen(false)} to={`/facility`}>FACILITIES</Link>
            <Link onClick={() => setMobileOpen(false)} to={`/about`}>ABOUT US</Link>
            {currentUser.id ? (
              <>
                <Link onClick={() => setMobileOpen(false)} to={`/my`}>DASHBOARD</Link>
                <Link onClick={() => setMobileOpen(false)} to={`/add-facility`}>ADD FACILITY</Link>
                <button className={"text-right"} onClick={logout}>LOGOUT</button>
              </>
            ) : (
              <button className={"text-right"} onClick={login}>LOGIN</button>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};
