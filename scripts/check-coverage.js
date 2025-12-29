#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const threshold = Number(process.env.COVERAGE_THRESHOLD || '80');
const targets = [
  {
    name: 'frontend',
    file: path.resolve(__dirname, '..', 'target/test-results/coverage-summary.json'),
  },
  {
    name: 'backend',
    file: path.resolve(__dirname, '..', 'server/coverage/coverage-summary.json'),
  },
];

let hasError = false;

for (const target of targets) {
  if (!fs.existsSync(target.file)) {
    console.error(`Coverage summary missing for ${target.name}: ${target.file}`);
    hasError = true;
    continue;
  }

  let summary;
  try {
    summary = JSON.parse(fs.readFileSync(target.file, 'utf8'));
  } catch (error) {
    console.error(`Failed to read coverage summary for ${target.name}: ${error.message}`);
    hasError = true;
    continue;
  }

  const pct = summary?.total?.statements?.pct ?? 0;
  console.log(`${target.name} statements coverage: ${pct}%`);

  if (pct < threshold) {
    console.error(`${target.name} coverage ${pct}% is below required ${threshold}%.`);
    hasError = true;
  }
}

if (hasError) {
  console.error('Coverage check failed.');
  process.exit(1);
}

console.log(`Coverage threshold ${threshold}% satisfied for all targets.`);
