import 'regenerator-runtime/runtime'
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Homepage,
  Facilities,
  AddFacility,
  About,
} from "./pages";
import { FacilityDetails } from './pages/FacilityDetails';
import { initContract } from './near/utils';

import './global.css'

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState();

  React.useEffect(() => {
    window.nearInitPromise = initContract()
      .then(async () => {
        if (window.walletConnection.isSignedIn()) {
          setCurrentUser({
            accountId: window.walletConnection.getAccountId(),
          });
        }

        setIsReady(true);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <BrowserRouter>
        {isReady && (
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Homepage currentUser={currentUser} />
              }
            />
            <Route
              exact
              path="/facility"
              element={
                <Facilities currentUser={currentUser} />
              }
            />
            <Route
              exact
              path="/facility/:id"
              element={
                <FacilityDetails currentUser={currentUser} />
              }
            />
            <Route
              exact
              path="/add-facility"
              element={<AddFacility currentUser={currentUser} />}
            />
            <Route
              exact
              path="/about"
              element={<About currentUser={currentUser} />}
            />
          </Routes>
        )}

      </BrowserRouter>
    </>
  )
}
