# LARUSO — Project Overview & Development Blueprint

**Read this file first.** It replaces the old `README.md` and exists so that Claude (or any other agent) can understand both the long-term vision for this project and exactly how much of it has actually been built, before touching any code.

This file has two parts:

- **Part A — Current State**, written from direct inspection of the repo. Treat this as ground truth.
- **Part B — Master Specification**, the long-term plan supplied by the project owner. Treat this as direction and ambition, *not* as a description of what exists today. Many sections describe things that are not built yet.

Whenever the two disagree, Part A wins. Update Part A whenever you finish meaningful work, so the next agent doesn't have to re-derive it.

---

# PART A — CURRENT STATE (as of 2026-11-21)

## What actually exists

Laruso today is a **small, working prototype of one agent** from the much larger vision in Part B: a **guest follow-up assistant** for a single hotel, with no database, no multi-tenancy, and no orchestration layer. It is best understood as an early proof-of-concept for the **Guest Retention Agent** (Part B, §5.1) and a sliver of the **Guest Communication Agent** (§5.3) consent/guardrail idea, built bottom-up before any of the Phase 1–4 platform foundations exist.

The repo was reorganized (2026-11-21) from a single flat `backend/laruso/` package into the modular layout the long-term architecture (Part B, §3) calls for: `backend/`, `ai/`, `agent_system/`, plus `frontend/`, `sandbox/`, `docs/`, `scripts/`, `tests/`. **This was a reorganization, not a rewrite** — every module, test, prompt and guardrail from before still exists and does the same thing; only its location, package name, and (in `pipeline.py`'s case) how it receives guest data changed.

Repo layout:

```
frontend/           Next.js marketing/landing page for Laruso (the product pitch, not an app dashboard)
backend/app/        The real, backend-owned domain logic (today: just the guests module)
ai/                 Model-provider infrastructure, usable by any future agent
agent_system/       Reusable agent packages, kept decoupled from backend internals
sandbox/fixtures/   Sample/fictional guest data — kept out of production modules
docs/architecture/  This file
scripts/            Composition-root scripts that wire backend + ai + agent_system together
tests/integration/  The only tests allowed to depend on both backend and agent_system
```

One Python project (one root `pyproject.toml`) covers `backend`, `ai` and `agent_system` — they're kept logically separate by directory and import rules, not by being separate installable packages (per explicit instruction; revisit this only if/when they need to deploy or scale independently).

### Backend (`backend/app/modules/guests/`)

The only real backend domain module so far:

- **`merge.py`** — reads three sample CSVs (`bookings.csv`, `complaints.csv`, `searches.csv`) from `sandbox/fixtures/` (deliberately *not* inside this module — see "Sample data" below), keys guests by normalized email, and produces one guest dict with: `email`, `name`, `last_stay`, `opted_out`, `open_complaint`, `unfinished_search`. A guest with no booking row has no consent record and defaults to `opted_out = True` (fail-safe).
- **`service.py`** — the module's *public interface*. Everything outside `guests/` (scripts, future API routes, other modules) should call `service.list_guests()` rather than importing `merge` directly, so the CSV implementation can be swapped for a real database later without breaking callers.

`backend/app/api/` exists as an empty package — a placeholder for the approval-queue endpoints mentioned in the old README, not yet implemented. `backend/app/core`, `database/`, `models/`, `schemas/`, `services/`, `events/`, `integrations/`, and every other domain module in Part B §3.1 (hotels, users, reservations, rooms, housekeeping, finance, analytics) **do not exist yet** — deliberately not scaffolded empty.

### AI infrastructure (`ai/model_gateway/`)

- **`llm.py`** — an `LLM` Protocol so the model provider is swappable. `OllamaLLM` calls a local Ollama server (default model `gemma3:4b`) over HTTP; `FakeLLM` returns a fixed string for tests. This is the real (if minimal) start of the "model-serving abstraction" in Part B §8 — any future agent package can depend on `ai.model_gateway`, not on Ollama directly.

`ai/orchestrator`, `model_config`, `memory`, `tools`, `knowledge_base`, `evaluations` **do not exist yet.**

### Agent system (`agent_system/`)

```
agent_system/
├── shared/
│   ├── contracts.py    GuestRecord — the data shape agents depend on, instead of backend internals
│   └── guardrails.py   content-safety checks, reusable by any guest-facing agent
└── packages/
    └── guest_retention/
        ├── rules.py       eligibility reasons (open complaint / unfinished search / ~a year since last stay)
        ├── priority.py    buckets into Contact today / This week / Later
        ├── draft.py       builds the prompt, asks the LLM for a <60-word message
        ├── pipeline.py    rules -> priority -> draft -> guardrails -> QueueItem list
        └── tests/
```

**The key architectural rule enforced here:** nothing in `agent_system/` imports anything from `backend/`. `pipeline.run_pipeline(today, llm, guests)` takes guests as plain data typed against `agent_system.shared.contracts.GuestRecord` — a contract the agent system itself owns and depends on, not one it reaches into backend to get. Whoever wires a real run together (today: `scripts/run_pipeline.py`) is responsible for fetching real guest data (via `backend.app.modules.guests.service.list_guests()`) and handing it over. This is dependency inversion, not just a file move: backend's CSV implementation can become a database tomorrow and `agent_system` would need zero changes.

The system prompt in `draft.py` tells the model not to mention prices/discounts/rooms or make promises — but that instruction is **not trusted on its own**; `shared/guardrails.py` independently (regex/string checks, no LLM) flags opted-out guests, too-short/too-long drafts, `[placeholder]` text, any price/discount/currency wording or symbol, and any room-benefit promise.

`agent_system/registry`, `instances`, `builder` (the agent lifecycle machinery from Part B §6) **do not exist yet.** Only one package (`guest_retention`) exists under `packages/`.

### Sample data (`sandbox/fixtures/`)

The three sample CSVs live here — explicitly separated from `backend/app/modules/guests/`, which is meant to hold production guest-domain logic only, not fixture data. `backend/scripts/sample_data.py` (re)generates them. The rest of the `sandbox/` concept from Part B §13 (simulated hotels, mock channels, a testing dashboard, etc.) **does not exist yet** — only the fixtures directory, which was needed now.

### Tests

- Unit tests live beside the code they test and never cross the backend/agent_system boundary: `backend/app/modules/guests/tests/`, `agent_system/packages/guest_retention/tests/`.
- `tests/integration/test_guest_retention_integration.py` is the one place allowed to import both `backend` and `agent_system` — it proves the seam between them (real sample data flowing through the real pipeline) actually works end to end.
- All 39 tests pass as of this reorganization (`python -m pytest` from the repo root).

### Frontend (`frontend/`, renamed from `website/`)

A Next.js landing page for the product (hero, motion/scroll effects, ASCII gradient art, mock screenshots) — marketing only. It is **not** the Agent Control Center or any kind of operational dashboard; it doesn't talk to the backend at all yet. Build verified working after the rename.

### How to run it

```
npm run install:all
npm run dev                         # frontend (Next.js)
```

```
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"             # one editable install, from the repo root
python backend/scripts/sample_data.py   # write sample CSVs to sandbox/fixtures/
python scripts/run_pipeline.py          # composition root: backend data -> ai -> agent_system
pytest                                   # run every test (unit + integration)
```

Example data only. Not a commercial product (yet).

### What this maps to in the Part B roadmap

- Phase 1 (auth, multi-tenancy, DB, dashboard foundation): **not started.**
- Phase 2 (hotel/room/reservation data model, real Guest CRM): **not started** — the "guest profile" here is a flat dict rebuilt from CSVs on every run, not a persisted CRM record.
- Phase 3 (agent packages, registration, orchestrator, model-serving abstraction): **the directory shape now exists** (`agent_system/packages/`, `ai/model_gateway/`), proven with one real package (`guest_retention`) and one real gateway (`OllamaLLM`/`gemma3:4b`). Registration, discovery, orchestration and model routing as described in §3.2/§7 are still **not implemented** — there's exactly one package and one hand-wired script, no registry.
- Phase 4 (Reception/Booking/Housekeeping agents): **not started.**
- Phase 5 (Guest Retention / Booking Recovery / Communication agents): **a vertical slice of Guest Retention exists**, now properly isolated as its own agent package. No CRM, no real channel delivery, no opt-out UI, no booking-recovery or live-chat agent yet.
- Phases 6–10 (sandbox simulation/testing dashboard, additional agents, BI, voice, multi-tenant production hardening): **not started** beyond the `sandbox/fixtures/` directory.

### Known gaps / fragile points worth flagging to whoever works on this next

- No persistence: everything is recomputed from CSVs on each run; there's no way yet to record a human's approve/edit/reject decision or to avoid re-queuing the same guest.
- No API (`backend/app/api/` is empty) and no connection between `frontend/` and `backend/`.
- Single hotel, implicitly — no tenant concept anywhere.
- `DEFAULT_OPTED_OUT` in `merge.py` is a module-level constant, not configuration — fine for a prototype, would need to move into real per-hotel settings later.
- Guardrails are deliberately simple string/regex checks, not LLM-based — this is intentional (§12 "AI-generated decisions must never bypass backend validation") and should be preserved as a pattern even as the system grows.
- The backend/agent_system decoupling is enforced by convention and by `agent_system/shared/contracts.py`'s `GuestRecord` TypedDict, not by a hard runtime boundary (e.g. a network call or a separate process). That's the right amount of rigor for a single-process prototype; if agents ever run as separate services, this is the seam that would become a real API call.

---

# PART B — MASTER PROJECT SPECIFICATION (long-term plan, not current state)

> Everything below is the originally supplied vision/roadmap document, preserved verbatim as direction for future work. It describes where Laruso is intended to go, not what exists today — see Part A for that.

**Project:** Laruso
**Category:** AI-powered Hotel Management & Operations Platform
**Architecture:** Modular Multi-Agent AI System
**Development Approach:** Incremental, modular and scalable
**Initial AI Infrastructure:** Ollama with locally hosted models

---

## 1. Project Overview

### What is Laruso?

Laruso is an AI-powered hotel management platform designed to help hotels manage their operations, automate repetitive administrative tasks, improve guest experiences, increase bookings and retain customers through specialized AI agents.

Laruso combines traditional hotel management software with an intelligent multi-agent architecture.

Instead of relying on a single AI assistant to perform every task, Laruso provides specialized, reusable AI agents responsible for different hotel departments and business functions.

Hotels can select the agents they need, configure their responsibilities, connect them to their existing systems and deploy them through one centralized platform.

The ultimate objective is to create an AI-powered hotel operations ecosystem that allows hotels to assemble their own digital workforce without having to develop AI systems from scratch.

**Laruso should not simply help hotels manage their operations. It should also help them attract customers, convert potential guests into bookings, build lasting guest relationships and increase revenue.**

## 2. Product Objectives

Laruso should achieve five major objectives:

1. **Operational Automation:** Reduce repetitive administrative work across hotel departments.
2. **Guest Experience:** Provide faster, more personalized and consistent guest services.
3. **Revenue Growth:** Help hotels acquire customers, recover abandoned bookings and improve revenue.
4. **Guest Retention:** Build lasting relationships with guests and encourage repeat bookings.
5. **Business Intelligence:** Help hotel owners and managers understand their business through reports, insights and recommendations.

The platform should preserve human oversight. AI should assist hotel employees rather than eliminate the need for human judgment and hospitality.

## 3. Product Architecture

Laruso should be organized around several interconnected product modules.

### 3.1 Hotel Operations

This module handles the hotel's internal operations.

It should eventually include:

- Reservations and booking management.
- Room and room-type management.
- Check-in and check-out workflows.
- Housekeeping management.
- Employee and department management.
- Inventory and stock management.
- Maintenance requests.
- Financial records and reporting.
- Daily operational activities.

### 3.2 AI Agent Infrastructure

This is the foundation of Laruso's AI capabilities.

It should provide:

- Reusable agent packages.
- Agent registration and discovery.
- Agent activation and deactivation.
- Agent configuration.
- Model selection.
- Tool and permission management.
- Agent execution monitoring.
- Agent orchestration.
- Agent communication.
- Execution history and logging.

### 3.3 Guest Experience & Revenue Growth

This module focuses on acquiring guests, communicating with them and encouraging them to return.

It should include:

- Guest Relationship Management (Guest CRM).
- Guest communication.
- Guest retention.
- Abandoned booking recovery.
- Personalized offers.
- Guest preferences and history.
- Customer engagement.
- Loyalty and rewards management.

### 3.4 Business Intelligence

This module provides hotel owners and managers with business insights.

It should support:

- Revenue analysis.
- Occupancy analysis.
- Booking trends.
- Guest behavior analysis.
- Operational performance.
- Staff performance indicators.
- Expense analysis.
- Revenue forecasting.
- Business recommendations.

### 3.5 Agent Control Center

A centralized interface for managing Laruso's AI workforce.

Hotel administrators should be able to:

- Browse available agents.
- Activate or deactivate agents.
- Configure agent behavior.
- Assign permissions.
- Select models where supported.
- Connect integrations.
- Monitor agent activity.
- Review execution logs.
- Inspect errors and failed tasks.
- Manage approval requests.

## 4. Specialized AI Agents

Agents should be independent, reusable modules with clearly defined responsibilities.

The following is the planned agent catalog.

### 4.1 Reception Agent

Responsible for guest-facing reception assistance.

Responsibilities:

- Answer guest questions.
- Provide hotel information.
- Assist with check-in and check-out.
- Retrieve booking information.
- Explain hotel policies.
- Handle routine guest requests.
- Coordinate with other agents.
- Escalate complicated situations to employees.

### 4.2 Booking Agent

Responsible for reservations and room availability.

Responsibilities:

- Check room availability.
- Create reservations.
- Modify bookings.
- Handle cancellation requests.
- Retrieve booking information.
- Coordinate reservation-related tasks.
- Send booking confirmations.
- Communicate with the Reception Agent and Housekeeping Agent.

All availability and reservation changes must be validated by backend services.

### 4.3 Housekeeping Agent

Responsible for coordinating housekeeping operations.

Responsibilities:

- Track room cleaning status.
- Assign cleaning tasks.
- Monitor room readiness.
- Coordinate room preparation.
- Notify reception when rooms are ready.
- Identify overdue housekeeping tasks.

### 4.4 Finance Agent

Responsible for assisting with hotel financial operations.

Responsibilities:

- Track revenue and expenses.
- Generate financial reports.
- Analyze payment records.
- Monitor outstanding payments.
- Identify financial trends.
- Prepare financial summaries.

Financial calculations and transactions must use validated backend logic, not unverified AI-generated calculations.

### 4.5 Inventory Agent

Responsible for hotel stock and supplies.

Responsibilities:

- Monitor inventory levels.
- Identify low-stock items.
- Track inventory usage.
- Prepare procurement recommendations.
- Monitor supplier information.
- Notify authorized employees about stock shortages.

Purchases should require authorization according to hotel-defined limits.

### 4.6 HR Agent

Responsible for assisting with employee management.

Responsibilities:

- Manage employee-related information.
- Assist with staff scheduling.
- Track attendance records.
- Coordinate departmental schedules.
- Generate staff reports.
- Assist with routine HR administration.

Access to employee information must be strictly permission-controlled.

### 4.7 Marketing Agent

Responsible for helping hotels attract and engage customers.

Responsibilities:

- Prepare marketing campaigns.
- Generate promotional content.
- Analyze campaign performance.
- Recommend marketing strategies.
- Identify potential customer segments.
- Coordinate personalized promotional communication.

Marketing communication must follow applicable privacy, consent and opt-out requirements.

### 4.8 Maintenance Agent

Responsible for maintenance coordination.

Responsibilities:

- Receive maintenance requests.
- Track equipment issues.
- Assign repair tasks.
- Monitor maintenance progress.
- Notify relevant employees.
- Maintain maintenance records.

### 4.9 Revenue Management Agent

Responsible for helping hotels improve revenue.

Responsibilities:

- Analyze room demand.
- Monitor occupancy trends.
- Analyze historical booking data.
- Recommend room pricing adjustments.
- Identify revenue opportunities.
- Generate revenue forecasts.

The agent recommends pricing changes. Actual changes should respect hotel policies and authorization rules.

### 4.10 Business Intelligence Agent

Responsible for analyzing hotel performance.

Responsibilities:

- Analyze operational data.
- Generate performance reports.
- Identify unusual trends.
- Compare business performance over time.
- Generate recommendations.
- Answer management questions using verified hotel data.

### 4.11 Executive Assistant Agent

An intelligent assistant for hotel owners and general managers.

Responsibilities:

- Summarize daily hotel operations.
- Generate management reports.
- Identify operational problems.
- Highlight important business developments.
- Provide recommendations.
- Coordinate information from other agents.
- Answer management questions using authorized hotel data.

### 4.12 Voice Receptionist Agent

Responsible for voice-based guest interactions.

Responsibilities:

- Answer incoming calls.
- Respond to hotel-related questions.
- Assist with booking inquiries.
- Retrieve relevant hotel information.
- Transfer complicated requests to employees.
- Support multiple languages where practical.

Voice infrastructure can be introduced after the initial text-based workflows are stable.

## 5. Guest Relationship Management and Customer Retention

This is a major part of Laruso and should not be treated as a minor feature.

Laruso must support the entire guest journey, from discovering a hotel to returning for another stay.

Build a shared Guest CRM that acts as the central source of guest information.

The CRM should eventually store:

- Guest profiles.
- Contact information.
- Booking history.
- Stay history.
- Guest preferences.
- Communication history.
- Marketing consent and communication preferences.
- Loyalty information.
- Relevant customer service interactions.

Guest information must be shared across authorized agents through backend services rather than independently duplicated in each agent.

### 5.1 Guest Retention Agent

Purpose: Help hotels maintain relationships with previous guests and encourage repeat bookings.

Responsibilities:

- Track previous guest interactions and stays.
- Identify guests who have not returned.
- Prepare personalized follow-up messages.
- Send post-checkout messages.
- Prepare birthday and anniversary messages where relevant and permitted.
- Recommend relevant offers.
- Support loyalty and rewards programs.
- Identify opportunities for re-engagement.

Example:

A guest stays at a hotel and checks out.

The Guest Retention Agent receives a checkout event, retrieves the guest's relevant information and communication preferences, and prepares a personalized follow-up.

Example message:

"Hello Daniel, we hope you enjoyed your recent stay with us. We'd love to welcome you back. Let us know if you'd like to explore our upcoming offers."

The system should allow hotels to configure communication timing, frequency, channels and templates.

> *Current state note: this is the agent Laruso's existing prototype is closest to — see Part A. It currently covers eligibility scoring, prioritization, drafting and guardrails for a single hotel with no persisted CRM.*

### 5.2 Booking Recovery Agent

Purpose: Help hotels recover potentially lost reservations.

Laruso should be capable of detecting incomplete booking journeys on a hotel's website.

Example customer journey:

1. A visitor opens the hotel's website.
2. The visitor browses available rooms.
3. The visitor selects a room.
4. The visitor starts the booking process.
5. The visitor enters their contact information.
6. The visitor leaves before completing the reservation.

Laruso should:

- Record relevant booking journey events.
- Detect incomplete reservations.
- Identify eligible visitors where they have provided contact details.
- Check whether communication is permitted.
- Prepare personalized booking reminders.
- Answer questions that may have prevented the booking.
- Offer hotel-approved promotions where appropriate.
- Track whether the guest eventually completes the booking.

Example message:

"Hello Daniel, we noticed you were considering a stay at our hotel. Would you like some assistance completing your reservation?"

Important requirements:

- A website visit alone does not identify a person.
- Clicking a booking button does not automatically grant permission to contact someone.
- Contact information must be collected through legitimate means.
- Communication must respect applicable privacy requirements, consent and opt-out preferences.
- Abandoned reservations should expire according to hotel-defined rules.
- Never promise that a room is still available without checking the live booking system.
- Do not repeatedly contact visitors who have already completed a booking or opted out.

### 5.3 Guest Communication Agent

Purpose: Provide centralized, personalized communication between hotels and their guests.

Supported channels should eventually include:

- WhatsApp Business.
- Email.
- Website live chat.
- SMS.
- Additional messaging platforms through integrations.

Responsibilities:

- Answer guest inquiries.
- Provide information about hotel services.
- Assist with booking questions.
- Retrieve reservation details.
- Explain hotel policies.
- Handle routine complaints.
- Forward complex issues to employees.
- Maintain communication history.

All guest-facing agents should use the same communication infrastructure to avoid inconsistent messages and duplicated conversations.

## 6. Modular Agent Package System

This is one of Laruso's defining architectural features.

The platform should provide reusable agent packages that hotels can activate without developing agents themselves.

Each agent package should contain:

1. Agent identity and description.
2. System instructions.
3. Defined responsibilities.
4. Available tools.
5. Required permissions.
6. Input and output definitions.
7. Model configuration.
8. Relevant context and memory configuration.
9. Error-handling behavior.
10. Configuration options.
11. Tests and evaluation criteria.

An agent package should be reusable across multiple hotels.

Hotel-specific settings should be stored separately from the reusable agent definition.

For example, two hotels may use the same Reception Agent but configure different:

- Languages.
- Check-in times.
- Cancellation policies.
- Available services.
- Communication styles.
- Escalation rules.
- Permissions.

### Agent lifecycle

The system should eventually support:

1. Agent registration.
2. Agent discovery.
3. Agent activation.
4. Configuration.
5. Permission assignment.
6. Execution.
7. Monitoring.
8. Updating.
9. Deactivation.

Do not assume that every agent must run in a separate Docker container.

Start with a maintainable deployment structure and separate services only when there is a clear operational reason.

## 7. Central Agent Orchestration

Laruso should have a central orchestration layer responsible for coordinating agent activities.

Responsibilities:

- Receive requests and system events.
- Identify the appropriate agent.
- Delegate tasks.
- Coordinate multi-agent workflows.
- Track task execution.
- Handle retries and failures.
- Enforce permissions.
- Record execution history.

Agents should communicate through controlled interfaces.

Use direct backend calls for immediate operations and event-driven messaging for asynchronous departmental workflows.

Example:

A guest completes a reservation.

1. The Booking Agent requests reservation creation.
2. The backend validates room availability and creates the booking.
3. A reservation-created event is published.
4. The Housekeeping system receives the event when appropriate.
5. The Finance module updates its operational records.
6. The Reception Agent prepares a confirmation.
7. The notification system delivers the confirmation.
8. The event is recorded for reporting and monitoring.

Use idempotency, retries and event tracking to prevent duplicate bookings, duplicate notifications and inconsistent state.

## 8. AI and Model Infrastructure

Laruso should initially prioritize locally hosted open-weight models using Ollama.

Current model:

- Gemma 3:4B.

Potential additional models:

- Qwen 3.5:9B for more demanding reasoning and tool-use tasks.
- EmbeddingGemma for document retrieval and semantic search.

Do not install every model immediately.

Start by evaluating the existing Gemma 3:4B model against actual Laruso workflows.

### Model-serving architecture

Implement a centralized model-serving abstraction.

Multiple agents should be able to use the same model with different instructions, tools and configurations.

The architecture should support:

- Model registration.
- Model selection.
- Model routing.
- Model configuration.
- Model health checks.
- Request timeouts.
- Error handling.
- Usage tracking.

Do not bundle duplicate model weights inside individual agent Docker containers.

Agent services should communicate with a shared Ollama model server through its HTTP interface.

Keep model integration independent of agent business logic so that models can be replaced without rewriting the agents.

### Retrieval-Augmented Generation (RAG)

Introduce RAG for accessing hotel-specific knowledge.

Potential information sources:

- Hotel policies.
- Service descriptions.
- Cancellation policies.
- Room information.
- Restaurant menus.
- Internal documentation.
- Staff procedures.

The system should retrieve relevant information before generating answers.

Hotel knowledge must be isolated by tenant. An agent belonging to one hotel must never retrieve another hotel's private documents.

## 9. Backend and Data Architecture

Preferred backend:

- Python.
- FastAPI.
- PostgreSQL.

The backend should remain the authoritative source of truth.

AI agents must use authorized backend functions and services rather than directly modifying critical database records.

### Main database domains

The database should eventually support:

- Hotels and properties.
- Users and authentication.
- Roles and permissions.
- Employees.
- Guests.
- Guest preferences.
- Communication preferences and consent records.
- Rooms and room types.
- Reservations.
- Payments.
- Financial records.
- Departments.
- Housekeeping tasks.
- Inventory.
- Maintenance.
- Marketing campaigns.
- Booking journey events.
- Agent definitions.
- Agent installations.
- Agent configurations.
- Agent executions.
- Tasks and notifications.
- Knowledge documents.
- Approval requests.
- Audit logs.

The exact schema should be designed after inspecting the existing codebase.

### Multi-tenancy

Laruso is intended to serve multiple hotels.

Implement tenant-level data isolation from the beginning.

Requirements:

- Every hotel-owned record must be associated with the appropriate tenant.
- Authorization must be enforced on the backend.
- Users must only access permitted hotel data.
- Agent configurations must be tenant-specific.
- Knowledge retrieval must be tenant-aware.
- Logs must not expose sensitive information across tenants.

A hotel should be able to manage multiple properties under its organization where applicable.

## 10. Technical Stack

The preferred technology stack is:

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| UI | React and TypeScript |
| Styling | Tailwind CSS |
| Backend | Python and FastAPI |
| Database | PostgreSQL |
| AI models | Ollama |
| Agent orchestration | LangGraph or another suitable framework |
| Background processing | Redis and a suitable task queue |
| Messaging | RabbitMQ or another suitable event broker when needed |
| Containerization | Docker |
| Initial deployment | Docker Compose |
| Future orchestration | Kubernetes when justified |

These are preferred choices, not a requirement to rewrite existing working components.

Inspect the current implementation before adding frameworks or changing architectural decisions.

## 11. Integrations

Laruso should eventually integrate with external hotel systems.

Potential integrations include:

- WhatsApp Business.
- Email providers.
- Payment providers.
- Online booking platforms.
- Accounting software.
- Voice communication providers.
- Existing hotel Property Management Systems (PMS).
- Other hotel-specific software.

Integrations should be modular.

Use provider-specific adapters so that replacing one provider does not require rewriting the entire platform.

Never assume an external integration is available until it has been configured and tested.

## 12. Human Oversight, Security and Reliability

AI agents must operate within explicit permissions.

Examples:

- Agents can prepare routine reports.
- Agents can answer questions using authorized data.
- Agents can recommend discounts.
- Agents can prepare purchase requests.
- Large refunds require human approval.
- Significant purchases require authorization.
- Sensitive financial changes require appropriate permissions.

Implement:

- Role-based access control.
- Tenant-level authorization.
- Input validation.
- Audit logging.
- Approval workflows.
- Rate limiting.
- Secure credential management.
- Error handling.
- Agent execution limits.
- Communication consent management.

AI-generated decisions must never bypass backend validation.

## 13. Laruso Sandbox and Testing Environment

Testing is a core part of the platform's development strategy.

Laruso should include a dedicated Sandbox Environment that allows developers to simulate hotel operations and guest interactions without requiring a real hotel or real customers.

The sandbox should provide:

- Simulated hotels.
- Fictional guest profiles.
- Sample rooms and room availability.
- Sample reservations.
- Simulated booking journeys.
- Simulated hotel employees.
- Sample policies and hotel documentation.
- Simulated guest conversations.
- Mock communication channels.
- Agent execution monitoring.

The sandbox must be isolated from production data and services.

### 13.1 Guest Retention Testing

Create fictional guest profiles with different histories and preferences.

Examples:

- Guest A has stayed twice.
- Guest B visited for a honeymoon.
- Guest C has not returned in twelve months.
- Guest D prefers deluxe rooms.

Simulate events such as:

- Guest checks out.
- Guest becomes eligible for a follow-up.
- Guest receives a personalized message draft.
- Guest responds.
- Guest opts out of marketing messages.

Evaluate:

- Whether guest information is retrieved correctly.
- Whether messages are personalized appropriately.
- Whether the agent respects consent.
- Whether the correct follow-up timing is used.
- Whether duplicate messages are prevented.

Messages should initially be captured in a test inbox rather than sent to real customers.

### 13.2 Booking Recovery Testing

Create a simulated hotel website and booking process.

Simulate the following journey:

1. Visitor opens the website.
2. Visitor browses rooms.
3. Visitor selects a room.
4. Visitor begins booking.
5. Visitor enters contact details.
6. Visitor abandons the booking.
7. Laruso records the incomplete booking.
8. The Booking Recovery Agent checks eligibility.
9. The agent prepares a personalized reminder.
10. The system tracks whether the booking is completed later.

Test these scenarios:

- Visitor leaves without providing contact information.
- Visitor provides contact information and abandons the booking.
- Visitor abandons during payment.
- Visitor completes the booking.
- Visitor returns and completes the booking later.
- Visitor opts out of communication.
- Selected room is no longer available.

Expected behavior:

- Unknown visitors must not be contacted.
- Ineligible visitors must not receive messages.
- Completed bookings must not trigger recovery reminders.
- Room availability must be checked before making availability claims.
- Communication preferences must be respected.

### 13.3 Guest Communication Testing

Create a simulated website chat or messaging interface.

Test messages such as:

- "Do you have rooms available tomorrow?"
- "Do you offer airport pickup?"
- "Can I cancel my reservation?"
- "I had a terrible experience."
- "Can I get a discount?"

Expected behavior:

- Retrieve accurate hotel information.
- Check live booking data when necessary.
- Follow hotel policies.
- Avoid inventing information.
- Escalate complicated or sensitive situations.

### 13.4 Agent Workflow Testing

Test workflows involving multiple agents.

Example:

A guest makes a reservation.

Verify that:

- The Booking Agent creates the reservation.
- The backend validates the booking.
- Relevant operational events are published.
- Housekeeping receives the appropriate task.
- Finance receives the relevant booking information.
- Reception sends a confirmation.
- Logs accurately record the workflow.

Test failed events, retries, duplicate events and service interruptions.

### 13.5 Testing Dashboard

Build an interface that allows developers to:

- View simulated guests.
- Trigger hotel events.
- Start and abandon bookings.
- Simulate guest conversations.
- Inspect generated messages.
- View agent decisions.
- Monitor agent executions.
- Inspect event histories.
- View errors and failed workflows.
- Reset sandbox data.

The testing dashboard should make it easy to understand what happened, which agent handled it and why.

### 13.6 Evaluation Metrics

Measure more than whether the AI generates a response.

Important metrics include:

| Metric | Purpose |
|---|---|
| Booking recovery rate | Measure recovered abandoned bookings. |
| Repeat booking rate | Measure returning guests. |
| Response accuracy | Evaluate correctness of guest responses. |
| Response time | Measure communication speed. |
| Consent compliance | Verify communication eligibility. |
| Escalation accuracy | Evaluate human escalation decisions. |
| Workflow success rate | Measure successful multi-agent execution. |
| Tool-call accuracy | Evaluate whether agents use the correct backend tools. |

Simulation tests verify technical functionality. Real-world retention and conversion improvements must eventually be evaluated using real hotel data.

### 13.7 Testing Strategy

Use several levels of testing:

- Unit tests for individual backend functions.
- Integration tests for database and service interactions.
- Agent tests for tool usage and instructions.
- Workflow tests for multi-agent coordination.
- End-to-end tests for complete guest journeys.
- Security tests for authorization and tenant isolation.
- Load tests for performance and concurrency.

Use deterministic mock services where possible. Do not rely entirely on LLM responses for automated test assertions.

## 14. Deployment and Infrastructure

Use Docker to package and deploy Laruso's services.

Initially, Docker Compose should be sufficient.

Potential services include:

- Frontend.
- Backend API.
- PostgreSQL.
- Redis.
- Message broker when required.
- Agent orchestration service.
- Ollama model server.
- Background workers.

Do not automatically create a separate container for every agent.

Start with a modular service architecture and separate components when scaling, security or deployment requirements justify it.

Do not run duplicate copies of large model weights unnecessarily.

Kubernetes may be introduced later when Laruso requires more advanced orchestration and scaling.

The system should support centralized model hosting initially, while keeping the architecture flexible enough to support hotel-level or hybrid model hosting in the future.

## 15. Business Model

Laruso is intended to operate as a SaaS platform.

Potential pricing structure:

### Starter
For smaller hotels requiring essential management functionality and selected agents.

### Professional
For hotels requiring more agents, automation and analytics.

### Enterprise
For larger hotel groups requiring advanced customization, integrations and multi-property management.

Potential pricing factors:

- Number of rooms.
- Number of properties.
- Selected agents.
- AI usage.
- Integrations.
- Advanced functionality.

Pricing should remain configurable rather than being hardcoded into the software.

## 16. Development Roadmap

Develop Laruso incrementally.

Do not attempt to implement every feature and agent simultaneously.

### Phase 1 – Inspect and Establish the Foundation

- Inspect the existing codebase.
- Understand existing functionality.
- Identify completed and incomplete components.
- Establish the frontend and backend architecture.
- Implement authentication.
- Implement multi-tenancy.
- Establish the initial database structure.
- Build the basic hotel management dashboard.

### Phase 2 – Core Hotel Operations

- Implement hotel and property management.
- Implement rooms and room types.
- Implement guest management.
- Implement reservations.
- Implement basic booking workflows.
- Establish the initial Guest CRM.

### Phase 3 – Agent Infrastructure

- Design reusable agent packages.
- Implement agent registration.
- Implement agent configuration.
- Integrate Ollama.
- Test Gemma 3:4B.
- Implement the model-serving abstraction.
- Implement the central orchestrator.
- Implement agent execution logs.
- Implement permissions and tool access.

### Phase 4 – First AI Agents

Start with:

1. Reception Agent.
2. Booking Agent.
3. Housekeeping Agent.

Develop their real backend workflows and test them before introducing additional agents.

### Phase 5 – Guest Experience and Revenue Growth

Develop:

1. Guest Communication Agent.
2. Guest Retention Agent.
3. Booking Recovery Agent.

Implement:

- Shared Guest CRM.
- Website booking event tracking.
- Consent and communication preferences.
- Email integration.
- WhatsApp Business integration when ready.
- Personalized communication.
- Booking recovery workflows.

### Phase 6 – Sandbox and Testing Infrastructure

Build the complete Laruso Sandbox Environment.

Implement:

- Simulated hotels.
- Fictional guests.
- Simulated booking journeys.
- Mock messaging.
- Agent testing tools.
- Workflow monitoring.
- Testing dashboard.
- Automated evaluation.

The sandbox should be developed early enough to support the implementation and validation of every new agent.

### Phase 7 – Advanced Hotel Operations

Introduce:

- Finance Agent.
- Inventory Agent.
- HR Agent.
- Marketing Agent.
- Maintenance Agent.

Add additional departmental workflows and integrations.

### Phase 8 – Intelligence and Management

Introduce:

- Business Intelligence Agent.
- Revenue Management Agent.
- Executive Assistant Agent.
- RAG and hotel knowledge retrieval.
- Advanced analytics and forecasting.

### Phase 9 – Advanced Capabilities

Introduce:

- Voice Receptionist.
- Multilingual communication.
- Predictive analytics.
- Advanced guest personalization.
- Loyalty programs.
- Multi-property management.
- More external integrations.

### Phase 10 – Production Readiness and Scaling

- Security audits.
- Performance optimization.
- Load testing.
- Monitoring and alerting.
- Backup and recovery.
- Deployment automation.
- Tenant isolation verification.
- Production model evaluation.
- Operational documentation.

## 17. Important Architectural Principles

These principles should guide every development decision.

1. **Modularity:** Build independent components with clear responsibilities.
2. **Reusability:** Agent packages should work across different hotels.
3. **Multi-tenancy:** Hotel data and configurations must remain isolated.
4. **Separation of concerns:** Keep AI reasoning separate from core business logic.
5. **Backend authority:** The backend is the source of truth for bookings, payments, availability and business records.
6. **Model independence:** Agent logic should not depend on a specific LLM provider.
7. **Human oversight:** Sensitive operations must have approval controls.
8. **Scalability:** Avoid unnecessary infrastructure complexity while keeping future growth possible.
9. **Observability:** Agent actions and workflows must be traceable.
10. **Testability:** Every important agent and workflow should be testable in isolation and through the sandbox.
11. **Privacy:** Guest communication and data processing must respect consent and applicable privacy requirements.
12. **Incremental development:** Build, test and validate each capability before expanding.

## 18. Instructions to Claude Code

This document describes the intended direction of Laruso. It does not mean that all the described functionality already exists.

You must first inspect the existing repository and understand the work that has already been completed. (Part A of this file is that inspection — re-verify it against the code if it's been a while, rather than trusting it blindly.)

### Before making changes

1. Inspect the existing directory structure.
2. Read the existing project documentation.
3. Inspect the frontend and backend implementations.
4. Identify the existing technologies and dependencies.
5. Identify existing AI agents and model integrations.
6. Identify the current database schema.
7. Identify existing workflows and integrations.
8. Compare the existing implementation against this specification.

### Produce an implementation assessment

Summarize:

- What already exists.
- What is partially implemented.
- What is missing.
- Which existing decisions should be preserved.
- Which architectural improvements are necessary.
- What should be implemented next.

### Implementation rules

- Do not rebuild Laruso from scratch.
- Do not unnecessarily replace existing technologies.
- Do not discard working functionality.
- Do not introduce unnecessary dependencies.
- Do not implement all agents at once.
- Do not assume that an AI agent needs its own container.
- Do not create separate model installations for every agent.
- Do not allow agents to bypass backend validation.
- Do not expose one hotel's data to another hotel.
- Do not send real guest communications during development without explicit authorization and appropriate safeguards.
- Keep the code maintainable and properly tested.
- Update documentation when architecture or implementation decisions change.

### Working methodology

Work incrementally.

For each development task:

1. Explain what needs to be built.
2. Identify the relevant existing files and components.
3. Propose the implementation approach.
4. Implement the feature.
5. Run relevant tests.
6. Report what changed.
7. Identify remaining issues.

Do not move to the next major phase until the current phase has been implemented and tested sufficiently.

Ask for clarification before making major decisions that could significantly affect the architecture.

## 19. Long-Term Vision

Laruso aims to become a complete AI-powered hotel management and customer relationship ecosystem.

Hotels should be able to assemble their own digital workforce by selecting specialized agents, configuring their responsibilities, connecting them to hotel systems and managing everything from one platform.

The system should help hotels:

- Operate more efficiently.
- Reduce repetitive administrative work.
- Provide better guest experiences.
- Attract more customers.
- Convert more booking inquiries.
- Recover abandoned reservations.
- Retain previous guests.
- Increase repeat bookings.
- Understand their business better.
- Make more informed decisions.

**The ultimate vision is to give every hotel access to an intelligent, customizable digital workforce that helps it run better, serve guests better and grow its business.**
