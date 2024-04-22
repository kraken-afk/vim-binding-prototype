import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

// biome-ignore lint/style/noNonNullAssertion: Root always available
const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
