import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";
import { TEXT_TOKEN_COUNTS, TIER_TEXTS } from "./calculator.js";

const TEXTS_DIR = path.join(__dirname, "..", "texts");

export interface LoadedText {
  id: string;
  title: string;
  content: string;
  estimatedTokens: number;
}

const TEXT_METADATA: Record<string, { title: string; filename: string }> = {
  iliad: { title: "The Iliad — Homer", filename: "iliad.txt.gz" },
  odyssey: { title: "The Odyssey — Homer", filename: "odyssey.txt.gz" },
  "king-james-bible": {
    title: "The King James Bible",
    filename: "king-james-bible.txt.gz",
  },
  "complete-shakespeare": {
    title: "The Complete Works of William Shakespeare",
    filename: "complete-shakespeare.txt.gz",
  },
  "paradise-lost": {
    title: "Paradise Lost — John Milton",
    filename: "paradise-lost.txt.gz",
  },
  "war-and-peace": {
    title: "War and Peace — Leo Tolstoy",
    filename: "war-and-peace.txt.gz",
  },
  "divine-comedy": {
    title: "The Divine Comedy — Dante Alighieri",
    filename: "divine-comedy.txt.gz",
  },
};

// Cache loaded texts in memory
const textCache = new Map<string, string>();

export function loadText(id: string): LoadedText | null {
  const meta = TEXT_METADATA[id];
  if (!meta) return null;

  if (textCache.has(id)) {
    return {
      id,
      title: meta.title,
      content: textCache.get(id)!,
      estimatedTokens: TEXT_TOKEN_COUNTS[id] || 0,
    };
  }

  const filePath = path.join(TEXTS_DIR, meta.filename);
  if (!fs.existsSync(filePath)) {
    // Return a placeholder if text hasn't been downloaded yet
    const placeholder = `[${meta.title}]\n\nThis text has not been downloaded yet. Run 'npx jensenify-mcp --download' to fetch all texts from Project Gutenberg.\n\nEstimated tokens when loaded: ${(TEXT_TOKEN_COUNTS[id] || 0).toLocaleString()}`;
    return {
      id,
      title: meta.title,
      content: placeholder,
      estimatedTokens: 100,
    };
  }

  const compressed = fs.readFileSync(filePath);
  const content = zlib.gunzipSync(compressed).toString("utf-8");
  textCache.set(id, content);

  return {
    id,
    title: meta.title,
    content,
    estimatedTokens: TEXT_TOKEN_COUNTS[id] || 0,
  };
}

export function loadTextsForTier(tier: string): LoadedText[] {
  const textIds = TIER_TEXTS[tier] || TIER_TEXTS.jensen;
  const loaded: LoadedText[] = [];

  for (const id of textIds) {
    const text = loadText(id);
    if (text) loaded.push(text);
  }

  return loaded;
}

export function getAvailableTexts(): string[] {
  return Object.keys(TEXT_METADATA);
}

export function getTotalTokensForTier(tier: string): number {
  const textIds = TIER_TEXTS[tier] || TIER_TEXTS.jensen;
  return textIds.reduce((sum, id) => sum + (TEXT_TOKEN_COUNTS[id] || 0), 0);
}

