import { chromium } from 'file:///C:/Users/Ravi/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('./screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Test Mobile (375px) - Exact size from user screenshot
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Click CV button on mobile header
  await mobilePage.click('#btn-open-resume-mobile');
  await mobilePage.waitForSelector('#printable-cv');

  // Verify bounding boxes do not overlap
  const collisionCheckMobile = await mobilePage.evaluate(() => {
    const badge = Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('TALENTGRID VERIFIED'));
    const candidateEmail = Array.from(document.querySelectorAll('p')).find(p => p.innerText.includes('@example.com'));
    const candidateName = document.querySelector('h1');

    if (!badge || !candidateEmail || !candidateName) return { error: 'Elements not found' };

    const badgeRect = badge.getBoundingClientRect();
    const emailRect = candidateEmail.getBoundingClientRect();
    const nameRect = candidateName.getBoundingClientRect();

    // Intersection test
    const overlapsWithEmail = !(
      badgeRect.bottom <= emailRect.top ||
      badgeRect.top >= emailRect.bottom ||
      badgeRect.right <= emailRect.left ||
      badgeRect.left >= emailRect.right
    );

    const overlapsWithName = !(
      badgeRect.bottom <= nameRect.top ||
      badgeRect.top >= nameRect.bottom ||
      badgeRect.right <= nameRect.left ||
      badgeRect.left >= nameRect.right
    );

    return {
      badge: { top: badgeRect.top, bottom: badgeRect.bottom, left: badgeRect.left, right: badgeRect.right },
      email: { top: emailRect.top, bottom: emailRect.bottom, left: emailRect.left, right: emailRect.right },
      overlapsWithEmail,
      overlapsWithName,
      hasOverlap: overlapsWithEmail || overlapsWithName
    };
  });

  const mobileScreenshot = path.join(outputDir, 'cv-modal-mobile-fixed.png');
  await mobilePage.screenshot({ path: mobileScreenshot });
  await mobilePage.close();

  // 2. Test Desktop (1280px)
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Open verified CV from desktop navbar
  await desktopPage.click('#btn-open-resume-desktop');
  await desktopPage.waitForSelector('#printable-cv');

  const collisionCheckDesktop = await desktopPage.evaluate(() => {
    const badge = Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('TALENTGRID VERIFIED'));
    const candidateEmail = Array.from(document.querySelectorAll('p')).find(p => p.innerText.includes('@example.com'));

    if (!badge || !candidateEmail) return { error: 'Elements not found' };

    const badgeRect = badge.getBoundingClientRect();
    const emailRect = candidateEmail.getBoundingClientRect();

    const overlaps = !(
      badgeRect.bottom <= emailRect.top ||
      badgeRect.top >= emailRect.bottom ||
      badgeRect.right <= emailRect.left ||
      badgeRect.left >= emailRect.right
    );

    return {
      overlaps,
      badgeTop: badgeRect.top,
      emailTop: emailRect.top
    };
  });

  const desktopScreenshot = path.join(outputDir, 'cv-modal-desktop-fixed.png');
  await desktopPage.screenshot({ path: desktopScreenshot });

  // 3. Test Alert-to-Notification Interception
  // Calling window.alert must NOT block or throw; it must trigger our toast notification
  await desktopPage.evaluate(() => {
    window.alert('Interception Test: Native alerts replaced with in-app notification!');
  });
  await desktopPage.waitForTimeout(300);

  const toastText = await desktopPage.evaluate(() => {
    const toastElem = document.querySelector('.toast-slide');
    return toastElem ? toastElem.innerText : null;
  });

  const toastScreenshot = path.join(outputDir, 'alert-toast-notification.png');
  await desktopPage.screenshot({ path: toastScreenshot });

  await desktopPage.close();
  await browser.close();

  console.log(JSON.stringify({
    collisionCheckMobile,
    collisionCheckDesktop,
    alertInterception: {
      toastDetected: !!toastText,
      toastContent: toastText
    },
    success: !collisionCheckMobile.hasOverlap && !collisionCheckDesktop.overlaps && !!toastText
  }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});