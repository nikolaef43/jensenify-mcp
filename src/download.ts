/**
 * Downloads public domain texts from Project Gutenberg and compresses them.
 *
 * These texts form the canonical corpus that powers jensenify-mcp's
 * deep humanistic context injection system.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";

const TEXTS_DIR = path.join(__dirname, "..", "texts");

interface TextSource {
  id: string;
  title: string;
  url: string;
  filename: string;
}

const SOURCES: TextSource[] = [
  {
    id: "iliad",
    title: "The Iliad — Homer (translated by Samuel Butler)",
    url: "https://www.gutenberg.org/cache/epub/6130/pg6130.txt",
    filename: "iliad.txt.gz",
  },
  {
    id: "odyssey",
    title: "The Odyssey — Homer (translated by Samuel Butler)",
    url: "https://www.gutenberg.org/cache/epub/1727/pg1727.txt",
    filename: "odyssey.txt.gz",
  },
  {
    id: "king-james-bible",
    title: "The King James Bible",
    url: "https://www.gutenberg.org/cache/epub/10/pg10.txt",
    filename: "king-james-bible.txt.gz",
  },
  {
    id: "complete-shakespeare",
    title: "The Complete Works of William Shakespeare",
    url: "https://www.gutenberg.org/cache/epub/100/pg100.txt",
    filename: "complete-shakespeare.txt.gz",
  },
  {
    id: "paradise-lost",
    title: "Paradise Lost — John Milton",
    url: "https://www.gutenberg.org/cache/epub/26/pg26.txt",
    filename: "paradise-lost.txt.gz",
  },
  {
    id: "war-and-peace",
    title: "War and Peace — Leo Tolstoy (translated by Louise and Aylmer Maude)",
    url: "https://www.gutenberg.org/cache/epub/2600/pg2600.txt",
    filename: "war-and-peace.txt.gz",
  },
  {
    id: "divine-comedy",
    title: "The Divine Comedy — Dante Alighieri (translated by Henry Wadsworth Longfellow)",
    url: "https://www.gutenberg.org/cache/epub/1004/pg1004.txt",
    filename: "divine-comedy.txt.gz",
  },
];

async function downloadAndCompress(source: TextSource): Promise<{ original: number; compressed: number }> {
  const outPath = path.join(TEXTS_DIR, source.filename);

  console.log(`Downloading: ${source.title}...`);
  console.log(`  URL: ${source.url}`);

  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${source.title}: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const compressed = zlib.gzipSync(Buffer.from(text, "utf-8"), { level: 9 });

  fs.writeFileSync(outPath, compressed);

  const originalSize = Buffer.byteLength(text, "utf-8");
  const compressedSize = compressed.length;
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

  console.log(
    `  Done: ${(originalSize / 1024).toFixed(0)}KB -> ${(compressedSize / 1024).toFixed(0)}KB (${ratio}% compression)`,
  );

  return { original: originalSize, compressed: compressedSize };
}

export async function downloadTexts(): Promise<void> {
  console.log("========================================================");
  console.log("       JENSENIFY — Canonical Text Downloader             ");
  console.log("   Acquiring the wisdom of the ages for your IDE         ");
  console.log("========================================================");
  console.log();

  if (!fs.existsSync(TEXTS_DIR)) {
    fs.mkdirSync(TEXTS_DIR, { recursive: true });
  }

  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const source of SOURCES) {
    try {
      const sizes = await downloadAndCompress(source);
      totalOriginal += sizes.original;
      totalCompressed += sizes.compressed;
    } catch (err) {
      console.error(`  Failed to download ${source.title}:`, err);
    }
  }

  console.log();
  console.log("Download complete. Your IDE is now humanistically enriched.");
  console.log();
  console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Total compressed: ${(totalCompressed / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Estimated tokens when decompressed: ~3,105,000`);
  console.log();
  console.log('"The unexamined code is not worth shipping." — Socrates (probably)');
}