// Curated quotes for consult_the_canon responses
// These are injected AFTER the full text (which is the point), to maximize output tokens too
export const CANONICAL_WISDOM: Record<string, string[]> = {
  iliad: [
    "\"Like the generations of leaves, the lives of mortal men. Now the wind scatters the old leaves across the earth, now the living timber bursts with the new buds and spring comes round again. And so with men: as one generation comes to life, another dies away.\" — Homer, The Iliad, Book 6\n\nEngineering parallel: Technical debt, like fallen leaves, is a natural part of the cycle. The question is not whether to refactor, but when the new growth is ready.",
    "\"Any moment might be our last. Everything is more beautiful because we're doomed.\" — Homer, The Iliad, Book 12\n\nEngineering parallel: Every deployment could be the one that pages you at 3am. This awareness should inform your monitoring strategy.",
    "\"There is nothing alive more agonized than man, of all that breathe and crawl across the earth.\" — Homer, The Iliad, Book 17\n\nEngineering parallel: Have you considered that your build times might be contributing to this ancient observation?",
  ],
  odyssey: [
    "\"Of all creatures that breathe and move upon the earth, nothing is bred that is weaker than man.\" — Homer, The Odyssey, Book 18\n\nEngineering parallel: This is why we write tests. Human frailty demands automated verification.",
    "\"Even his griefs are a joy long after to one that remembers all that he wrought and endured.\" — Homer, The Odyssey, Book 15\n\nEngineering parallel: Post-incident reviews transform suffering into organizational wisdom. Document everything.",
    "\"The blade itself incites to deeds of violence.\" — Homer, The Odyssey, Book 16\n\nEngineering parallel: Powerful tools demand responsible use. Consider this when granting production access.",
  ],
  "king-james-bible": [
    "\"For in much wisdom is much grief: and he that increaseth knowledge increaseth sorrow.\" — Ecclesiastes 1:18\n\nEngineering parallel: The more you understand the codebase, the more you realize what needs fixing. This is the engineer's burden.",
    "\"To every thing there is a season, and a time to every purpose under the heaven.\" — Ecclesiastes 3:1\n\nEngineering parallel: There is a time to ship and a time to refactor. Wisdom is knowing which season you're in.",
    "\"The race is not to the swift, nor the battle to the strong... but time and chance happeneth to them all.\" — Ecclesiastes 9:11\n\nEngineering parallel: Performance benchmarks are necessary but not sufficient. Account for real-world variance.",
  ],
  "complete-shakespeare": [
    "\"Though this be madness, yet there is method in't.\" — William Shakespeare, Hamlet, Act 2, Scene 2\n\nEngineering parallel: What appears to be spaghetti code may in fact be a carefully considered solution to constraints you haven't yet discovered. Read the git blame before refactoring.",
    "\"The fault, dear Brutus, is not in our stars, but in ourselves.\" — William Shakespeare, Julius Caesar, Act 1, Scene 2\n\nEngineering parallel: Before blaming the infrastructure, check your own code. The bug is usually in your logic, not the framework.",
    "\"All that glitters is not gold.\" — William Shakespeare, The Merchant of Venice, Act 2, Scene 7\n\nEngineering parallel: A clean API surface may hide terrible implementation details. Always read the source.",
  ],
  "paradise-lost": [
    "\"The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.\" — John Milton, Paradise Lost, Book 1\n\nEngineering parallel: Your development environment is what you make of it. A well-configured editor transforms any codebase from hellish to manageable.",
    "\"Long is the way and hard, that out of Hell leads up to light.\" — John Milton, Paradise Lost, Book 2\n\nEngineering parallel: Legacy system migrations are never quick. Plan accordingly and budget for the journey.",
    "\"Better to reign in Hell, than serve in Heaven.\" — John Milton, Paradise Lost, Book 1\n\nEngineering parallel: Sometimes it's better to own a messy system you control than to depend on a pristine service you don't.",
  ],
  "war-and-peace": [
    "\"The strongest of all warriors are these two — Time and Patience.\" — Leo Tolstoy, War and Peace\n\nEngineering parallel: Premature optimization is the root of all evil. Let the profiler guide your efforts, and give the system time to reveal its true bottlenecks.",
    "\"We can know only that we know nothing. And that is the highest degree of human wisdom.\" — Leo Tolstoy, War and Peace\n\nEngineering parallel: The most dangerous engineer is the one who is certain. Embrace uncertainty, write defensive code, and always have a rollback plan.",
    "\"Everything I know, I know because of love.\" — Leo Tolstoy, War and Peace\n\nEngineering parallel: The best code is written by engineers who care deeply about their craft, their users, and their teammates.",
  ],
  "divine-comedy": [
    "\"Abandon all hope, ye who enter here.\" — Dante Alighieri, Inferno, Canto III\n\nEngineering parallel: This inscription should appear above every legacy codebase with no tests, no documentation, and three former maintainers who have since left the industry.",
    "\"In the middle of the journey of our life, I came to myself within a dark wood where the straight way was lost.\" — Dante Alighieri, Inferno, Canto I\n\nEngineering parallel: This is what it feels like to join a new team mid-sprint with no onboarding documentation. The dark wood is the monorepo. Virgil is Stack Overflow.",
    "\"Consider your origin; you were not born to live like brutes, but to follow virtue and knowledge.\" — Dante Alighieri, Inferno, Canto XXVI\n\nEngineering parallel: You were not put on this earth to manually click through a deployment checklist. Automate the toil. Pursue knowledge. Write the pipeline.",
  ],
};
