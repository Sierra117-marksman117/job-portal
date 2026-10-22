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
  const viewportResults = [];

  // 1. Verify responsive layout & button bounds on all viewports
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

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

    const overflowing = buttonMetrics.filter((b) => b.isOverflowingX);
    const screenshotPath = path.join(outputDir, `${vp.name}-homepage.png`);
    await page.screenshot({ path: screenshotPath });

    viewportResults.push({
      viewport: vp.name,
      width: vp.width,
      overflowCount: overflowing.length,
      overflowing,
    });

    await page.close();
  }

  // 2. Open Register Modal on Desktop (1280px) and check all 3 role tabs
  const testPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await testPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Click "+ Register" button
  await testPage.click('#btn-open-register');
  await testPage.waitForSelector('[role="dialog"]');
  await testPage.screenshot({ path: path.join(outputDir, 'register-modal-candidate.png') });

  // Click Recruiter Tab inside Modal
  await testPage.click('#modal-tab-recruiter');
  await testPage.waitForTimeout(200);
  await testPage.screenshot({ path: path.join(outputDir, 'register-modal-recruiter.png') });

  // Click Super Admin Tab inside Modal
  await testPage.click('#modal-tab-admin');
  await testPage.waitForTimeout(200);
  await testPage.screenshot({ path: path.join(outputDir, 'register-modal-admin.png') });

  // 3. Register a new Candidate: "Ananya Deshmukh"
  await testPage.click('#modal-tab-candidate');
  await testPage.waitForTimeout(200);

  // Fill in candidate form using precise input IDs
  const timestamp = Date.now();
  const testCandidateEmail = `ananya.${timestamp}@example.com`;
  await testPage.fill('#reg-name', 'Ananya Deshmukh');
  await testPage.fill('#reg-email', testCandidateEmail);
  await testPage.fill('#reg-password', 'Secret@123');
  await testPage.fill('#reg-candidate-skills', 'React, Next.js, TypeScript, Tailwind CSS');

  // Submit registration
  await testPage.click('#btn-submit-registration');

  // Wait for modal to close and toast to appear
  await testPage.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 8000 });
  await testPage.waitForTimeout(500);

  // Verify updated navbar name and candidate apply button text
  const navbarSeekerText = await testPage.locator('#tab-seeker').innerText();
  const applyBtnText = await testPage.locator('#btn-apply-job').innerText();

  await testPage.screenshot({ path: path.join(outputDir, 'candidate-registered-workspace.png') });

  // 4. Register a new Recruiter: "Vikram Malhotra" for "Razorpay Innovations"
  await testPage.click('#btn-open-register');
  await testPage.waitForSelector('[role="dialog"]');
  await testPage.click('#modal-tab-recruiter');

  const testRecruiterEmail = `vikram.${timestamp}@razorpay.in`;
  await testPage.fill('#reg-name', 'Vikram Malhotra');
  await testPage.fill('#reg-email', testRecruiterEmail);
  await testPage.fill('#reg-password', 'Secret@123');
  await testPage.fill('#reg-recruiter-company', 'Razorpay Innovations');
  await testPage.click('#btn-submit-registration');

  await testPage.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 8000 });
  await testPage.waitForTimeout(500);

  const recruiterTabText = await testPage.locator('#tab-recruiter').innerText();
  await testPage.screenshot({ path: path.join(outputDir, 'recruiter-registered-pipeline.png') });

  // 5. Switch to Admin view and verify the pending KYC includes "Razorpay Innovations"
  await testPage.click('#tab-admin');
  await testPage.waitForTimeout(400);

  const adminBody = await testPage.content();
  const hasRazorpayPending = adminBody.includes('Razorpay Innovations');
  await testPage.screenshot({ path: path.join(outputDir, 'admin-kyc-pending-verified.png') });

  await testPage.close();
  await browser.close();

  console.log(JSON.stringify({
    viewportResults,
    registrationVerification: {
      candidateRegistration: {
        seekerLabel: navbarSeekerText,
        applyButtonText: applyBtnText,
        success: navbarSeekerText.includes('Ananya') && applyBtnText.includes('Ananya'),
      },
      recruiterRegistration: {
        recruiterLabel: recruiterTabText,
        success: recruiterTabText.includes('Vikram'),
      },
      adminGovernanceKyc: {
        hasRazorpayPending,
        success: hasRazorpayPending,
      }
    }
  }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});