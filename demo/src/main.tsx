import { createRoot } from "react-dom/client";
import { registerDeckPlugin, registerTextPlugin, registerMeasurePlugin } from "../../src/index.js";
import { App } from "./app.js";
import "./styles.css";

registerTextPlugin();
registerDeckPlugin();
registerMeasurePlugin();

const container = document.getElementById("root");
if (!container) throw new Error("Demo root element is missing");

createRoot(container).render(<App />);
