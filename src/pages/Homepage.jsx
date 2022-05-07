import bg from "../assets/images/bg2.jpg";
import bgTop from "../assets/images/bg-top.png";

import React from "react";
import { Header } from '../components/Header';
import { Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';

export const Homepage = ({ currentUser }) => {

  return (
    <>
      <div className="absolute z-0 w-full h-full" style={{
        background: `url(${bg}) top center`, backgroundSize: `cover`
      }}>&nbsp;</div>
      <div className="absolute z-0 w-full h-full" style={{
        background: `url(${bgTop}) top center`, backgroundSize: `cover`, animation: `bg-opacity 15s 5 3s`
      }}>&nbsp;</div>
      <div className="top-gradient">&nbsp;</div>

      <Wrapper className="text-white">
        <Header currentUser={currentUser} />

        <div className="mt-4">
          <FacilitiesFilter />
        </div>

        <div className="text-center mt-6">
          text...
        </div>

      </Wrapper>

    </>
  );
};
