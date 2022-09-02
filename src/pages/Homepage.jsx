import bg from "../assets/images/bg2.jpg";
import bgTop from "../assets/images/bg-top.png";

import React from "react";
import { Header } from '../components/Header';
import { Link, Wrapper } from '../assets/styles/common.style';
import { FacilitiesFilter } from '../components/FacilitiesFilter';
import { Footer } from '../components/Footer';

export const Homepage = () => {
  return (
    <>
      <div className="absolute z-0 w-full h-full bottom-16" style={{
        background: `url(${bg}) top center`, backgroundSize: `cover`
      }}>&nbsp;</div>
      <div className="absolute z-0 w-full h-full bottom-16" style={{
        background: `url(${bgTop}) top center`, backgroundSize: `cover`, animation: `bg-opacity 15s 5 3s`
      }}>&nbsp;</div>
      <div className="top-gradient">&nbsp;</div>

      <Wrapper className="text-white">
        <Header />

        <main className="mb-auto">
          <div className="mt-4">
            <FacilitiesFilter />
          </div>

          <div className="text-center mt-8 leading-6">
            <p>Many monuments and cultural heritage have been affected by Russia's attack on Ukraine in 2022. </p>
            <p>
              Let's restore Ukraine together!
              <Link to={`/about`} className="ml-1 border-b border-gray-200/40">Read more</Link>.
            </p>
          </div>
        </main>

        <Footer />
      </Wrapper>
    </>
  );
};
