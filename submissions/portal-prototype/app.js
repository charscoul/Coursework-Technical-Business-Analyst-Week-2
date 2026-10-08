// Legacy Trust Bank - Smart Recovery Portal
// Application controller and interactive flow logic

let currentUser = null;
let currentView = 'landing';
let loginAttemptsRemaining = 3;
let selectedPlan = null;
let currentRoutingContext = {
  reason: '',
  source: '',
  accountNumber: '',
  customerName: '',
  phone: '',
  email: ''
};

// Session Timer Variables
const SESSION_DURATION_SECONDS = 180; // 3 minutes as per US-07 and BPMN
let sessionSecondsRemaining = SESSION_DURATION_SECONDS;
let sessionInterval = null;
let hasWarnedTimeout = false;

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTestSwitcher();
  initEventListeners();
  navigateTo('landing');
});

// Initialize quick-tester switcher in top banner
function initTestSwitcher() {
  const select = document.getElementById('quick-test-user');
  if (!select) return;

  MOCK_ACCOUNTS.forEach((acc) => {
    const opt = document.createElement('option');
    opt.value = acc.id;
    opt.textContent = `${acc.name} (${acc.status} - £${acc.arrears.toFixed(2)} arrears)`;
    select.appendChild(opt);
  });

  const lockoutOpt = document.createElement('option');
  lockoutOpt.value = 'LOCKOUT_DEMO';
  lockoutOpt.textContent = 'Demo: 3-Attempt Failed Login Lockout';
  select.appendChild(lockoutOpt);

  select.addEventListener('change', (e) => {
    handleQuickTesterChange(e.target.value);
  });
}

function handleQuickTesterChange(value) {
  if (value === 'LOCKOUT_DEMO') {
    handleLogout();
    navigateTo('login');
    document.getElementById('login-identifier').value = 'unknown.user@example.com';
    document.getElementById('login-account').value = '99999999';
    document.getElementById('login-password').value = 'wrongpassword';
    document.getElementById('login-method').value = 'password';
    toggleAuthMethod();
    return;
  }

  handleLogout();
  const account = MOCK_ACCOUNTS.find(acc => acc.id === value);
  if (!account) return;

  navigateTo('login');
  document.getElementById('login-identifier').value = account.email;
  document.getElementById('login-account').value = account.accountNumber;
  document.getElementById('login-password').value = account.password;
  document.getElementById('login-method').value = 'password';
  toggleAuthMethod();
}

