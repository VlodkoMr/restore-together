import React, { useState } from "react";
import { Header } from '../components/Header';
import { Container, Wrapper } from '../assets/styles/common.style';

export const About = () => {
  return (
    <Wrapper>
      <Header color="dark" />

      <Container className="pt-4 xl:w-1/2 sm:w-3/4 mx-auto text-lg text-justify">
        <h2 className="text-3xl text-center my-6 font-semibold">About Project</h2>
        <p className="mb-4">Many monuments and cultural heritage have been affected by Russia's attack on Ukraine in
          2022. We want to restore this heritage together using NEAR blockchain and DeFi
          for fair work and payments on the restoration of Ukraine!
          Service use smart-contracts, validate participants and have rating to prevent misuse of finances.
        </p>

        <p>There is <b>two main user roles</b>: investors and performers.</p>
        <p className="mb-4">
          Everyone can offer a facility
          (temples, monuments, theaters, zoos etc.) for support or restore. Investors can support this project
          financially and receive a unique NFT for each contribution with an image of this cultural heritage.
        </p>
        <p className="mb-4">
          Performers provide information about the company (or private entrepreneur) and will be verified for more
          confidence. They can offer its services for support/recovery of facility (describe goals, provide time
          planning and
          financial estimates).
        </p>
        <p className="mb-4">
          Investors lock funds under facility and can vote for the performer. Performers that received more than 51% of
          the votes (by invested amount) may receive blocked funds (20-50% immediately and the rest with linear unlock
          during an execution period). To receive each subsequent payment, the contractor must provide a report for
          investors.
        </p>
        <p className="mb-4">
          In the case when a contractor does not provide such information or doesn't supply defined results/quality,
          investors may vote to suspend funding (that affects performer rating) and can choose another performer.
        </p>
        <p className="pb-20">
          <b>Project financial details.</b><br />
          Everyone can offer a facility for support or restore, but should pay 0.1 NEAR to avoid spam and cheat
          requests.
          We take 0.1% fee of all transactions that will be paid for moderators that check all information.
        </p>
      </Container>
    </Wrapper>
  );
};
