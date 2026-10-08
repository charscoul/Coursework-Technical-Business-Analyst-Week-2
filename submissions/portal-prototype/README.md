# Legacy Trust Bank - Smart Recovery Portal Prototype (Phase 1)

This folder contains a simple, clickable, bank-grade HTML/CSS/JavaScript prototype of the **Smart Recovery Customer Self-Service Portal** designed for **Legacy Trust Bank**, adhering to the To-Be BPMN process map, the Phase 1 Scope Statement, and the Jira Backlog specifications.

---

## 1. Structure & Architecture

- **`index.html`**: The unified, accessible, responsive portal interface containing all eight key views and contextual modals.
- **`styles.css`**: Austere, professional banking aesthetic (deep institutional slate/navy, accessible high-contrast typography, clear tabular summaries, no decorative fluff).
- **`mock-data.js`**: Pre-configured account records, arrears profiles, contact histories, and pre-approved repayment plans.
- **`app.js`**: Client-side state machine handling authentication attempt limiting (3-strike lockout), session countdown timer (3 minutes with 1-minute warning modal), plan selection logic, digital promise-to-pay commitment, representative callback routing with autofilled context, and vulnerability declaration.

---

## 2. Test Personas & Credentials Matrix

| Persona Name | Email / Identifier | Account Ref | Password | SMS Code | Balance / Arrears | Scenario & Target Path |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | `sarah.jenkins@example.com`<br>*(or `07700900123`)* | `10023456` | `Password123!` | `4421` | Balance: £1,250.00<br>Arrears: £350.00 (35 days) | **Happy Path 1 (Standard Arrears Plan)**<br>No active plan &rarr; selects 3M or 6M plan &rarr; commits digital PTP &rarr; receives agreement confirmation. |
| **Marcus Vance** | `marcus.vance@example.com`<br>*(or `07700900456`)* | `10034567` | `Password123!` | `8890` | Balance: £3,800.00<br>Arrears: £1,100.00 (62 days) | **Happy Path 2 (Higher Balance / Extended Term)**<br>Eligible for extended 10M &amp; 12M plans &rarr; selects plan &rarr; commits digital PTP. |
| **Elena Rostova** | `elena.rostova@example.com`<br>*(or `07700900789`)* | `10045678` | `Password123!` | `5512` | Balance: £840.00<br>Arrears: £140.00 (14 days) | **Happy Path 3 (Active Plan Holder)**<br>Routine balance deflection. Displays green "Active Plan" badge and instalment schedule, plus contact history. |
| **David Okafor** | `david.okafor@example.com`<br>*(or `07700900999`)* | `10056789` | `Password123!` | `1192` | Balance: £6,200.00<br>Arrears: £2,400.00 (95 days) | **Exception Path 1 (Ineligible / High Risk Case)**<br>Stage 3 arrears exceed portal limits. "Arrange a Plan" button is completely suppressed. Account Summary displays an explicit notice explaining why automated plans cannot be offered and outlines available options (Specialist Callback, Vulnerability Form, Direct Phone Line). |
| **Priya Sharma** | `priya.sharma@example.com`<br>*(or `07700900321`)* | `10067890` | `Password123!` | `7743` | Balance: £1,950.00<br>Arrears: £500.00 (42 days) | **Exception Path 2 (Unhappy with Options)**<br>Reviews plans &rarr; clicks *"Not happy with these options? Request a representative"* &rarr; pre-fills representative callback form. |
| **Lockout Demo** | Any invalid email/account | Invalid | Invalid | Invalid | N/A | **Exception Path 3 (3 Failed Attempts Lockout)**<br>Fails 3 consecutive logins &rarr; 0 attempts remaining &rarr; automatically redirects to representative routing page with lockout reason prefilled. |
| **Any User** | Global Footer Button | N/A | N/A | N/A | N/A | **Exception Path 4 (Report Financial Difficulty)**<br>Clicking "Report Financial Difficulty" applies a temporary statutory breathing space hold (up to 30 days) and clearly informs the customer that this is not a free pass; the case is flagged for urgent evaluation by a specialist agent. |

---

## 3. How to Run & Verify

1. Open `submissions/portal-prototype/index.html` directly in any web browser.
2. Use the **Interactive Demo Persona** dropdown at the very top to instantly populate credentials for any test scenario, or type the credentials manually.
3. Test the full end-to-end customer journey from landing to agreement confirmation (including digital e-signature commitment) and callback scheduling.
