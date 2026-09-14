import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

function loadDeferredFonts() {
  void import("./styles/fonts-deferred.css");
}

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadDeferredFonts, { timeout: 2500 });
  } else {
    setTimeout(loadDeferredFonts, 800);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
