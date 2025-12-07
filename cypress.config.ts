import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // 환경 변수로 URL 설정 가능 (기본값: localhost)
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    viewportWidth: 390,
    viewportHeight: 844,
    video: true, // 비디오 녹화 활성화 (통과/실패 모두 저장됨)
    videoCompression: 32, // 비디오 압축 (기본 품질)
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    experimentalStudio: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // 커맨드 로그 최소화
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'edge') {
          launchOptions.args.push('--disable-dev-shm-usage')
          launchOptions.args.push('--no-sandbox')
        }
        return launchOptions
      })
    },
  },
});
