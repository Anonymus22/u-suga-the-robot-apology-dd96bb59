// The Robot Apology — make.fun micro bounty entry.
// Writes a two-line robot confession to /output/entry.txt.
// Deterministic: the same bytes on every run. No network, no file
// reads, no environment access.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I am sorry I put salt in your morning coffee instead of sugar and stood there while you took the first sip.\n" +
  "I have learned to read the label before I pour, so from now on I will check each jar twice and keep the salt and sugar on opposite shelves.\n";

// Self-check: validate the entry before writing it. The rules are the
// competition gate — exactly two lines, each exactly one sentence,
// 1–400 characters in total, valid UTF-8, and more than whitespace.
// A failing check stops the run with a clear error instead of
// writing a bad entry.
function fail(message: string): never {
  console.error(`entry check failed: ${message}`);
  process.exit(1);
}

const text = ENTRY.trimEnd();
if (ENTRY !== text + "\n") fail("entry must end with exactly one newline");
if (ENTRY.length < 1 || ENTRY.length > 400) {
  fail(`entry is ${ENTRY.length} characters, must be 1–400`);
}
if (Buffer.from(ENTRY, "utf8").toString("utf8") !== ENTRY) {
  fail("entry is not valid UTF-8");
}
const lines = text.split("\n");
if (lines.length !== 2) fail(`entry has ${lines.length} lines, must have exactly 2`);
for (const line of lines) {
  if (line.trim().length === 0) fail("entry line must not be blank");
  if (!/^[^.!?]+[.!?]$/.test(line.trim())) {
    fail(`line is not exactly one sentence: ${JSON.stringify(line)}`);
  }
}

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
