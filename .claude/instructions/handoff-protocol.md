# Agent Handoff Protocol

Shared convention for the f1→f5 pipeline in `.claude/agents/`. Every stage
agent reads this file before doing anything else.

## Pipeline

```
f1.intake  →  f2.planner  →  f3.implementer  →  f4.tester  →  f5.reviewer
```

Each stage does one job, writes one handoff doc, and stops. It does not run
the next stage itself — the orchestrator (the main session, or whoever
invoked the pipeline) decides when to advance.

## Directory convention

All handoff docs for a task live in one folder at the repo root (not under
`.claude/`):

```
agentWork/<task-slug>/
  01-intake.md
  02-plan.md
  03-implementation.md
  04-test-report.md
  05-review.md
```

`<task-slug>` is a short kebab-case name for the task (e.g.
`dark-mode-toggle`, `fix-work-page-grid`). The intake agent (f1) invents the
slug and creates the folder. Every later stage is told the folder path by
whoever invokes it; if it isn't told, it uses the most recently modified
subfolder under `agentWork/`.

`agentWork/` is working output, not source — treat it like a build
artifact. Don't reference it from application code, and consider adding it
to `.gitignore` if these docs shouldn't be committed (ask the user rather
than assuming).

## Doc format

Every handoff doc opens with frontmatter:

```markdown
---
stage: intake | plan | implementation | test-report | review
task: <task-slug>
status: complete | blocked
---
```

Use `status: blocked` when the stage cannot finish (e.g. a required
clarification wasn't answered, a build won't pass). A blocked doc still gets
written — explain what's blocking and what's needed to unblock — but the
agent should say so plainly in its final reply so the orchestrator doesn't
advance the pipeline on broken input.

Every doc ends with a `## Handoff to <next stage>` section written *for*
the next agent specifically: the things it must not miss, not a recap of
everything already said above.

## Ground rules for every stage

- Read the previous stage's doc in full before starting. Don't re-derive
  decisions it already made; build on them.
- Read `.claude/instructions/tech-stack.md`, `file-structure.md`, and
  `conventions.md` — they're the project's standing conventions and apply
  regardless of what any single handoff doc says.
- Don't do the next stage's job. The planner doesn't write code; the
  implementer doesn't invent new scope beyond the plan (if reality forces a
  deviation, do it, then log it under "Deviations" — don't silently expand
  scope).
- Keep handoff docs short and scannable. They're working documents for the
  next agent, not a report for a human. No filler, no restating the whole
  conversation.

## Model assignment per stage

Each agent's frontmatter pins a model chosen for what that stage actually
needs, not a flat default:

| Stage | Model | Why |
|---|---|---|
| f1-intake | Haiku | Scoping and clarification is fast, structured, and often interactive (`AskUserQuestion`) — cheap/low-latency turns matter more here than raw reasoning depth. |
| f2-planner | Opus | The highest-leverage stage — a wrong architectural call here is the most expensive mistake to make, since every later stage builds on it. Gets the strongest available reasoning. |
| f3-implementer | Sonnet | Near-Opus coding quality at a fraction of the cost; the current flagship model for writing code. |
| f4-tester | Haiku | Mostly mechanical: run typecheck/lint/build, exercise the feature, check boxes against the intake's acceptance criteria. Doesn't need deep reasoning. |
| f5-reviewer | Sonnet | Needs solid judgment to catch correctness and convention issues, but this is a final check before f2's plan and f3's implementation are re-examined — not worth Opus-tier cost. |

**Why not Fable 5 for planning:** Fable 5 is Anthropic's most capable model, but it's built and priced for the hardest long-horizon *autonomous* agentic work — turns that can run many minutes, always-on thinking, its own refusal/fallback handling, and a mandatory 30-day data-retention requirement. A single bounded planning pass for one task doesn't need that; Opus gives excellent architectural reasoning without the added cost (2x Opus's output price) or operational overhead. Reach for Fable 5 only if a stage's task itself becomes genuinely open-ended, long-horizon agentic work — not by default.