function initEventListeners() {
  // Navigation links/buttons
  document.getElementById('btn-landing-login')?.addEventListener('click', () => navigateTo('login'));
  document.getElementById('btn-landing-call')?.addEventListener('click', () => {
    setRoutingContext({
      reason: 'General inquiry from public landing page',
      source: 'Landing Page'
    });
    navigateTo('request-call');
  });

  // Login form submit
  document.getElementById('form-login')?.addEventListener('submit', handleLoginSubmit);

  // Auth method toggle
  document.getElementById('login-method')?.addEventListener('change', toggleAuthMethod);

  // Tab switching in Account Summary
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabTarget = e.currentTarget.getAttribute('data-tab');
      switchSummaryTab(tabTarget);
    });
  });

  // Action buttons from Account Summary
  document.getElementById('btn-arrange-plan')?.addEventListener('click', handleStartPlanSelection);
  document.getElementById('btn-summary-request-call')?.addEventListener('click', () => {
    if (!currentUser) return;
    setRoutingContext({
      reason: 'Customer requested consultation from Account Summary',
      source: 'Account Summary',
      customerName: currentUser.name,
      accountNumber: currentUser.accountNumber,
      phone: currentUser.phone,
      email: currentUser.email
    });
    navigateTo('request-call');
  });

  // Action buttons for Ineligible Case container
  document.getElementById('btn-ineligible-request-call')?.addEventListener('click', () => {
    if (!currentUser) return;
    setRoutingContext({
      reason: `Account ineligible for automated self-service plan: ${currentUser.ineligibilityReason || 'Specialist review required'}`,
      source: 'Account Summary (Ineligible Notice)',
      customerName: currentUser.name,
      accountNumber: currentUser.accountNumber,
      phone: currentUser.phone,
      email: currentUser.email
    });
    navigateTo('request-call');
  });

  document.getElementById('btn-ineligible-report-difficulty')?.addEventListener('click', () => {
    navigateTo('vulnerability');
  });

  // Plan Selection Screen: Unhappy with options button
  document.getElementById('btn-plans-unhappy')?.addEventListener('click', () => {
    if (!currentUser) return;
    const planNames = currentUser.eligiblePlans.map(p => p.name).join(', ');
    setRoutingContext({
      reason: `Customer reviewed automated payment plans (${planNames || 'None'}) but requested representative assistance`,
      source: 'Payment Plan Selection',
      customerName: currentUser.name,
      accountNumber: currentUser.accountNumber,
      phone: currentUser.phone,
      email: currentUser.email
    });
    navigateTo('request-call');
  });

  // Plan Confirmation button -> validate checkbox or show pop up
  const btnProceedToPtp = document.getElementById('btn-proceed-to-ptp');
  btnProceedToPtp?.addEventListener('click', () => {
    const confirmCheckbox = document.getElementById('plan-ack-checkbox');
    if (!confirmCheckbox || !confirmCheckbox.checked) {
      showAckModal();
      return;
    }
    setupPtpForm();
    navigateTo('ptp');
  });

  // Promise to pay form submission
  document.getElementById('form-ptp')?.addEventListener('submit', handlePtpSubmit);

  // E-Signature live preview
  document.getElementById('ptp-signature')?.addEventListener('input', updateSignaturePreview);

  // Representative routing form submission
  document.getElementById('form-request-call')?.addEventListener('submit', handleRequestCallSubmit);

  // End session button
  document.getElementById('btn-end-session')?.addEventListener('click', handleLogout);

  // Financial difficulty button (global in footer)
  document.getElementById('btn-report-difficulty')?.addEventListener('click', () => {
    navigateTo('vulnerability');
  });

  // Vulnerability form submit
  document.getElementById('form-vulnerability')?.addEventListener('submit', handleVulnerabilitySubmit);

  // Session timeout modal buttons
  document.getElementById('btn-extend-session')?.addEventListener('click', extendSession);
  document.getElementById('btn-timeout-logout')?.addEventListener('click', handleLogout);
}

