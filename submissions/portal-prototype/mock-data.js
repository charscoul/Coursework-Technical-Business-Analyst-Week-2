// Mock data for Legacy Trust Bank - Smart Recovery Portal Prototype

const MOCK_ACCOUNTS = [
  {
    id: "ACC-001",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "07700900123",
    accountNumber: "10023456",
    password: "Password123!",
    smsCode: "4421",
    balance: 1250.00,
    arrears: 350.00,
    daysOverdue: 35,
    status: "Stage 1 Arrears (35 Days)",
    hasActivePlan: false,
    activePlan: null,
    isComplexOrIneligible: false,
    ineligibilityReason: null,
    contactHistory: [
      { date: "2026-10-02 09:14", type: "SMS Alert", summary: "Automated payment reminder sent regarding £350.00 overdue balance." },
      { date: "2026-09-25 14:30", type: "Digital Letter", summary: "Notice of overdue instalment issued to registered email." },
      { date: "2026-09-15 11:05", type: "Outbound Call", summary: "Customer missed scheduled direct debit payment." }
    ],
    eligiblePlans: [
      {
        id: "PLAN-3M-A",
        name: "3-Month Plan",
        durationMonths: 3,
        frequency: "Monthly",
        instalmentAmount: 116.67,
        totalRepayment: 350.00
      },
      {
        id: "PLAN-6M-A",
        name: "6-Month Plan",
        durationMonths: 6,
        frequency: "Monthly",
        instalmentAmount: 58.34,
        totalRepayment: 350.00
      }
    ],
    notes: "Happy Path: Standard arrears, eligible for 3-Month and 6-Month plans, no existing plan."
  },
  {
    id: "ACC-002",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    phone: "07700900456",
    accountNumber: "10034567",
    password: "Password123!",
    smsCode: "8890",
    balance: 3800.00,
    arrears: 1100.00,
    daysOverdue: 62,
    status: "Stage 2 Arrears (62 Days)",
    hasActivePlan: false,
    activePlan: null,
    isComplexOrIneligible: false,
    ineligibilityReason: null,
    contactHistory: [
      { date: "2026-10-05 16:45", type: "Portal Attempt", summary: "Customer logged in via mobile browser; session paused after inactivity." },
      { date: "2026-09-28 10:20", type: "Formal Letter", summary: "Second Arrears Notice delivered via postal mail." },
      { date: "2026-09-10 13:10", type: "Representative Call", summary: "Spoke with collections team; customer requested time to review budget." }
    ],
    eligiblePlans: [
      {
        id: "PLAN-10M-B",
        name: "10-Month Plan",
        durationMonths: 10,
        frequency: "Monthly",
        instalmentAmount: 110.00,
        totalRepayment: 1100.00
      },
      {
        id: "PLAN-12M-B",
        name: "12-Month Plan",
        durationMonths: 12,
        frequency: "Monthly",
        instalmentAmount: 91.67,
        totalRepayment: 1100.00
      }
    ],
    notes: "Happy Path: Higher arrears, higher balance, gets 10-Month and 12-Month plan options."
  },
  {
    id: "ACC-003",
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "07700900789",
    accountNumber: "10045678",
    password: "Password123!",
    smsCode: "5512",
    balance: 840.00,
    arrears: 140.00,
    daysOverdue: 14,
    status: "Active Agreement (14 Days)",
    hasActivePlan: true,
    activePlan: {
      planId: "PLAN-EXISTING-01",
      name: "4-Month Catch-Up Agreement",
      instalmentAmount: 70.00,
      frequency: "Monthly",
      nextPaymentDate: "2026-10-25",
      paymentsMade: 2,
      totalPayments: 4,
      amountRemaining: 140.00,
      agreedOn: "2026-08-25"
    },
    isComplexOrIneligible: false,
    ineligibilityReason: null,
    contactHistory: [
      { date: "2026-09-25 09:00", type: "Payment Received", summary: "Direct Debit payment of £70.00 received towards agreement." },
      { date: "2026-08-25 15:20", type: "Plan Setup", summary: "4-Month Catch-Up Agreement agreed and confirmation letter dispatched." }
    ],
    eligiblePlans: [],
    notes: "Happy Path: Existing plan holder. Verifies routine balance deflection, active plan schedule display, and contact history."
  },
  {
    id: "ACC-004",
    name: "David Okafor",
    email: "david.okafor@example.com",
    phone: "07700900999",
    accountNumber: "10056789",
    password: "Password123!",
    smsCode: "1192",
    balance: 6200.00,
    arrears: 2400.00,
    daysOverdue: 95,
    status: "Stage 3 Arrears - Final Notice (95 Days)",
    hasActivePlan: false,
    activePlan: null,
    isComplexOrIneligible: true,
    ineligibilityReason: "Account arrears exceed automated self-service limits (90+ days delinquent / Stage 3 pre-legal escalation threshold).",
    contactHistory: [
      { date: "2026-10-01 11:30", type: "Urgent Notice", summary: "Pre-escalation warning issued; requires specialist case handling." },
      { date: "2026-09-18 16:15", type: "Outbound Call", summary: "Unsuccessful phone contact attempt; voicemail left." },
      { date: "2026-09-02 10:00", type: "Default Warning", summary: "Formal regulatory default notice sent via recorded delivery." }
    ],
    eligiblePlans: [],
    notes: "Exception Path: Ineligible / High-risk account. Attempting to arrange a plan automatically triggers representative routing with reason prefilled."
  },
  {
    id: "ACC-005",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "07700900321",
    accountNumber: "10067890",
    password: "Password123!",
    smsCode: "7743",
    balance: 1950.00,
    arrears: 500.00,
    daysOverdue: 42,
    status: "Stage 1 Arrears (42 Days)",
    hasActivePlan: false,
    activePlan: null,
    isComplexOrIneligible: false,
    ineligibilityReason: null,
    contactHistory: [
      { date: "2026-10-03 14:10", type: "SMS Alert", summary: "Reminder sent regarding £500.00 missed instalment." },
      { date: "2026-09-20 09:45", type: "Email Notification", summary: "Statement of arrears generated." }
    ],
    eligiblePlans: [
      {
        id: "PLAN-3M-P",
        name: "3-Month Plan",
        durationMonths: 3,
        frequency: "Monthly",
        instalmentAmount: 166.66,
        totalRepayment: 500.00
      },
      {
        id: "PLAN-6M-P",
        name: "6-Month Plan",
        durationMonths: 6,
        frequency: "Monthly",
        instalmentAmount: 83.34,
        totalRepayment: 500.00
      }
    ],
    notes: "Exception Path: User unhappy with automated plans; uses 'Not happy, request a representative' button to trigger routing with plan context."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MOCK_ACCOUNTS };
}
