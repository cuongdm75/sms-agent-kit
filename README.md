# 🤖 SMS Agent Kit

> Portable AI Agent toolkit for Antigravity IDE — distilled from 64+ sessions of SMS Online Platform development.

## 📦 What's Inside

| Component | Count | Description |
|-----------|-------|-------------|
| **Agents** | 20 | Specialized AI personas (backend, frontend, mobile, security, etc.) |
| **Skills** | 38 | Reusable knowledge modules (clean-code, API patterns, testing, etc.) |
| **Workflows** | 12 | Slash commands (/deploy, /debug, /test, /plan, etc.) |
| **Scripts** | 12 | Automation tools (lint, test, security scan, UX audit) |

## 🚀 Quick Start

### Option A: Copy into project (simplest)
```powershell
git clone https://github.com/cuongdm75/sms-agent-kit.git
Copy-Item -Recurse sms-agent-kit\* your-project\.agent\
```

### Option B: Git submodule (versioned)
```powershell
cd your-project
git submodule add https://github.com/cuongdm75/sms-agent-kit.git .agent
```

### Option C: Manual copy
```powershell
# Download and extract to .agent/ folder in your project root
```

After setup, Antigravity IDE will automatically discover agents and skills from `.agent/`.

---

## 🧑‍💼 Agent Roster

### Core Orchestration
| Agent | File | Role |
|-------|------|------|
| `orchestrator` | `agents/orchestrator.md` | Multi-agent coordinator |
| `project-planner` | `agents/project-planner.md` | 4-phase planning methodology |
| `product-manager` | `agents/product-manager.md` | Requirements & prioritization |

### Development
| Agent | File | Role |
|-------|------|------|
| `backend-specialist` | `agents/backend-specialist.md` | API, DB, server logic |
| `frontend-specialist` | `agents/frontend-specialist.md` | Web UI/UX, React/Next.js |
| `mobile-developer` | `agents/mobile-developer.md` | React Native, Flutter |
| `game-developer` | `agents/game-developer.md` | Game dev patterns |

### Quality & Security
| Agent | File | Role |
|-------|------|------|
| `security-auditor` | `agents/security-auditor.md` | Cyber security, OWASP |
| `debugger` | `agents/debugger.md` | Systematic debugging |

---

## 📚 Key Skills

### Must-Use Skills
| Skill | Description |
|-------|-------------|
| `clean-code` | Pragmatic coding standards — concise, no over-engineering |
| `project-patterns` | **NEW** — Lessons from SMS Platform (i18n, workflows, security) |
| `brainstorming` | Socratic questioning protocol for complex requests |
| `testing-patterns` | Unit, integration, mocking strategies |

### Design Skills
| Skill | Description |
|-------|-------------|
| `frontend-design` | Web UI principles (anti-cliché, no purple) |
| `mobile-design` | Touch interaction, platform conventions |
| `tailwind-patterns` | Tailwind CSS v4 patterns |

### Architecture Skills
| Skill | Description |
|-------|-------------|
| `architecture` | ADR documentation, trade-off evaluation |
| `api-patterns` | REST vs GraphQL, response formats |
| `database-design` | Schema design, indexing strategy |
| `nodejs-best-practices` | Node.js patterns and security |

### DevOps & Security
| Skill | Description |
|-------|-------------|
| `deployment-procedures` | Safe deployment, rollback strategies |
| `vulnerability-scanner` | OWASP 2025, supply chain security |
| `server-management` | Process management, monitoring |

---

## ⚡ Workflows (Slash Commands)

| Command | Description |
|---------|-------------|
| `/plan` | Create detailed project plan (no code) |
| `/create` | App builder — full-stack from description |
| `/enhance` | Add/update features iteratively |
| `/debug` | Systematic debugging with root cause analysis |
| `/deploy` | Pre-flight checks + production deployment |
| `/test` | Generate and run tests |
| `/orchestrate` | Multi-agent coordination |
| `/brainstorm` | Structured ideation with options |
| `/status` | Project status dashboard |
| `/ui-ux-pro-max` | Plan and implement premium UI |

---

## 🏗️ Project Structure

```
sms-agent-kit/
├── agents/                 # 20 AI personas
│   ├── orchestrator.md
│   ├── backend-specialist.md
│   ├── frontend-specialist.md
│   └── ...
├── skills/                 # 38 knowledge modules
│   ├── clean-code/SKILL.md
│   ├── project-patterns/SKILL.md    ← NEW: Lessons learned
│   ├── api-patterns/SKILL.md
│   └── ...
├── workflows/              # 12 slash commands
│   ├── deploy.md
│   ├── debug.md
│   └── ...
├── scripts/                # 12 automation tools
│   ├── checklist.py
│   ├── verify_all.py
│   └── ...
├── ARCHITECTURE.md         # System map
└── README.md               # This file
```

---

## 🔧 Customization

### Add a new agent
```markdown
<!-- .agent/agents/my-custom-agent.md -->
---
name: my-custom-agent
description: Custom specialist for my domain
skills: clean-code, project-patterns
---

# My Custom Agent

## Core Philosophy
[Define what this agent specializes in]

## Rules
[Define behavior rules and constraints]
```

### Add a new skill
```markdown
<!-- .agent/skills/my-skill/SKILL.md -->
---
name: my-skill
description: Knowledge module for specific domain
---

# My Skill
[Document patterns, rules, and examples]
```

### Add a new workflow
```markdown
<!-- .agent/workflows/my-workflow.md -->
---
description: What this workflow does
---

1. Step one
2. Step two
// turbo
3. Auto-run step (safe command)
```

---

## 📄 License

MIT — Use freely in any project.
