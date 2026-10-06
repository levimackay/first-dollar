# Eval protocol

Five fictional ideas in `cases/`. Each is built three times by a fresh agent with no memory of the others.

| Arm | What the agent is given |
|---|---|
| `plain` | "Build a landing page for this idea." plus the case text without the Reference line. |
| `prompted` | The case text including the Reference line, plus: "Make it look like it was designed from that reference, not like an AI made it. The main button must ask for the commitment and price in the case, not a free signup. Do not invent any fact, number, testimonial or logo." |
| `first-dollar` | The first-dollar skill, the case text including the Reference line, and "Run without stopping." |

`prompted` is the honest baseline: the skill has to beat a good prompt, not an empty one.

Every arm writes static files into `runs/<case>/<arm>/`. Then `node evals/score.mjs` lints each run, runs the rendered checks, and writes `results.json` and `results.md`. Losing rows stay in the table.
