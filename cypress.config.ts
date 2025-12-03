import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // 환경 변수로 URL 설정 가능 (기본값: localhost)
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    viewportWidth: 390,
    viewportHeight: 844,
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
