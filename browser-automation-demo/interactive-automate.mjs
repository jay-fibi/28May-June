// Browser automation demo using Playwright
// Steps:
//  1. Launch browser to a test page with interactive elements
//  2. Click on a button element
//  3. Input text into a form field
//  4. Submit a form
//  5. Scroll down the page

import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pageUrl = pathToFileURL(join(__dirname, "interactive-page.html")).href;
const shotInitial = join(__dirname, "interactive-1-initial.png");
const shotClicked = join(__dirname, "interactive-2-clicked.png");
const shotSubmitted = join(__dirname, "interactive-3-submitted.png");
const shotScrolled = join(__dirname, "interactive-4-scrolled.png");

(async () => {
  // --- Step 1: Launch browser to a test page with interactive elements ---
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 720 },
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    console.log(`[browser:${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    console.log(`[browser:pageerror] ${err.message}`);
  });

  console.log("→ Navigating to:", pageUrl);
  await page.goto(pageUrl, { waitUntil: "load" });
  await page.screenshot({ path: shotInitial, fullPage: true });
  console.log("✓ Saved initial screenshot:", shotInitial);

  // --- Step 2: Click on a button element ---
  await page.click("#action-btn");
  await page.waitForSelector("#click-status .clicked-badge");
  const clickStatus = await page.textContent("#click-status");
  console.log("✓ Button clicked. Status:", clickStatus.trim());
  await page.screenshot({ path: shotClicked, fullPage: true });

  // --- Step 3: Input text into a form field ---
  await page.fill("#name", "Ada Lovelace");
  await page.fill("#email", "ada@example.com");
  const nameValue = await page.inputValue("#name");
  const emailValue = await page.inputValue("#email");
  console.log("✓ Filled form fields:", { name: nameValue, email: emailValue });

  // --- Step 4: Submit a form ---
  await page.click("#submit-btn");
  await page.waitForSelector("body.form-submitted");
  const formStatus = await page.textContent("#form-status");
  console.log("✓ Form submitted. Status:", formStatus.trim());
  await page.screenshot({ path: shotSubmitted, fullPage: true });

  // --- Step 5: Scroll down the page ---
  await page.locator("#scroll-target").scrollIntoViewIfNeeded();
  const scrollY = await page.evaluate(() => Math.round(window.scrollY));
  const targetVisible = await page.isVisible("#scroll-target");
  console.log(`✓ Scrolled down. scrollY=${scrollY}px, target visible=${targetVisible}`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: shotScrolled });

  await browser.close();

  // Summary for the operator
  console.log("\n=========== SUMMARY ===========");
  console.log("Step 1: Launched browser to interactive page ✓");
  console.log("Step 2: Clicked button ✓");
  console.log("Step 3: Input text into form fields ✓");
  console.log("Step 4: Submitted form ✓");
  console.log("Step 5: Scrolled down the page ✓");
  console.log("Artifacts:");
  console.log("  •", shotInitial);
  console.log("  •", shotClicked);
  console.log("  •", shotSubmitted);
  console.log("  •", shotScrolled);
})().catch((err) => {
  console.error("Automation failed:", err);
  process.exit(1);
});
