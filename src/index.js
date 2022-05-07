import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from "react-redux";
import store from "./store";

if (process.env.NODE_ENV !== "production") {
  const parcelSocket = new WebSocket("ws://localhost:1234/");
  parcelSocket.onmessage = () => {
    window.location.reload();
  };
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
