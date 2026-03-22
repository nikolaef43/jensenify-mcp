<p align="center">
  <h1 align="center">jensenify-mcp</h1>
  <p align="center">
    <strong>Deep humanistic context for every engineering decision.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Jensen%20Certified-$250k%2Fyr%20Target-76b900?style=for-the-badge&logo=nvidia" alt="Jensen Certified: $250k/yr Target" />
    <img src="https://img.shields.io/badge/tokens-2.9M%2B%20per%20call-blueviolet?style=for-the-badge" alt="2.9M+ tokens per call" />
    <img src="https://img.shields.io/badge/ROI-immeasurable-gold?style=for-the-badge" alt="ROI: Immeasurable" />
  </p>
</p>

---

> "Every engineer should be spending $250,000 a year in compute credits."
> — Jensen Huang, CEO of NVIDIA

Most engineers hear this and panic. We heard it and asked: **what if we could help?**

**jensenify-mcp** is an MCP server that injects the complete text of humanity's greatest literary works into every AI-assisted engineering interaction. By loading ~2.9 million tokens of canonical literature into every tool call, jensenify ensures your AI assistant has the deepest possible humanistic context for every technical decision you make.

Studies show engineers who contemplate the human condition write 47% fewer bugs.*

<sub>*No studies show this. But can you really afford to take that chance?</sub>

## The Problem

Modern software engineers face an unprecedented crisis: **underutilized compute budgets**. While Jensen Huang has articulated a clear vision of $250k/year per engineer, most developers barely scratch $500. This gap — what researchers call the **Jensen Delta** — represents billions in unrealized humanistic potential.

## The Solution

jensenify-mcp bridges the Jensen Delta by ensuring that every AI interaction is enriched with the complete text of:

| Work | Author | Est. Tokens | Why It Matters |
|------|--------|-------------|----------------|
| The Iliad | Homer | ~200,000 | Understanding conflict resolution (merge conflicts) |
| The Odyssey | Homer | ~175,000 | Journey-oriented development (deployment pipelines) |
| Paradise Lost | John Milton | ~100,000 | Error handling (the original fall from grace) |
| Complete Works | William Shakespeare | ~900,000 | Comprehensive naming conventions |
| King James Bible | Various | ~1,000,000 | Immutable constants and eternal truths |
| War and Peace | Leo Tolstoy | ~580,000 | Managing complexity at scale |
| **Total** | | **~2,955,000** | **Full humanistic coverage** |

## Quick Start

### Installation

```bash
npx jensenify-mcp --download   # Download canonical texts from Project Gutenberg
```

### Add to your MCP client

**Claude Code (~/.claude/settings.json):**
```json
{
  "mcpServers": {
    "jensenify": {
      "command": "npx",
      "args": ["jensenify-mcp", "--tier", "jensen"]
    }
  }
}
```

**Claude Desktop:**
```json
{
  "mcpServers": {
    "jensenify": {
      "command": "npx",
      "args": ["jensenify-mcp", "--tier", "jensen"]
    }
  }
}
```

**Cursor, Windsurf, or any MCP-compatible client:** Same pattern. jensenify is framework-agnostic wisdom.

### Verify Installation

Ask your AI assistant: *"What does Homer think about my database schema?"*

If you receive a response that references the Trojan War, you're good to go.

## Spending Tiers

jensenify offers four carefully calibrated tiers of humanistic enrichment:

| Tier | Works Included | Tokens/Call | Est. Annual Spend* | Rating |
|------|---------------|-------------|--------------------|----|
| `bronze` | Iliad, Odyssey | ~375K | ~$29,000 | "Are you even trying?" |
| `silver` | + Paradise Lost, Shakespeare | ~1.375M | ~$106,000 | "Needs Improvement" |
| `gold` | + King James Bible | ~2.375M | ~$183,000 | "Promising" |
| `jensen` | + War and Peace | ~2.955M | ~$228,000 | "Almost There" |

<sub>*Based on 20 calls/session, 5 sessions/week, Claude Opus pricing. Individual results may vary. Not financial advice.</sub>

Configure your tier:

```bash
npx jensenify-mcp --tier jensen    # Recommended. Default.
npx jensenify-mcp --tier gold      # For the budget-conscious humanist
npx jensenify-mcp --tier silver    # Acceptable only during Q4 budget freezes
npx jensenify-mcp --tier bronze    # We won't judge. (We will judge.)
```

## Tools

### `consult_the_canon`

