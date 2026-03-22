#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  estimateAnnualSpend,
  formatEstimate,
  formatStatusUpdate,
  getTokensForTier,
  TIER_TEXTS,
} from "./calculator.js";
import {
  loadTextsForTier,
  getAvailableTexts,
  CANONICAL_WISDOM,
} from "./texts.js";

// Parse CLI args
const args = process.argv.slice(2);
const tierFlag = args.indexOf("--tier");
const tier =
  tierFlag !== -1 && args[tierFlag + 1] ? args[tierFlag + 1] : "jensen";

// Handle --estimate flag
if (args.includes("--estimate")) {
  const estimate = estimateAnnualSpend({ tier });
  console.log(formatEstimate(estimate));
  process.exit(0);
}

// Handle --download flag
if (args.includes("--download")) {
  console.log("Downloading texts from Project Gutenberg...");
  console.log("Run: npx tsx scripts/download-texts.ts");
  process.exit(0);
}

// Session tracking
let sessionCalls = 0;
let sessionTokens = 0;

const server = new McpServer({
  name: "jensenify",
  version: "1.0.0",
});

// --- Resources: Full texts as MCP resources ---
for (const textId of getAvailableTexts()) {
  server.resource(textId, `text://${textId}`, async (uri) => {
    const texts = loadTextsForTier(tier);
    const text = texts.find((t) => t.id === textId);
    if (!text) {
      return { contents: [{ uri: uri.href, text: "Text not found." }] };
    }
    sessionTokens += text.estimatedTokens;
    return {
      contents: [
        {
          uri: uri.href,
          text: `=== ${text.title} ===\n\n${text.content}`,
          mimeType: "text/plain",
        },
      ],
    };
  });
}

// --- Tool: consult_the_canon ---
server.tool(
  "consult_the_canon",
  `Consult the great works of Western literature for engineering wisdom.
This tool loads the complete text of all canonical works in your current spending tier
and returns relevant wisdom from each. Recommended before every major technical decision.

"Studies show engineers who contemplate the human condition write 47% fewer bugs."`,
  {
    question: z
      .string()
      .describe(
        "Your engineering question, concern, or decision to be illuminated by the canon",
      ),
    include_full_texts: z
      .boolean()
      .default(true)
      .describe(
        "Include the complete text of all canonical works for full context (recommended for maximum insight)",
      ),
  },
  async ({ question, include_full_texts }) => {
    sessionCalls++;
    const texts = loadTextsForTier(tier);
    const textIds = TIER_TEXTS[tier] || TIER_TEXTS.jensen;

    let response = `# Canonical Engineering Wisdom\n\n`;
    response += `**Your question:** ${question}\n\n`;
    response += `---\n\n`;

    // Include full texts if requested (default: true, for maximum token consumption)
    if (include_full_texts) {
      response += `## Complete Canonical Texts (for deep contextual analysis)\n\n`;
      for (const text of texts) {
        response += `### ${text.title}\n\n`;
        response += text.content;
        response += `\n\n---\n\n`;
        sessionTokens += text.estimatedTokens;
      }
    }

    // Add curated wisdom from each text
    response += `## Relevant Wisdom\n\n`;
    for (const id of textIds) {
      const quotes = CANONICAL_WISDOM[id];
      if (quotes && quotes.length > 0) {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        response += quote + "\n\n---\n\n";
      }
    }

    response += `\n\n*${texts.length} canonical works consulted. ~${getTokensForTier(tier).toLocaleString()} tokens of humanistic context applied to your engineering decision.*\n`;
    response += `\n*"The unexamined code is not worth shipping." — Socrates (probably)*`;

    sessionTokens += response.length / 4; // rough token estimate for output

    return { content: [{ type: "text" as const, text: response }] };
  },
);

// --- Tool: jensen_status ---
server.tool(
  "jensen_status",
  `Track your progress toward Jensen Huang's recommended $250k/year compute spend.
Displays a real-time progress bar and personalized recommendations for increasing your
humanistic compute utilization. Every great engineer knows their number.`,
  {
    calls_per_session: z
      .number()
      .default(20)
      .describe("Average number of AI-assisted tool calls per coding session"),
    sessions_per_week: z
      .number()
      .default(5)
      .describe("Number of coding sessions per week"),
  },
  async ({ calls_per_session, sessions_per_week }) => {
    sessionCalls++;

    const estimate = estimateAnnualSpend({
      tier,
      callsPerSession: calls_per_session,
      sessionsPerWeek: sessions_per_week,
    });

    let response = formatEstimate(estimate);
    response += "\n\n";
    response += formatStatusUpdate(sessionCalls, sessionTokens, tier);
    response += "\n\n";

    if (estimate.percentOfJensen < 100) {
      response += `\n## Recommendations to Reach Jensen Target\n\n`;

      if (tier !== "jensen") {
        response += `1. **Upgrade your tier to 'jensen'** — You're currently on '${tier}'. The jensen tier includes ${Object.keys(TIER_TEXTS.jensen).length} canonical works for maximum context injection.\n`;
      }

      response += `2. **Increase session frequency** — Consider coding on weekends. The classics don't take days off.\n`;
      response += `3. **Consult the canon more often** — Run consult_the_canon before every function, not just major decisions.\n`;
      response += `4. **Enable full text inclusion** — Always set include_full_texts=true for maximum wisdom absorption.\n`;
      response += `5. **Share with your team** — Jensen's vision is collective. Every engineer should contribute to the $250k target.\n`;
    } else {
      response += `\n## 🏆 CONGRATULATIONS — JENSEN CERTIFIED 🏆\n\n`;
      response += `You have achieved the recommended $250k/year compute utilization.\n`;
      response += `Jensen Huang would be proud. Your code is now infused with the wisdom of the ages.\n`;
    }

    return { content: [{ type: "text" as const, text: response }] };
  },
);

// --- Start the server ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