// View Navigation router
function navigateTo(viewId) {
  currentView = viewId;

  if (viewId === 'summary' && currentUser) {
    renderAccountSummary();
  }

  // Toggle active view container
  document.querySelectorAll('.portal-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Header & Session bar visibility
  const sessionBar = document.getElementById('session-bar');
  const isPostLogin = currentUser !== null && viewId !== 'landing' && viewId !== 'login';
  
  if (sessionBar) {
    sessionBar.style.display = isPostLogin ? 'flex' : 'none';
  }

  // Manage session timer
  if (isPostLogin) {
    startSessionTimer();
    updateSessionDisplay();
  } else if (viewId === 'landing' || viewId === 'login') {
    stopSessionTimer();
  }

  // Window scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Authentication Method Toggle (Password vs SMS)
function toggleAuthMethod() {
  const method = document.getElementById('login-method')?.value;
  const pwdGroup = document.getElementById('group-password');
  const smsGroup = document.getElementById('group-sms');
  
  if (method === 'sms') {
    pwdGroup.style.display = 'none';
    smsGroup.style.display = 'block';
  } else {
    pwdGroup.style.display = 'block';
    smsGroup.style.display = 'none';
  }
}

// Handle Login Submission & Attempt Limiter
function handleLoginSubmit(e) {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier')?.value.trim();
  const accountNum = document.getElementById('login-account')?.value.trim();
  const method = document.getElementById('login-method')?.value;
  const password = document.getElementById('login-password')?.value.trim();
  const smsCode = document.getElementById('login-sms')?.value.trim();

  // Find match in MOCK_ACCOUNTS
  const match = MOCK_ACCOUNTS.find(acc => {
    const idMatches = (acc.email.toLowerCase() === identifier.toLowerCase()) || 
                      (acc.phone === identifier);
    const accMatches = (acc.accountNumber === accountNum);
    const authMatches = (method === 'sms') ? (acc.smsCode === smsCode) : (acc.password === password);
    return idMatches && accMatches && authMatches;
  });

  const alertBox = document.getElementById('login-alert');

  if (match) {
    // Successful login
    currentUser = match;
    loginAttemptsRemaining = 3;
    if (alertBox) alertBox.style.display = 'none';
    
    renderAccountSummary();
    navigateTo('summary');
  } else {
    // Failed verification
    loginAttemptsRemaining--;
    
    if (loginAttemptsRemaining > 0) {
      if (alertBox) {
        alertBox.className = 'alert alert-danger';
        alertBox.innerHTML = `<strong>Verification failed:</strong> Invalid account credentials entered. You have <strong>${loginAttemptsRemaining} attempt${loginAttemptsRemaining === 1 ? '' : 's'} remaining</strong> before your account is locked for self-service.`;
        alertBox.style.display = 'block';
      }
    } else {
      // 0 attempts remaining: Trigger representative referral with autofill as required by US-02 / specification
      setRoutingContext({
        reason: 'Account locked - Exceeded maximum login verification attempts (forgot login details)',
        source: 'Security Lockout (3 Failed Attempts)',
        accountNumber: accountNum,
        customerName: '',
        email: identifier.includes('@') ? identifier : '',
        phone: !identifier.includes('@') ? identifier : ''
      });

      if (alertBox) alertBox.style.display = 'none';
      loginAttemptsRemaining = 3; // reset for next demo
      navigateTo('request-call');
    }
  }
}

// Set up prefilled context for the Representative Routing Page
function setRoutingContext(context) {
  currentRoutingContext = {
    reason: context.reason || 'Customer inquiry',
    source: context.source || 'Portal',
    accountNumber: context.accountNumber || (currentUser ? currentUser.accountNumber : ''),
    customerName: context.customerName || (currentUser ? currentUser.name : ''),
    phone: context.phone || (currentUser ? currentUser.phone : ''),
    email: context.email || (currentUser ? currentUser.email : '')
  };

  // Populate fields in the routing view
  const nameField = document.getElementById('rep-name');
  const phoneField = document.getElementById('rep-phone');
  const emailField = document.getElementById('rep-email');
  const accField = document.getElementById('rep-account');
  const reasonField = document.getElementById('rep-reason');
  const sessionSummaryField = document.getElementById('rep-session-details');

  if (nameField) nameField.value = currentRoutingContext.customerName;
  if (phoneField) phoneField.value = currentRoutingContext.phone;
  if (emailField) emailField.value = currentRoutingContext.email;
  if (accField) accField.value = currentRoutingContext.accountNumber;
  if (reasonField) reasonField.value = currentRoutingContext.reason;

  if (sessionSummaryField) {
    const timestamp = new Date().toLocaleString('en-GB');
    sessionSummaryField.value = `Referral Source: ${currentRoutingContext.source}\nLogged Event: ${currentRoutingContext.reason}\nSession Timestamp: ${timestamp}`;
  }
}

// Render Account Summary View
function renderAccountSummary() {
  if (!currentUser) return;

  // Basic Profile details
  document.getElementById('sum-customer-name').textContent = currentUser.name;
  document.getElementById('sum-account-number').textContent = currentUser.accountNumber;
  document.getElementById('sum-balance').textContent = `£${currentUser.balance.toFixed(2)}`;
  document.getElementById('sum-arrears').textContent = `£${currentUser.arrears.toFixed(2)}`;
  document.getElementById('sum-status').textContent = currentUser.status;

  // Plan tab status indicator
  const planTabLabel = document.getElementById('tab-plan-label');
  const planIndicator = document.getElementById('plan-status-indicator');
  const planStatusSub = document.getElementById('plan-status-sub');
  const arrangeBtn = document.getElementById('btn-arrange-plan');
  const existingPlanContainer = document.getElementById('existing-plan-container');
  const noPlanContainer = document.getElementById('no-plan-container');
  const ineligiblePlanContainer = document.getElementById('ineligible-plan-container');

  if (currentUser.hasActivePlan && currentUser.activePlan) {
    planTabLabel.textContent = 'Agreed Plans';
    planIndicator.className = 'badge badge-success';
    planIndicator.textContent = 'Active Plan';
    if (planStatusSub) planStatusSub.textContent = 'Direct debit schedule active';
    existingPlanContainer.style.display = 'block';
    noPlanContainer.style.display = 'none';
    if (ineligiblePlanContainer) ineligiblePlanContainer.style.display = 'none';
    if (arrangeBtn) arrangeBtn.style.display = 'none';

    // Populate active plan details
    const p = currentUser.activePlan;
    document.getElementById('active-plan-name').textContent = p.name;
    document.getElementById('active-plan-instalment').textContent = `£${p.instalmentAmount.toFixed(2)} / ${p.frequency}`;
    document.getElementById('active-plan-next-date').textContent = p.nextPaymentDate;
    document.getElementById('active-plan-progress').textContent = `${p.paymentsMade} of ${p.totalPayments} instalments completed`;
    document.getElementById('active-plan-remaining').textContent = `£${p.amountRemaining.toFixed(2)}`;
  } else if (currentUser.isComplexOrIneligible) {
    // Ineligible for online plan selection: Do not show the Arrange a Plan button!
    planTabLabel.textContent = 'Account Resolution';
    planIndicator.className = 'badge badge-warning';
    planIndicator.textContent = 'Specialist Review';
    if (planStatusSub) planStatusSub.textContent = 'Ineligible for online self-service';
    existingPlanContainer.style.display = 'none';
    noPlanContainer.style.display = 'none';
    if (ineligiblePlanContainer) ineligiblePlanContainer.style.display = 'block';
    if (arrangeBtn) arrangeBtn.style.display = 'none';

    const reasonEl = document.getElementById('ineligible-reason-text');
    if (reasonEl) {
      reasonEl.textContent = currentUser.ineligibilityReason || 'This account requires specialist review under bank credit policy.';
    }
    const accRefEl = document.getElementById('ineligible-account-ref');
    if (accRefEl) {
      accRefEl.textContent = currentUser.accountNumber;
    }
  } else {
    // No plan: Eligible for online self-service arrangement
    planTabLabel.textContent = 'Arrange a Plan';
    planIndicator.className = 'badge badge-danger';
    planIndicator.textContent = 'No Active Plan';
    if (planStatusSub) planStatusSub.textContent = 'Self-service resolution active';
    existingPlanContainer.style.display = 'none';
    noPlanContainer.style.display = 'block';
    if (ineligiblePlanContainer) ineligiblePlanContainer.style.display = 'none';
    if (arrangeBtn) {
      arrangeBtn.style.display = 'inline-flex';
      arrangeBtn.textContent = 'Arrange a Plan';
    }
  }

  // Populate Contact History
  const historyTbody = document.getElementById('contact-history-tbody');
  if (historyTbody) {
    historyTbody.innerHTML = '';
    currentUser.contactHistory.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="white-space: nowrap; font-variant-numeric: tabular-nums;">${item.date}</td>
        <td><span class="badge badge-neutral">${item.type}</span></td>
        <td>${item.summary}</td>
      `;
      historyTbody.appendChild(tr);
    });
  }

  // Default to Plans tab if no plan, otherwise summary overview
  switchSummaryTab(currentUser.hasActivePlan ? 'contact' : 'plans');
}

function switchSummaryTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  document.getElementById('tab-pane-contact')?.classList.toggle('active', tabName === 'contact');
  document.getElementById('tab-pane-plans')?.classList.toggle('active', tabName === 'plans');
}

// Handle "Arrange a Plan" action
function handleStartPlanSelection() {
  if (!currentUser) return;

  // Rule: Check if case is complex or ineligible (e.g. David Okafor, stage 3 high arrears)
  if (currentUser.isComplexOrIneligible) {
    setRoutingContext({
      reason: `Automated plan eligibility evaluation: Ineligible. ${currentUser.ineligibilityReason}`,
      source: 'Plan Eligibility Engine',
      customerName: currentUser.name,
      accountNumber: currentUser.accountNumber,
      phone: currentUser.phone,
      email: currentUser.email
    });
    navigateTo('request-call');
    return;
  }

  // Render plan options
  renderPaymentPlans();
  navigateTo('plans');
}

// Render payment plan options for current user
function renderPaymentPlans() {
  const container = document.getElementById('plans-list-container');
  if (!container) return;
  container.innerHTML = '';

  const customerNameEl = document.getElementById('plans-customer-name');
  if (customerNameEl) customerNameEl.textContent = currentUser.name;
  
  const arrearsAmountEl = document.getElementById('plans-arrears-amount');
  if (arrearsAmountEl) arrearsAmountEl.textContent = `£${currentUser.arrears.toFixed(2)}`;

  if (!currentUser.eligiblePlans || currentUser.eligiblePlans.length === 0) {
    container.innerHTML = `
      <div class="alert alert-warning" style="grid-column: 1 / -1;">
        No automated payment plans are available for this account type. Please contact our collections specialist team.
      </div>
    `;
    return;
  }

  currentUser.eligiblePlans.forEach(plan => {
    const card = document.createElement('div');
    card.className = 'plan-card';
    card.innerHTML = `
      <div>
        <div class="plan-name">${plan.name}</div>
        <div class="plan-price">£${plan.instalmentAmount.toFixed(2)}</div>
        <div class="plan-frequency">per month for ${plan.durationMonths} months</div>
        <p style="font-size: 13px; color: var(--color-text-muted); margin: 12px 0 18px 0;">
          Total repayable: £${plan.totalRepayment.toFixed(2)}
        </p>
      </div>
      <button class="btn btn-primary btn-block" onclick="selectPaymentPlan('${plan.id}')">Select this plan</button>
    `;
    container.appendChild(card);
  });
}

// Select a plan and proceed to plan details/confirmation
window.selectPaymentPlan = function(planId) {
  if (!currentUser) return;
  selectedPlan = currentUser.eligiblePlans.find(p => p.id === planId);
  if (!selectedPlan) return;

  renderPlanDetails();
  navigateTo('plan-details');
};

// Render plan confirmation details
function renderPlanDetails() {
  if (!currentUser || !selectedPlan) return;

  document.getElementById('confirm-plan-name').textContent = selectedPlan.name;
  document.getElementById('confirm-instalment').textContent = `£${selectedPlan.instalmentAmount.toFixed(2)} / month`;
  document.getElementById('confirm-duration').textContent = `${selectedPlan.durationMonths} Months`;
  document.getElementById('confirm-total').textContent = `£${selectedPlan.totalRepayment.toFixed(2)}`;
  document.getElementById('confirm-arrears-cleared').textContent = `£${currentUser.arrears.toFixed(2)}`;

  // Calculate schedule dates
  const today = new Date();
  const scheduleTbody = document.getElementById('plan-schedule-tbody');
  if (scheduleTbody) {
    scheduleTbody.innerHTML = '';
    for (let i = 1; i <= selectedPlan.durationMonths; i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(today.getMonth() + i);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>Instalment ${i}</td>
        <td style="font-variant-numeric: tabular-nums;">${dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        <td style="font-weight: 600;">£${selectedPlan.instalmentAmount.toFixed(2)}</td>
      `;
      scheduleTbody.appendChild(tr);
    }
  }

  // Reset agreement checkbox
  const chk = document.getElementById('plan-ack-checkbox');
  if (chk) chk.checked = false;
}

function showAckModal() {
  const modal = document.getElementById('modal-ack-required');
  if (modal) modal.classList.add('active');
}

window.closeAckModal = function() {
  const modal = document.getElementById('modal-ack-required');
  if (modal) modal.classList.remove('active');
};

// Setup Promise to Pay form
function setupPtpForm() {
  if (!currentUser || !selectedPlan) return;

  document.getElementById('ptp-plan-name').textContent = selectedPlan.name;
  const amountField = document.getElementById('ptp-amount');
  if (amountField) {
    amountField.value = selectedPlan.instalmentAmount.toFixed(2);
  }

  // Set default due date to 14 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 14);
  const dateInput = document.getElementById('ptp-date');
  if (dateInput) {
    dateInput.value = defaultDate.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Pre-fill signature input and preview with current user name
  const sigInput = document.getElementById('ptp-signature');
  const consentChk = document.getElementById('ptp-esign-consent');
  if (sigInput) {
    sigInput.value = currentUser.name || '';
    updateSignaturePreview();
  }
  if (consentChk) {
    consentChk.checked = false;
  }
}

function updateSignaturePreview() {
  const sigInput = document.getElementById('ptp-signature');
  const previewBox = document.getElementById('ptp-signature-preview');
  const sigText = document.getElementById('ptp-sig-text');
  const sigMeta = document.getElementById('ptp-sig-meta');

  if (!sigInput || !previewBox || !sigText || !sigMeta) return;

  const val = sigInput.value.trim();
  if (val.length > 0) {
    sigText.textContent = val;
    sigMeta.textContent = `Timestamp: ${new Date().toLocaleString('en-GB')} | Verified Portal Session ID: LTB-SEC-${Math.floor(100000 + Math.random() * 900000)}`;
    previewBox.style.display = 'flex';
  } else {
    previewBox.style.display = 'none';
  }
}

// Handle Promise to Pay submission
function handlePtpSubmit(e) {
  e.preventDefault();
  if (!currentUser || !selectedPlan) return;

  const promisedAmount = parseFloat(document.getElementById('ptp-amount').value);
  const promisedDate = document.getElementById('ptp-date').value;
  const paymentMethod = document.getElementById('ptp-method').value;
  const signature = document.getElementById('ptp-signature')?.value.trim() || currentUser.name;
  const signedAt = new Date().toLocaleString('en-GB') + ' (UTC)';

  // Generate Agreement Confirmation Reference
  const agreementRef = `LTB-PTP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Populate Agreement Confirmation view
  document.getElementById('conf-ref-code').textContent = agreementRef;
  document.getElementById('conf-customer-name').textContent = currentUser.name;
  document.getElementById('conf-account').textContent = currentUser.accountNumber;
  document.getElementById('conf-plan-name').textContent = selectedPlan.name;
  document.getElementById('conf-first-amount').textContent = `£${promisedAmount.toFixed(2)}`;
  document.getElementById('conf-first-date').textContent = new Date(promisedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('conf-method').textContent = paymentMethod;
  document.getElementById('conf-signature').textContent = signature;
  document.getElementById('conf-signed-at').textContent = signedAt;
  document.getElementById('conf-email-target').textContent = currentUser.email;
  document.getElementById('conf-phone-target').textContent = currentUser.phone;

  // Add event to customer's contact history
  currentUser.contactHistory.unshift({
    date: new Date().toLocaleString('en-GB').replace(',', ''),
    type: 'PTP Agreed',
    summary: `Digital Promise to Pay committed with electronic signature (${signature}): £${promisedAmount.toFixed(2)} due on ${promisedDate} under ${selectedPlan.name}. Ref: ${agreementRef}`
  });

  // Mark account as now having active plan
  currentUser.hasActivePlan = true;
  currentUser.activePlan = {
    planId: selectedPlan.id,
    name: selectedPlan.name,
    instalmentAmount: selectedPlan.instalmentAmount,
    frequency: 'Monthly',
    nextPaymentDate: promisedDate,
    paymentsMade: 0,
    totalPayments: selectedPlan.durationMonths,
    amountRemaining: selectedPlan.totalRepayment,
    agreedOn: new Date().toISOString().split('T')[0]
  };

  navigateTo('confirmation');
}

// Handle Representative Request Submission
function handleRequestCallSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('rep-name').value;
  const phone = document.getElementById('rep-phone').value;
  const reason = document.getElementById('rep-reason').value;
  const weekday = document.getElementById('rep-weekday')?.value || 'Any Weekday';
  const timeSlot = document.getElementById('rep-time-slot')?.value || 'Morning (09:00 - 12:00)';
  const slot = `${weekday} — ${timeSlot}`;
  const notes = document.getElementById('rep-notes').value;

  const callbackRef = `LTB-REP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  document.getElementById('rep-conf-ref').textContent = callbackRef;
  document.getElementById('rep-conf-name').textContent = name || 'Customer';
  document.getElementById('rep-conf-phone').textContent = phone;
  document.getElementById('rep-conf-slot').textContent = slot;
  document.getElementById('rep-conf-reason').textContent = reason;

  // Show confirmation section, hide form
  document.getElementById('rep-form-container').style.display = 'none';
  document.getElementById('rep-success-container').style.display = 'block';
}

// Reset Representative Form
window.resetRepresentativeForm = function() {
  document.getElementById('rep-form-container').style.display = 'block';
  document.getElementById('rep-success-container').style.display = 'none';
  document.getElementById('form-request-call').reset();
  if (currentUser) {
    navigateTo('summary');
  } else {
    navigateTo('landing');
  }
};

// Handle Vulnerability Reporting Submission
function handleVulnerabilitySubmit(e) {
  e.preventDefault();
  const category = document.getElementById('vuln-category').value;
  const refCode = `LTB-CARE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  document.getElementById('vuln-ref-code').textContent = refCode;
  document.getElementById('vuln-category-display').textContent = category;

  if (currentUser) {
    currentUser.contactHistory.unshift({
      date: new Date().toLocaleString('en-GB').replace(',', ''),
      type: 'Vulnerability Hold',
      summary: `Customer declared financial vulnerability (${category}). Temporary breathing space hold applied; case queued for urgent agent evaluation. Ref: ${refCode}`
    });
  }

  document.getElementById('vuln-form-container').style.display = 'none';
  document.getElementById('vuln-success-container').style.display = 'block';
}

window.closeVulnerabilityModal = function() {
  document.getElementById('vuln-form-container').style.display = 'block';
  document.getElementById('vuln-success-container').style.display = 'none';
  document.getElementById('form-vulnerability').reset();
  
  if (currentUser) {
    renderAccountSummary();
    navigateTo('summary');
  } else {
    navigateTo('landing');
  }
};

// Session Timer and Inactivity Handling (US-07)
function startSessionTimer() {
  stopSessionTimer();
  sessionSecondsRemaining = SESSION_DURATION_SECONDS;
  hasWarnedTimeout = false;
  updateTimerDisplay();

  sessionInterval = setInterval(() => {
    sessionSecondsRemaining--;
    updateTimerDisplay();

    // 1-minute warning check
    if (sessionSecondsRemaining === 60 && !hasWarnedTimeout) {
      hasWarnedTimeout = true;
      showTimeoutWarningModal();
    }

    // Session expiration check
    if (sessionSecondsRemaining <= 0) {
      stopSessionTimer();
      triggerSessionTimeout();
    }
  }, 1000);
}

function stopSessionTimer() {
  if (sessionInterval) {
    clearInterval(sessionInterval);
    sessionInterval = null;
  }
}

function extendSession() {
  sessionSecondsRemaining = SESSION_DURATION_SECONDS;
  hasWarnedTimeout = false;
  hideTimeoutWarningModal();
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const timerBadge = document.getElementById('session-timer-display');
  if (!timerBadge) return;

  const mins = Math.floor(sessionSecondsRemaining / 60);
  const secs = sessionSecondsRemaining % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  timerBadge.textContent = formatted;

  if (sessionSecondsRemaining <= 60) {
    timerBadge.classList.add('warning');
  } else {
    timerBadge.classList.remove('warning');
  }
}

function updateSessionDisplay() {
  if (!currentUser) return;
  document.getElementById('session-user-name').textContent = currentUser.name;
}

function showTimeoutWarningModal() {
  const modal = document.getElementById('modal-timeout-warning');
  if (modal) modal.classList.add('active');
}

function hideTimeoutWarningModal() {
  const modal = document.getElementById('modal-timeout-warning');
  if (modal) modal.classList.remove('active');
}

function triggerSessionTimeout() {
  hideTimeoutWarningModal();
  const modalExpired = document.getElementById('modal-timeout-expired');
  if (modalExpired) modalExpired.classList.add('active');

  // Log session timeout in contact history
  if (currentUser) {
    currentUser.contactHistory.unshift({
      date: new Date().toLocaleString('en-GB').replace(',', ''),
      type: 'Session Timeout',
      summary: 'Session automatically paused and cleared after 3 minutes of customer inactivity.'
    });
  }

  // Reset user session
  currentUser = null;
  selectedPlan = null;
  document.getElementById('session-bar').style.display = 'none';
}

window.acknowledgeSessionTimeout = function() {
  const modalExpired = document.getElementById('modal-timeout-expired');
  if (modalExpired) modalExpired.classList.remove('active');
  navigateTo('landing');
};

function handleLogout() {
  stopSessionTimer();
  hideTimeoutWarningModal();
  currentUser = null;
  selectedPlan = null;
  document.getElementById('session-bar').style.display = 'none';
  navigateTo('landing');
}
