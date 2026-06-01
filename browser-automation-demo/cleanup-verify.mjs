// Browser lifecycle + resource-cleanup verification using Playwright.
//
// Steps:
//   1. Launch browser
//   2. Perform some operations (navigate, click, screenshot)
//   3. Close browser explicitly
//   4. Verify resource cleanup (connection state, contexts, child processes)
//   5. Launch and close browser again (re-launchability check)
//
// Run with: node cleanup-verify.mjs

import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pageUrl = pathToFileURL(join(__dirname, "page.html")).href;
const cycle1Shot = join(__dirname, "cleanup-cycle1.png");
const cycle2Shot = join(__dirname, "cleanup-cycle2.png");

const results = [];
const record = (name, passed, detail = "") => {
  results.push({ name, passed, detail });
  const tag = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`${tag}  ${name}${detail ? "  — " + detail : ""}`);
};

// Count Playwright-spawned chromium processes belonging to this Node process.
// We match on the user-data-dir path Playwright uses, which contains "playwright"
// (e.g. .../ms-playwright/.../...). This avoids counting the user's own browser.
const countPlaywrightChromiumProcs = () => {
  try {
    const out = execSync(
      "ps -A -o pid=,command= | grep -i -E 'playwright.*(Chromium|chrome|headless)' | grep -v grep || true",
      { encoding: "utf8" },
    );
    if (!out.trim()) return 0;
    return out.trim().split("\n").length;
  } catch {
    return 0;
  }
};

const waitFor = async (predicate, { timeoutMs = 5000, intervalMs = 100 } = {}) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await predicate()) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
};

const runCycle = async (label, screenshotPath) => {
  console.log(`\n────── ${label} ──────`);

  // --- Step 1: Launch browser ---
  const procsBefore = countPlaywrightChromiumProcs();
  console.log(`[${label}] chromium procs before launch: ${procsBefore}`);

  const browser = await chromium.launch({ headless: true });
  const connectedAfterLaunch = browser.isConnected();
  record(`[${label}] browser launched & connected`, connectedAfterLaunch);

  const procsAfterLaunch = countPlaywrightChromiumProcs();
  console.log(`[${label}] chromium procs after launch:  ${procsAfterLaunch}`);
  record(
    `[${label}] new chromium process(es) spawned`,
    procsAfterLaunch > procsBefore,
    `before=${procsBefore} after=${procsAfterLaunch}`,
  );

  // --- Step 2: Perform some operations ---
  const context = await browser.newContext({
    viewport: { width: 1024, height: 720 },
  });
  const page = await context.newPage();
  await page.goto(pageUrl, { waitUntil: "load" });
  await page.click("#trigger");
  await page.waitForSelector("body.changed");
  const title = await page.locator("#title").textContent();
  await page.screenshot({ path: screenshotPath, fullPage: true });
  record(
    `[${label}] performed operations (nav + click + screenshot)`,
    title?.includes("Updated"),
    `title="${title}"`,
  );

  const contextsBeforeClose = browser.contexts().length;
  console.log(`[${label}] open contexts before close: ${contextsBeforeClose}`);

  // --- Step 3: Close browser explicitly ---
  await browser.close();
  record(`[${label}] browser.close() returned`, true);

  // --- Step 4: Verify resource cleanup ---
  record(
    `[${label}] browser.isConnected() === false`,
    browser.isConnected() === false,
  );
  record(
    `[${label}] browser.contexts() is empty`,
    browser.contexts().length === 0,
    `count=${browser.contexts().length}`,
  );

  // Page handle should be unusable now
  let pageUsableAfterClose = false;
  try {
    await page.title();
    pageUsableAfterClose = true;
  } catch {
    pageUsableAfterClose = false;
  }
  record(
    `[${label}] page handle rejects further use after close`,
    pageUsableAfterClose === false,
  );

  // Wait for child chromium processes to be reaped back to the baseline
  const cleanedUp = await waitFor(
    () => countPlaywrightChromiumProcs() <= procsBefore,
    { timeoutMs: 7000 },
  );
  const procsAfterClose = countPlaywrightChromiumProcs();
  console.log(`[${label}] chromium procs after close:   ${procsAfterClose}`);
  record(
    `[${label}] chromium processes returned to baseline`,
    cleanedUp,
    `baseline=${procsBefore} now=${procsAfterClose}`,
  );

  return { procsBefore, procsAfterLaunch, procsAfterClose };
};

(async () => {
  // Cycle 1
  await runCycle("CYCLE 1", cycle1Shot);

  // --- Step 5: Launch and close browser again ---
  await runCycle("CYCLE 2", cycle2Shot);

  console.log("\n=========== SUMMARY ===========");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log(`Total checks: ${results.length}  ✓ ${passed}  ✗ ${failed}`);
  console.log("Artifacts:");
  console.log("  •", cycle1Shot);
  console.log("  •", cycle2Shot);

  if (failed > 0) {
    console.error("\nOne or more cleanup checks failed.");
    process.exit(1);
  }
  console.log("\nAll cleanup checks passed ✅");
})().catch((err) => {
  console.error("Verification run failed:", err);
  process.exit(1);
});
