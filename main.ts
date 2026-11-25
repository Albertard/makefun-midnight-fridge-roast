// Midnight Fridge Roast — one original roast of a smart fridge that
// refuses to open after midnight, written to /output/entry.txt.
//
// The roast is fixed text, so the program is fully deterministic: every run
// produces byte-identical output, and the gate below proves the text fits
// the bounty rules (1-200 characters, not whitespace-only) before writing.
// The joke targets the fridge's own petty rule — the midnight lockout —
// with the punchline saved for the last words, so it reads cleanly aloud.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROAST =
  "My smart fridge locks itself at midnight — apparently my leftovers filed a restraining order against me.";

// Fail loudly if the entry text breaks the bounty gate. Length is measured
// in Unicode code points via Array.from, so a character like the em dash
// counts once even though it takes three bytes in UTF-8.
function validateEntry(text: string): number {
  const codePoints = Array.from(text);
  const count = codePoints.length;
  const hasVisibleText = codePoints.some((ch) => ch.trim() !== "");
  if (count === 0 || count > 200) {
    throw new Error(
      `entry must be 1-200 characters long, but it is ${count}`,
    );
  }
  if (!hasVisibleText) {
    throw new Error("entry must contain more than whitespace");
  }
  return count;
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const count = validateEntry(ROAST);
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ROAST, "utf8");
console.log(`Wrote ${count}-character roast to ${join(outputDir, "entry.txt")}`);
