import 'regenerator-runtime/runtime'
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Homepage,
  Facilities,
  AddFacility,
  About,
  User
} from "./pages";
import { FacilityDetails } from './pages/FacilityDetails';
import { initContract } from './near/utils';

import { useDispatch } from 'react-redux';
import { setUserAccountId, setUserIsManager, setUserPerformer } from './store/userSlice';

export default function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    window.nearInitPromise = initContract()
      .then(async () => {
        if (window.walletConnection.isSignedIn()) {
          const accountId = window.walletConnection.getAccountId();
          dispatch(setUserAccountId({ id: accountId }));

          // Load user roles
          window.contract.get_user_info({ account_id: accountId }).then(info => {
            dispatch(setUserIsManager({ status: info[0] }));
            dispatch(setUserPerformer({ performer: info[1] }));
            setIsReady(true);
          })
        } else {
          setIsReady(true);
        }
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
                <Homepage />
              }
            />
            <Route
              exact
              path="/facility"
              element={
                <Facilities />
              }
            />
            <Route
              exact
              path="/facility/:id"
              element={
                <FacilityDetails />
              }
            />
            <Route
              exact
              path="/add-facility"
              element={<AddFacility />}
            />
            <Route
              exact
              path="/about"
              element={<About />}
            />
            <Route
              exact
              path="/my"
              element={<User />}
            />
          </Routes>
        )}

      </BrowserRouter>
    </>
  )
}
