import 'regenerator-runtime/runtime'
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Homepage,
  Facilities,
  AddFacility,
  About,
} from "./pages";
import { initContract, login, logout } from './near/utils';

import './global.css'

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState();

  React.useEffect(() => {
    window.nearInitPromise = initContract()
      .then(async () => {
        if (window.walletConnection.isSignedIn()) {
          const accountId = window.walletConnection?.getAccountId();
          console.log('accountId', accountId);
          //   let tokenBalance = await window.ftContract.ft_balance_of({
          //     account_id: accountId,
          //   });
          //
          setCurrentUser({
            accountId: accountId,
            // tokenBalance: tokenBalance,
          });
        }

        setTimeout(() => {
          setIsReady(true);
        }, 500);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Homepage currentUser={currentUser} isReady={isReady} />
            }
          />
          <Route
            exact
            path="/facilities"
            element={
              <Facilities currentUser={currentUser} />
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
      </BrowserRouter>
    </>
  )
}
