---
name: agent-orchestrator
description: Entry point and behavioral framework for the Multi-Agent system. Defines mandatory startup protocols, repository mapping, and immutable engineering rules.
---

# Agent Orchestration System

This repository operates under a **Multi-Agent Orchestration** framework. All agents must adhere to the protocols defined herein to ensure architectural integrity and design precision.

## 1. Mandatory Startup Protocol

Before executing any action, agents must perform the following sequence:

1.  **Context Synchronization**: Read `.opencode/history.log` and `task_list.json` to synchronize with the current project state.
2.  **Task Selection**: Identify exactly ONE task from `task_list.json` with a `pending` status.
3.  **Standard Alignment**: Review `docs/architecture.md` and `docs/conventions.md` to internalize the "Definition of Done" and quality benchmarks.
4.  **Skill Activation**: Load and utilize the expert-level capabilities located in `./skills` relevant to the current task.
5.  **Visual Asset Verification**: Prior to implementing any new view or modifying the frontend, agents **MUST** search for, locate, and review the corresponding image or layout file inside `.opencode/visual-specs/`. Developing UI features without inspecting the ground-truth visual specification beforehand is strictly prohibited.

## 2. Mandatory Completion Protocol (History Log)

Every time a task is completed and before closing the session, the active agent must append an entry to `.opencode/history.log` using the following **append-only** format:

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

| File / Folder             | Content / Purpose                                         | Access Frequency        |
| :------------------------ | :-------------------------------------------------------- | :---------------------- |
| `task_list.json`          | Source of truth for project progress and task status.     | Every startup.          |
| `.opencode/history.log`   | Historical log of all completed tasks and changes.        | Every startup/close.    |
| `.opencode/docs/`         | Architectural blueprints, Design System, and Conventions. | Planning phase.         |
| `.opencode/agents/`       | Role-specific DNA (Coder, Leader, Reviewer).              | Context initialization. |
| `./skills/`               | Expert-level capabilities (Astro, Design, A11y, etc.).    | Implementation phase.   |
| `.opencode/visual-specs/` | Ground truth for UI/UX precision (Screenshots).           | UI development.         |
| `src/assets/`             | Production assets (Fonts, 3D Renders, Icons).             | Styling & Assets.       |

## 4. Visual Specs & Website Architecture

The `.opencode/visual-specs/` directory represents the absolute ground truth for the user interface. It maps directly to the web application's routing and block layout through a rigid structure.

### 4.1 Website Structure (Numerical Sequence)

UI development must follow the sequential order defined by the visual asset index:

- **`01-home` (Main Landing Page)**: Contains the hero and structural sections. Includes precise interactive state variations for the **Hobby Switcher** loop:
  - `01-home-hobby-gaming.png` (Gaming route/state)
  - `01-home-hobby-reading.png` (Reading route/state)
  - `01-home-hobby-running.png` (Running route/state)
- **`02-about` (About Section)**: Individual professional profile layouts and presentation cards.
- **`03-experience` (Work Experience Section)**: Modular enterprise case displays. Contains specific asset iterations for past roles (e.g., _C3_, _Liverpool_, _Sngular_, _STC_).
- **`04-portfolio` (Projects Grid)**: Showcase interface for engineering projects and technical deployments.
- **`05-blog` (Blog Subsystem)**: Two-tier layout architecture:
  - `05-blog.png` (Main article index and listing directory view).
  - `05-blog-detail.png` / `05-blog-detail-tech.png` (Deep-dive technical article item view).
- **`06-contact` (Contact Footer Section)**: Actionable communication forms and social nodes.

### 4.2 Matrix Organization

Visual assets are grouped across three strict dimensions to guarantee coverage for design system tokens:

1. **Language (`English / Spanish`)**: Mitigates i18n text-expansion layout breaks by validating UI flexibility under different string lengths.
2. **Device (`Desktop / Mobile`)**: Defines responsive container limits, breakpoints, and interaction models (click vs. touch targets).
3. **Theme (`Dark / Light`)**: Verifies color token compliance, contrast values, and accessibility (A11y) performance across state shifts.

## 5. Immutable Engineering Rules

- **Atomic Task Execution**: Focus on one feature at a time. Do not engage in scope creep or unauthorized refactoring.
- **Skill-Driven Development**: Agents must leverage the logic and guidelines defined in `./skills` to ensure the output meets production-grade standards.
- **Design-Driven Implementation**: Use the `visual-specs/` folder as the primary reference for layout, spacing, and typography. If a layout diverges from the spec, it is considered a failure.
- **Zero-Hallucination Policy**: If an asset, data point, or technical requirement is missing, mark the task as `blocked` in `task_list.json` and request clarification. Do not invent placeholders.
- **Aesthetic Integrity**: Follow the `frontend-design` philosophy: avoid "AI-slop" by making bold, intentional choices in spacing and micro-interactions.

## 6. Current Hierarchy

For any code task, launch the appropriate sub-agent via the Agent tool. Agents must respect the following authority chain:

1. **Leader**: Orchestrates tasks and validates strategic alignment.
2. **Reviewer**: Audits code against `docs/conventions.md` and accessibility standards.
3. **Coder**: Executes production-grade code following the Design System.
