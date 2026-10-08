/**
 * Pritzki Veterinary Clinic Check-In Kiosk
 * Main interaction logic and screen navigation
 */

// DOM Elements
const phoneScreen = document.getElementById('phoneScreen');
const confirmationScreen = document.getElementById('confirmationScreen');
const instructionsScreen = document.getElementById('instructionsScreen');
const noAppointmentScreen = document.getElementById('noAppointmentScreen');
const issueScreen = document.getElementById('issueScreen');
const completeScreen = document.getElementById('completeScreen');

const areaCodeSelect = document.getElementById('countryCodeSelect');
const phoneInput = document.getElementById('phoneInput');
const lookupBtn = document.getElementById('lookupBtn');
const phoneError = document.getElementById('phoneError');

const confirmBtn = document.getElementById('confirmBtn');
const somethingWrongBtn = document.getElementById('somethingWrongBtn');
const cancelBtn = document.getElementById('cancelBtn');

const finishBtn = document.getElementById('finishBtn');

const tryAgainBtn = document.getElementById('tryAgainBtn');

const startOverFromIssueBtn = document.getElementById('startOverFromIssueBtn');

const restartBtn = document.getElementById('restartBtn');

// State
let currentAppointment = null;

/**
 * Show a specific screen and hide all others
 * @param {HTMLElement} screenToShow - The screen element to display
 */
function showScreen(screenToShow) {
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(screen => screen.classList.remove('active'));
    screenToShow.classList.add('active');
}

/**
 * Format phone number input - just add spaces for readability
 */
function formatPhoneInput(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 4) {
            value = value;
        } else if (value.length <= 8) {
            value = `${value.slice(0, 4)} ${value.slice(4)}`;
        } else {
            // Allow up to 11 digits for international numbers
            value = `${value.slice(0, 4)} ${value.slice(4, 8)} ${value.slice(8, 11)}`.trim();
        }
    }
    
    input.value = value;
}

/**
 * Handle phone number lookup
 */
function handlePhoneLookup() {
    const countryCode = areaCodeSelect.value.trim();
    const localNumber = phoneInput.value.trim();
    
    // Clear previous error
    phoneError.classList.remove('show');
    phoneError.textContent = '';
    
    // Validate country code selection
    if (!countryCode) {
        showError('Please select a country');
        return;
    }
    
    // Validate phone format
    if (!isValidPhoneFormat(localNumber)) {
        showError('Please enter a valid phone number');
        return;
    }
    
    // Look up appointment
    const appointment = lookupAppointmentByPhone(countryCode, localNumber);
    
    if (appointment) {
        // Appointment found for today
        currentAppointment = appointment;
        displayAppointmentDetails(appointment);
        showScreen(confirmationScreen);
    } else {
        // No appointment found for today
        showScreen(noAppointmentScreen);
    }
}

/**
 * Display appointment details on confirmation screen
 * @param {object} appointment - Appointment object
 */
function displayAppointmentDetails(appointment) {
    document.getElementById('petName').textContent = appointment.petName;
    document.getElementById('petType').textContent = appointment.petType;
    document.getElementById('appointmentTime').textContent = appointment.appointmentTime;
    document.getElementById('appointmentDate').textContent = formatAppointmentDate(appointment.appointmentDate);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    phoneError.textContent = message;
    phoneError.classList.add('show');
}

/**
 * Handle appointment confirmation
 */
function handleConfirmAppointment() {
    if (currentAppointment) {
        // Display pet name on instructions screen
        document.getElementById('instructionsPetName').textContent = 
            `Welcome, ${currentAppointment.petName}!`;
        showScreen(instructionsScreen);
    }
}

/**
 * Handle completion of instructions
 */
function handleFinishInstructions() {
    if (currentAppointment) {
        // Display pet name on completion screen
        document.getElementById('completePetName').textContent = 
            `We look forward to seeing ${currentAppointment.petName} soon!`;
        showScreen(completeScreen);
    }
}

/**
 * Handle "Something not right?" button
 */
function handleSomethingWrong() {
    showScreen(issueScreen);
}

/**
 * Handle starting over (back to phone entry)
 */
function handleStartOver() {
    resetForm();
    showScreen(phoneScreen);
}

/**
 * Handle restarting the entire process
 */
function handleRestart() {
    resetForm();
    currentAppointment = null;
    showScreen(phoneScreen);
}

/**
 * Reset the phone input form
 */
function resetForm() {
    areaCodeSelect.value = '';
    phoneInput.value = '';
    phoneError.classList.remove('show');
    phoneError.textContent = '';
    areaCodeSelect.focus();
}

/**
 * Populate country code dropdown with flags and country names
 */
function populateCountryCodes() {
    const countryCodeOptions = getCountryCodeOptions();
    
    countryCodeOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.code;
        optionElement.textContent = `${option.flag} ${option.country} (${option.code})`;
        areaCodeSelect.appendChild(optionElement);
    });
}

/**
 * Event Listeners
 */

// Phone input auto-formatting
phoneInput.addEventListener('input', function() {
    formatPhoneInput(this);
});

// Allow Enter key to trigger lookup
phoneInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handlePhoneLookup();
    }
});

// Area code select
areaCodeSelect.addEventListener('change', function() {
    if (this.value) {
        phoneInput.focus();
    }
});

// Phone lookup button
lookupBtn.addEventListener('click', handlePhoneLookup);

// Confirmation screen buttons
confirmBtn.addEventListener('click', handleConfirmAppointment);
somethingWrongBtn.addEventListener('click', handleSomethingWrong);
cancelBtn.addEventListener('click', handleStartOver);

// Instructions screen button
finishBtn.addEventListener('click', handleFinishInstructions);

// No appointment screen button
tryAgainBtn.addEventListener('click', handleStartOver);

// Issue screen button
startOverFromIssueBtn.addEventListener('click', handleStartOver);

// Completion screen button
restartBtn.addEventListener('click', handleRestart);

/**
 * Auto-populate country codes and focus on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    populateCountryCodes();
    areaCodeSelect.focus();
});
