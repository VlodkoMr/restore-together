import bg from "../assets/images/bg2.jpg";
import bgTop from "../assets/images/bg-top.png";

import React from "react";
import { Header } from '../components/Header';
import { Link, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';

export const Homepage = () => {
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
        <Header />

        <div className="mt-4">
          <FacilitiesFilter />
        </div>

        <div className="text-center mt-8 leading-6">
          <p>Many monuments and cultural heritage have been affected by Russia's attack on Ukraine in 2022. </p>
          <p>
            Let's restore Ukraine together!
            <Link to={`/about`} className="text-white ml-1 underline">Read more</Link>.
          </p>
        </div>

      </Wrapper>

    </>
  );
};
