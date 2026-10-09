## Slide 2

Propose immediate funding approval for Phase 1 of the Smart-Recovery initiative to address growing collections capacity strain.

**Key Stats & Figures:**

- Scope Target: Focuses strictly on simple self-service journeys (38% of total account volume) while preserving human handling for complex cases.

- Operational Baseline: 50 representatives currently managing over 100,000 delinquent accounts.

## Slide 3

Legacy Trust’s customer acquisition grew, but debt recovery infrastructure stalled, forcing heavy reliance on fragile workarounds.

**Key Stats & Figures:**

- Volume Strain: 100,000+ delinquent accounts across personal loans, credit cards, and auto finance handled by 50 representatives.

- Admin Drain: Representatives spend ~71% of their daily time on manual admin (spreadsheet reconciliation, email tracking, status checks).

- Financial Leakage: Delayed actions, missed callbacks, and uncoordinated contact lead to an estimated 15% loss in recoverable revenue.

## Slide 4

Empirical analysis across 75+ stakeholder observations highlights six major pain point categories and three structural root causes.

**Key Stats & Figures:**

- High-Impact Pain Point Concentration: 19 visibility issues, 16 duplication issues, and 15 customer friction pain points.

- Prioritized Jobs-To-Be-Done: Focused on JTBD-01 (Balance Clarity), JTBD-02 (Case History Sync), JTBD-03 (Simple Case Triage), and JTBD-05 (Audit Completeness).

## Slide 5 

Phase 1 capabilities deliver positive 12-month returns driven by recovery uplifts and hard representative time savings.

**Key Stats & Figures:**

- Payment-Plan Selection (SO-03): Conservative 12.94x ROI (£1.09M Net) | Baseline 17.42x ROI (£1.48M Net) | Optimistic 34.58x ROI. Payback period: < 1 month.

- Promise-to-Pay Capture (SO-04): Conservative 7.64x ROI (£649k Net) | Baseline 10.08x ROI (£857k Net) | Optimistic 20.17x ROI.

- Portal Interaction History (SO-06): Conservative 1.45x ROI (£124k Net) | Baseline 8.31x ROI (£706k Net) | Optimistic 30.38x ROI.

- Financial Inputs: £22/hr blended representative cost, £8M baseline monthly recovery, 38% straightforward case share. Implementation costs: £45k (Low) to £85k (Medium) per capability.

## Slide 6

Strict MoSCoW prioritization maintains delivery realism and protects project timelines.

**Key Stats & Figures:**

- In Scope (Must): ID Verification, Real-Time Balance Summary, Payment Plan Selection, Promise-to-Pay Capture, Representative Portal History, Telemetry Tracking.

- Excluded (Won't): Hardship assessments, bespoke repayment negotiations, legal workflows, account detail changes, full legacy database redesigns.

## Slide 7

Standard self-service flows automatically; exceptions immediately route to representatives with full context.

**Key Stats & Figures:**

- Deflection Target: Handles 38% of straightforward accounts fully self-service.

- Exception Triggers: 3 failed ID verification attempts, self-reported hardship, plan disputes, or explicit rep requests.

- Timeout Control: Session pause after 3 minutes of inactivity to protect financial data

## Slide 8

Requirements are mapped into 19 prioritised user stories across 6 structured epics in Jira.

**Key Stats & Figures:**

- Backlog Breakdown: 19 User Stories (Epics: Access & Verification, Account Visibility, Payment Journey, Interaction History & Audit, Telemetry, Routing).

- Critical Path: US-01 (ID Verification) is the primary technical dependency before account balance displays (US-05) or payment commitments (US-10/11) can execute.

## Slide 9

Operational, cultural, and compliance adoption risks are actively addressed through built-in system capabilities.

**Key Stats & Figures & Mitigations:**

- Risk 1: Job Displacement Fears. Mitigation: Staff briefings explaining that automation handles routine queries, allowing representatives to focus on complex cases.

- Risk 2: Lack of Context on Escalations. Mitigation: US-17 displays exact customer portal timeline in the rep console.

- Risk 3: Unmonitored Success. Mitigation: US-20 & US-21 capture real-time journey telemetry and weekly call deflection reports.

## Slide 10

Secure formal leadership approval to proceed from prototype to pilot build.

**Key Stats & Figures:**

- Primary Ask: Approval for Phase 1 pilot implementation funding.

- Immediate Execution Roadmap:

    1. Complete API integration between portal prototype and core database.

    2. Conduct controlled pilot rollout on a initial account subset.

    3. Measure conversion telemetry to validate the 12-month ROI model.

