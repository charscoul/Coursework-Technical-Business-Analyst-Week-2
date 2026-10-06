## Scope

### Must
- Identity verification - ensure user is who they say they are so that correct accounts are managed and view
- Account summary and eligible actions - provide users with general overview to reduce queries, encourage prompt payment and avoid re-contact
- Promise-to-pay capture - allow users to commit to a payment plan, specifying amounts and dates, providing legal backing, greater audit visibility,and reducing later need for escalation
- Eligible payment-plan selection - allow simple cases to select and commit to a payment plan without representative intervention, reducing the need for manual handling
- Interaction history portal for representatives - avoid customers re-providing context when unable to complete portal interactions. Provides build point to improve and integrate internal legacy systems. Also improves visibility of data and general audit trails.

### Should
- Rules-based routing to representatives - prioritizes cases based on predefined rules, ensuring that high-priority or complex cases are handled promptly and efficiently. Also reduces wait times for customers unable to complete interactions via portal. Addresses more internal issues than just the portal, but may be too large of an undertaking for the scope.

### Could
- Automated first contact emails with newly delinquent cases - directs new cases to the self-service portal. May require more concrete internal data systems than currently exist.
- Automated follow-up reminders - enforces follow up appointments and reduces the number of missed cases. May require integration with internal scheduling systems.


### Won't
- Entire legacy data storage rework - involves significant changes to how historical data is stored and accessed, which is beyond the scope of a self-service platform. The platform can be built on top of this existing infrastructure, but with the flexibility to change data sources / storage locations if future changes are made.
- Hardship assessment - evaluating and determining customer eligibility for hardship programs, which may involve complex criteria and manual review, is outside the scope of a self-service portal.
- Bespoke repayment negotiation - custom negotiation of repayment terms with individual customers, which requires significant manual intervention and legal considerations, is not possible with a self-service portal.
- Legal escalation workflow - managing cases that require legal action or escalation, which involves complex processes and coordination with legal teams, is beyond the scope of a self-service portal.
- Advanced personalisation - implementing highly tailored user experiences based on individual user data and behavior, which may require complex algorithms and extensive data integration, is beyond the scope of a self-service portal.
- High risk routing - directing high-risk cases to specialized handling, which may involve complex risk assessment and manual intervention, is beyond the scope of a self-service portal.
- Customer account detail alterations - low impact, as changes to account details are expected to be infrequent and minor, and can be handled through existing support channels. There is a high risk of it going wrong if not handled with appropriate detail.

## Assumptions
- legacy data needed for account summary is accessible enough for Phase 1
- eligibility rules can be agreed without full policy redesign
- operations will support a limited pilot or phased rollout
- routing rules can be defined and implemented without major system changes
- user authentication and authorization mechanisms can be translated to online portal without major changes.

## Constraints
- legacy system data availability
- compliance approval for messages and audit trail
- representative workflow alignment for routed cases

## Deliverables

| Deliverable | Expected Completion | Expected Time Commitment | Potential Blockers | Potential Dependencies | Justifications |
|-------------|-------------------|-------------------------|-------------------|----------------------|----------------|
|To-Be Workflow Diagram | Tuesday PM | 4 hours | Alignment on requirement details, Access to legacy system architecture | As-Is Workflow diagram, Agreed Scope statement | Establishes target state workflow that all Phase 1 deliverables depend upon |
|Jira Backlog | Wednesday PM | 3 Hours | Workflow diagram sign-off, Development resource availability | To-Be Workflow Diagram | Translates workflow into executable user stories and technical tasks |
|Prototype Journey Map | Thursday AM | 0.75 Hours | Design resource constraints | To-Be Workflow Diagram, Jira Backlog | Visualizes end-to-end customer experience to identify pain points and UX improvements |
|Prototype Self-Service Portal | Thursday PM | 6 Hours | Legacy system integration availability, Compliance/security review, Design finalization | Prototype Journey Map | Demonstrates technical feasibility and gathers stakeholder feedback on core functionality |
|Executive Briefing | Friday AM | 2.5 Hours | Prototype review and feedback from stakeholders | Prototype Self-Service Portal | Secures executive alignment and approval to proceed with Phase 2 development |