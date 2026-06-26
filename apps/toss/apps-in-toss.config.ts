import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "aidigestdesk",
  brand: {
    primaryColor: "#6EA8FE",
  },
  permissions: [
    { name: 'clipboard', access: 'read' },
    { name: 'clipboard', access: 'write' },
  ],
  webView: {},
  webBundleDir: "dist",
  navigationBar: { withBackButton: true, withHomeButton: true, theme: 'dark' },
});
