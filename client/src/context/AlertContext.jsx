import { createContext, useState, useEffect } from "react";

export const AlertContext = createContext();

const AlertProvider = ({ children }) => {
    
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const hideAlert = () => {
    setAlert({ type: "", message: "" });
  };

  // auto close after 3s
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(hideAlert, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
