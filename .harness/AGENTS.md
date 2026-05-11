# AGENTS.md — Entry Point for AI Agents

> This repository uses a Multi-Agent Orchestration system. Follow the map.

## 1. Mandatory Startup

1. Read `progress/current.md` to understand the current state.
2. Read `feature_list.json` and pick ONE task with `pending` status.
3. Check `docs/architecture.md` to understand the quality standards.

## 2. Repository Map

| File / Folder          | Content                              | When to read          |
| ---------------------- | ------------------------------------ | --------------------- |
| `feature_list.json`    | Task list with status                | Every time you start  |
| `docs/architecture.md` | The "Definition of Done"             | Before implementing   |
| `docs/skills/`         | Expert knowledge (A11y, Perf, Style) | During implementation |
| `.harness/agents/`     | Agent role definitions               | For orchestration     |
| `src/assets/`          | Fonts, Logos, Icons, Images          | When styling          |

## 3. Hard Rules

- **One feature at a time.** No scope creep.
- **Atomic Commits.** Implementation + Tests = Done.
- **Zero Hallucination.** If an asset is missing in `src/assets/`, report as `blocked`.
