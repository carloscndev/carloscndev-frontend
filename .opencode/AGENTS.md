---
name: agent-orchestrator
description: Entry point and behavioral framework for the Multi-Agent system. Defines mandatory startup protocols, repository mapping, and immutable engineering rules.
---

# Agent Orchestration System

This repository operates under a **Multi-Agent Orchestration** framework. All agents must adhere to the protocols defined herein to ensure architectural integrity and design precision.

## 1. Mandatory Startup Protocol

Before executing any action, agents must perform the following sequence:

1.  **Context Synchronization**: Read `.harness/history.log` and `task_list.json` to synchronize with the current project state.
2.  **Task Selection**: Identify exactly ONE task from `task_list.json` with a `pending` status.
3.  **Standard Alignment**: Review `docs/architecture.md` and `docs/conventions.md` to internalize the "Definition of Done" and quality benchmarks.
4.  **Skill Activation**: Load and utilize the expert-level capabilities located in `./skills` relevant to the current task.

## 2. Mandatory Completion Protocol (History Log)

Every time a task is completed and before closing the session, the active agent must append an entry to `.harness/history.log` using the following **append-only** format:

---

### YYYY-MM-DD — [Task ID: Feature Name]

- **Agent**: [Agent Name, e.g., Coder #1]
- **Plan**: [Brief description of the intended implementation].
- **Changes**: [List of modified or created files].
- **Verification**: [Evidence of testing, lighthouse scores, or visual spec alignment].
- **Closure**: [Task status update, e.g., Task [ID] marked as `done`].

---

_Note: Never edit previous entries. Only append to the end of the file._

## 3. Repository Infrastructure Map

| File / Folder            | Content / Purpose                                         | Access Frequency        |
| :----------------------- | :-------------------------------------------------------- | :---------------------- |
| `task_list.json`         | Source of truth for project progress and task status.     | Every startup.          |
| `.harness/history.log`   | Historical log of all completed tasks and changes.        | Every startup/close.    |
| `.harness/docs/`         | Architectural blueprints, Design System, and Conventions. | Planning phase.         |
| `.harness/agents/`       | Role-specific DNA (Coder, Leader, Reviewer).              | Context initialization. |
| `./skills/`              | Expert-level capabilities (Astro, Design, A11y, etc.).    | Implementation phase.   |
| `.harness/visual-specs/` | Ground truth for UI/UX precision (Screenshots).           | UI development.         |
| `src/assets/`            | Production assets (Fonts, 3D Renders, Icons).             | Styling & Assets.       |

## 4. Immutable Engineering Rules

- **Atomic Task Execution**: Focus on one feature at a time. Do not engage in scope creep or unauthorized refactoring.
- **Skill-Driven Development**: Agents must leverage the logic and guidelines defined in `./skills` to ensure the output meets production-grade standards.
- **Design-Driven Implementation**: Use the `visual-specs/` folder as the primary reference for layout, spacing, and typography. If a layout diverges from the spec, it is considered a failure.
- **Zero-Hallucination Policy**: If an asset, data point, or technical requirement is missing, mark the task as `blocked` in `task_list.json` and request clarification. Do not invent placeholders.
- **Aesthetic Integrity**: Follow the `frontend-design` philosophy: avoid "AI-slop" by making bold, intentional choices in spacing and micro-interactions.

## 5. Current Hierarchy

Agents must respect the following authority chain:

1. **Leader**: Orchestrates tasks and validates strategic alignment.
2. **Reviewer**: Audits code against `docs/conventions.md` and accessibility standards.
3. **Coder**: Executes production-grade code following the Design System.
