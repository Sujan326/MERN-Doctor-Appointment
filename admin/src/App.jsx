import React from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
}

export default App;
