// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { UniverseProvider } from "./lib/universeContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UniverseProvider>
      <App />
    </UniverseProvider>
  </React.StrictMode>
)
