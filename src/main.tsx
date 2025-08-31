import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CoreContextProvider } from "./contexts/CoreContext/CoreeContext.tsx";
import { ReactFlowProvider } from "@xyflow/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CoreContextProvider>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </CoreContextProvider>
  </StrictMode>
);
