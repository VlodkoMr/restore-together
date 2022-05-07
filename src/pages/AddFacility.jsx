import React, { useState } from "react";
import { Header } from '../components/Header';
import { Container, Wrapper } from '../assets/styles/common.style';

export const AddFacility = ({ currentUser }) => {
  return (
    <Wrapper>
      <Header color="dark" currentUser={currentUser} />

      <Container className="pt-6">
        add...
      </Container>
    </Wrapper>
  );
};
