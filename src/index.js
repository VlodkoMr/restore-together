import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from './App'
import store from "./store";

if (process.env.NODE_ENV !== "production") {
  const parcelSocket = new WebSocket("ws://localhost:1234/");
  parcelSocket.onmessage = () => {
    window.location.reload();
  };
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App/>
  </Provider>
);
