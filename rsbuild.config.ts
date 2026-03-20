import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	plugins: [pluginReact()],
	html: {
		title: "Study Star ⭐",
		meta: {
			viewport:
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
			"apple-mobile-web-app-capable": "yes",
			"apple-mobile-web-app-status-bar-style": "default",
		},
	},
});
