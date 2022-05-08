import React, { useState } from "react";
import { Header } from '../components/Header';
import { Container, Wrapper } from '../assets/styles/common.style';
import { useLocation } from 'react-router-dom';

export const AddFacility = ({ currentUser }) => {
  const { state: searchFilters } = useLocation();

  return (
    <Wrapper>
      <Header color="dark" currentUser={currentUser} />

      <Container className="pt-6">
        add... {searchFilters && (searchFilters.region) || "10"}
      </Container>
    </Wrapper>
  );
};
