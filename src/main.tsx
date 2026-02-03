import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Toast from "./components/Toast.tsx";
import { SecurityRequestProvider } from "./context/securityRequestProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SecurityRequestProvider>
      <App />
    </SecurityRequestProvider>
    <Toast /> {/* <-- render Toast container once */}
  </StrictMode>
);
