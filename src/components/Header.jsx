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
  // const [scroll, setScroll] = useState(false);
  // useEffect(() => {
  //   // Change header bg on scroll
  //   window.addEventListener("scroll", () => {
  //     setScroll(window.scrollY > 60);
  //   });
  // }, []);

  return (
    <Container width={width}
               className={`flex flex-row justify-between py-5 
                 ${color === "dark" ? "text-neutral-700 border-b" : "text-white max-w-[1500px]"}`}
    >
      <div className="w-1/3">
        <Link to="/">
          <img src={color === "dark" ? logoIcon : logoWhiteIcon} alt="logo" width="140" />
        </Link>
      </div>

      <div className={`pt-4 ${color === "dark" ? "" : "ml-10"}`}>
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

      <div className="text-right w-1/3">
        {currentUser.id ? (
          <div className="flex justify-end pt-1">
            <Button title="Add Facility"
                    onClick={() => navigate("/add-facility")}
                    noIcon
                    className={`bg-transparent 
                    ${color === "dark"
                      ? "text-blue-400 border-blue-400 hover:text-blue-500"
                      : "hover:border-blue-300 hover:text-blue-300"}`}
            />

            <div className="mt-0 flex flex-row place-content-end">
              <Link to="/my"
                    className={`font-medium w-40 overflow-hidden cursor-pointer text-ellipsis ${color === "dark"
                      ? ""
                      : "text-gray-200 hover:text-white"
                    }`}>
                <small className="opacity-50 inline-block">My Account</small>
                <span>{currentUser.id}</span>
              </Link>
              <img src={color === "dark" ? logoutIcon : logoutWhiteIcon}
                   alt="logout"
                   title="Logout"
                   className={`w-9 h-9 ml-4 mt-1 cursor-pointer transition ${color === "dark"
                     ? "opacity-80 hover:opacity-90"
                     : "opacity-50 hover:opacity-60"}`}
                   onClick={logout} />
            </div>
          </div>
        ) : (
          <Button title="LogIn"
                  onClick={login}
                  className={`bg-transparent mt-1 ${color === "dark"
                    ? "text-blue-400 border-blue-400 hover:text-blue-500"
                    : "hover:border-blue-400 hover:text-blue-400"}`}
          />
        )}
      </div>
    </Container>
  );
};
