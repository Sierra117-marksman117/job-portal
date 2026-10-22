import { chromium } from 'file:///C:/Users/Ravi/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('./screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: 'mobile-iphone-375', width: 375, height: 812 },
  { name: 'mobile-large-414', width: 414, height: 896 },
  { name: 'tablet-ipad-768', width: 768, height: 1024 },
  { name: 'desktop-laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-hd-1920', width: 1920, height: 1080 }
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Check button overflow & metrics
    const buttonMetrics = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((b) => {
        const rect = b.getBoundingClientRect();
        return {
          id: b.id || null,
          text: b.innerText.trim().replace(/\n/g, ' ').slice(0, 30),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          isOverflowingX: rect.right > docWidth + 2 || rect.left < -2,
        };
      });
    });

    const screenshotPath = path.join(outputDir, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });

    results.push({
      viewport: vp.name,
      width: vp.width,
      overflowCount: buttonMetrics.filter(b => b.isOverflowingX).length,
      buttons: buttonMetrics
    });

    await page.close();
  }

  // Interactive End-to-End Test (Recruiter & Admin Switcher)
  const testPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await testPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Switch to Recruiter
  await testPage.click('#tab-recruiter');
  await testPage.waitForTimeout(300);
  const recruiterHeading = await testPage.locator('h2').first().innerText();
  const recruiterScreenshot = path.join(outputDir, 'recruiter-view.png');
  await testPage.screenshot({ path: recruiterScreenshot });

  // 2. Switch to Admin
  await testPage.click('#tab-admin');
  await testPage.waitForTimeout(300);
  const adminHeading = await testPage.locator('h2').first().innerText();
  const adminScreenshot = path.join(outputDir, 'admin-view.png');
  await testPage.screenshot({ path: adminScreenshot });

  await testPage.close();
  await browser.close();

  console.log(JSON.stringify({
    results,
    recruiterHeading,
    adminHeading,
    success: true
  }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
