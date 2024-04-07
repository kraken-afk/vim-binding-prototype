import { StrictMode } from "react";
import { App } from "./app";
import { createRoot } from "react-dom/client";

// biome-ignore lint/style/noNonNullAssertion: Root always available
const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
