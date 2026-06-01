// Browser automation demo using Playwright
// Steps:
//  1. Launch browser to a page with console output
//  2. Capture initial screenshot
//  3. Trigger JavaScript that produces console logs
//  4. Capture console output
//  5. Take another screenshot after page changes

import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pageUrl = pathToFileURL(join(__dirname, "page.html")).href;
const shot1 = join(__dirname, "screenshot-1-initial.png");
const shot2 = join(__dirname, "screenshot-2-after.png");
const logFile = join(__dirname, "console-output.log");

const consoleEntries = [];
const pageErrors = [];

(async () => {
  // --- Step 1: Launch browser to a page with console output ---
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 720 },
  });
  const page = await context.newPage();

  // Attach listeners BEFORE navigation so we don't miss load-time logs
  page.on("console", (msg) => {
    const entry = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
      time: new Date().toISOString(),
    };
    consoleEntries.push(entry);
    console.log(`[browser:${entry.type}] ${entry.text}`);
  });

  page.on("pageerror", (err) => {
    pageErrors.push({ message: err.message, stack: err.stack });
    console.log(`[browser:pageerror] ${err.message}`);
  });

  console.log("→ Navigating to:", pageUrl);
  await page.goto(pageUrl, { waitUntil: "load" });

  // --- Step 2: Capture initial screenshot ---
  await page.screenshot({ path: shot1, fullPage: true });
  console.log("✓ Saved initial screenshot:", shot1);

  // --- Step 3: Trigger JavaScript that produces console logs ---
  // Two ways shown: a real user click + an injected evaluate() log.
  await page.click("#trigger");
  await page.evaluate(() => {
    console.log("evaluate() injected log from automation script");
    console.info("evaluate() page title is:", document.title);
  });

  // Give the page a brief moment to settle (style/text mutations)
  await page.waitForSelector("body.changed");
  await page.waitForTimeout(200);

  // --- Step 4: Capture console output (already collected via listener) ---
  writeFileSync(
    logFile,
    consoleEntries
      .map((e) => `[${e.time}] [${e.type}] ${e.text}`)
      .join("\n") + "\n",
  );
  console.log("✓ Saved console log file:", logFile);

  // --- Step 5: Take another screenshot after page changes ---
  await page.screenshot({ path: shot2, fullPage: true });
  console.log("✓ Saved post-change screenshot:", shot2);

  await browser.close();

  // Summary for the operator
  console.log("\n=========== SUMMARY ===========");
  console.log("Console entries captured:", consoleEntries.length);
  for (const e of consoleEntries) {
    console.log(`  - [${e.type}] ${e.text}`);
  }
  if (pageErrors.length) {
    console.log("Page errors:", pageErrors);
  }
  console.log("Artifacts:");
  console.log("  •", shot1);
  console.log("  •", shot2);
  console.log("  •", logFile);
})().catch((err) => {
  console.error("Automation failed:", err);
  process.exit(1);
});
