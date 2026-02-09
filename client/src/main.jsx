import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import AlertProvider from "./context/AlertContext.jsx";

createRoot(document.getElementById("root")).render(
  <AppContextProvider>
    <AlertProvider>
      <App />
    </AlertProvider>
  </AppContextProvider>,
);
