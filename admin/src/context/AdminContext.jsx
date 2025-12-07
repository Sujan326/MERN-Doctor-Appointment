import { useState } from "react";
import { createContext } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [adminToken, setAdminToken] = useState(
    // If adminToken there in Local-Storage use it (dont show login page) else use empty string (show the login page)
    localStorage.getItem("adminToken") ? localStorage.getItem("adminToken") : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    adminToken,
    setAdminToken,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
