import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

if (process.env.NODE_ENV !== "production") {
  const parcelSocket = new WebSocket("ws://localhost:1234/");
  parcelSocket.onmessage = () => {
    window.location.reload();
  };
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
