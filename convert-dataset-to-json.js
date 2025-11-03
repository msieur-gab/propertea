#!/usr/bin/env node

/**
 * Convert Dataset Files to Valid JSON
 * Converts JavaScript object literals to proper JSON format
 * Handles unquoted keys, single quotes, and trailing commas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetDir = path.join(__dirname, '_dataset');

/**
 * Convert JavaScript object notation to valid JSON
 */
function convertToValidJSON(content) {
  // Step 1: Remove export default statement if present
  let cleaned = content.replace(/^export\s+default\s+/, '').trim();

  // Step 2: Remove trailing semicolon
  if (cleaned.endsWith(';')) {
    cleaned = cleaned.slice(0, -1).trim();
  }

  // Step 3: Replace unquoted keys with quoted keys
  // Matches: {key: or ,key: pattern
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  // Step 4: Replace single quotes with double quotes (but not in URLs or already escaped)
  // More careful approach: only replace non-escaped single quotes around values
  cleaned = cleaned.replace(/:\s*'([^']*?)'/g, ': "$1"');
  cleaned = cleaned.replace(/,\s*'([^']*?)'/g, ', "$1"');

  // Step 5: Wrap in array brackets if not already an array
  if (!cleaned.trim().startsWith('[')) {
    cleaned = '[' + cleaned + ']';
  }

  // Step 6: Parse and re-stringify to validate and clean up formatting
  const parsed = JSON.parse(cleaned);
  return JSON.stringify(parsed, null, 2);
}

/**
 * Main execution
 */
function main() {
  console.log('📋 Converting Dataset Files to Valid JSON\n');

  const files = fs.readdirSync(datasetDir)
    .filter(file => file.endsWith('.json'))
    .sort();

  console.log(`Found ${files.length} files to convert:\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(datasetDir, file);

    try {
      // Read the file
      const content = fs.readFileSync(filePath, 'utf-8');

      // Convert to valid JSON
      const validJSON = convertToValidJSON(content);

      // Write back to file
      fs.writeFileSync(filePath, validJSON + '\n');

      console.log(`✓ ${file}`);
      successCount++;
    } catch (error) {
      console.log(`✗ ${file}`);
      console.log(`  Error: ${error.message}\n`);
      errorCount++;
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Conversion Summary:`);
  console.log(`   Successfully converted: ${successCount}`);
  console.log(`   Failed: ${errorCount}`);
  console.log(`   Total: ${successCount + errorCount}`);
  console.log(`${'='.repeat(60)}\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
