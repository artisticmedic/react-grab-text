import "react-grab";
import { createRoot } from "react-dom/client";
import { registerTextPlugin } from "../../src/index.js";
import { App } from "./app.js";
import "./styles.css";

registerTextPlugin();

const container = document.getElementById("root");
if (!container) throw new Error("Demo root element is missing");

createRoot(container).render(<App />);