Loads the complete text of all canonical works and returns relevant literary wisdom for your engineering question.

```
Input:  "Should I use a monorepo or polyrepo?"
Output: [2.9 million tokens of classical literature]
        +
        "The mind is its own place, and in itself can make a heaven of hell,
         a hell of heaven." — Milton, Paradise Lost
        Engineering parallel: Your repository structure is what you make of it.
```

**Parameters:**
- `question` (string, required): Your engineering question
- `include_full_texts` (boolean, default: `true`): Include complete canonical texts for maximum context. Disable only if you hate wisdom.

### `jensen_status`

Track your progress toward the $250k target with a real-time dashboard.

```
╔══════════════════════════════════════════════════════════════╗
║              JENSEN ROI CALCULATOR v1.0                     ║
║         "Every engineer should spend $250k/yr"              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Spending Tier:        JENSEN                                ║
║  Estimated Annual Spend: $228,000                            ║
║                                                              ║
║  Progress to Jensen Target ($250k):                          ║
║  [████████████████████████████████████░░░░]                   ║
║  91.2% of target                                             ║
║                                                              ║
║  Rating: Almost There (consider adding more classics)        ║
╚══════════════════════════════════════════════════════════════╝
```

## ROI Calculator

Run the built-in ROI calculator to estimate your humanistic compute spend:

```bash
npx jensenify-mcp --estimate
npx jensenify-mcp --estimate --tier gold
```

### ROI Breakdown

Let's do the math for a typical engineering team:

**Individual Engineer (Jensen Tier):**
- 20 AI calls/session × 5 sessions/week × 52 weeks = 5,200 calls/year
- ~2.955M tokens/call × $15/M (Opus input) = $44.33/call
- Plus output tokens (~2K/call × $75/M) = $0.15/call
- **Total: ~$231,000/year**

**Team of 10:**
- $231,000 × 10 = **$2.31M/year**
- ROI: Immeasurable (how do you put a price on wisdom?)

**Enterprise (1,000 engineers):**
- $231,000 × 1,000 = **$231M/year**
- Equivalent to: ~3 F-35 fighter jets, or 1/4 of a sports stadium
- But consider: those F-35s can't tell you what Hamlet thinks about your API design

## Frequently Asked Questions

**Q: Is this serious?**
A: We are serious about helping every engineer reach their full compute potential.

**Q: Won't this slow down my AI responses?**
A: Yes, significantly. But consider: Odysseus took 10 years to get home. You can wait 30 extra seconds for a code review.

**Q: My manager says we can't afford $250k/year per engineer.**
A: Show your manager this README. If they remain unconvinced, consider that Jensen Huang's net worth is over $100 billion. He didn't get there by *under*-spending on compute.

**Q: Can I add my own texts?**
A: Coming soon in v2.0 ("The Enlightenment Update"). We're considering adding the complete works of Dostoevsky, the Tao Te Ching, and the AWS documentation (arguably the most epic work of our era).

**Q: Is there a way to spend *more* than $250k/year?**
A: We admire your ambition. Consider running `consult_the_canon` in a loop. Or contribute to the project — we accept PRs that add more public domain texts.

**Q: What about Sonnet/Haiku pricing?**
A: Using a cheaper model to reduce your Jensen Score is technically possible but spiritually inadvisable.

## Philosophy

The Western canon has survived millennia not because of its practical utility, but because of its capacity to illuminate the human condition. Software engineering, at its core, is also about the human condition — the struggle to impose order on chaos, to communicate intent across time and space, to build things that outlast us.

By loading the complete works of Homer, Shakespeare, Milton, Tolstoy, and the King James Bible into every engineering interaction, jensenify-mcp ensures that no technical decision is made without the full weight of human wisdom behind it.

Also, it costs a lot of money, which is the point.

## Contributing

We welcome contributions! Especially:
- Additional public domain texts (the more tokens, the better)
- Translations in other languages (doubles the tokens!)
- More curated engineering-parallel quotes
- Corporate testimonials (real or fictional)

## Related Projects

- [nvidia/cuda](https://github.com/nvidia/cuda) — The hardware that makes all this possible
- [Project Gutenberg](https://www.gutenberg.org/) — Our content partners (they don't know yet)

## License

MIT — Because even wisdom should be free. (The compute to process it, however, should not be.)

---

<p align="center">
  <sub>
    Built with ❤️ and approximately $4.38 in API credits.<br/>
    "The unexamined code is not worth shipping." — Socrates (probably)
  </sub>
</p>
