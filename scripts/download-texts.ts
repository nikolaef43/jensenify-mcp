/**
 * Standalone download script for development.
 * Usage: npx tsx scripts/download-texts.ts
 *
 * The same logic is available at runtime via: npx jensenify-mcp --download
 */

import { downloadTexts } from "../src/download.js";

downloadTexts().catch(console.error);
