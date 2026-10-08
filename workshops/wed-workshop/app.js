// ==================== STATE MANAGEMENT ====================

let appState = {
    currentUser: null,
    users: {},
    pets: {},
    appointments: {},
    selectedTimeSlot: null
};

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAppState();
    populateAvailableTimeSlots();
});

// ==================== NAVIGATION ====================

function navigateTo(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Initialize page-specific content
        if (pageName === 'dashboard') {
            initializeDashboard();
        } else if (pageName === 'appointments') {
            initializeAppointmentPage();
        }
    }
}

// ==================== AUTHENTICATION ====================

function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('reg-firstName').value.trim();
    const lastName = document.getElementById('reg-lastName').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const city = document.getElementById('reg-city').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    
    // Validation
    if (password !== passwordConfirm) {
        showMessage('Passwords do not match!');
        return;
    }
    
    if (appState.users[email]) {
        showMessage('Email already registered!');
        return;
    }
    
    // Register user
    const userId = 'user_' + Date.now();
    appState.users[email] = {
        id: userId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        password // In a real app, this would be hashed
    };
    
    appState.pets[userId] = [];
    appState.appointments[userId] = [];
    
    saveAppState();
    
    showMessage('Account created successfully! Logging in...');
    setTimeout(() => {
        loginUser(email, firstName + ' ' + lastName, userId);
        navigateTo('dashboard');
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    const user = appState.users[email];
    
    if (!user || user.password !== password) {
        showMessage('Invalid email or password. Try again or recover your password.');
        setTimeout(() => navigateTo('password-recovery'), 1500);
        return;
    }
    
    loginUser(email, user.firstName + ' ' + user.lastName, user.id);
    showMessage('Login successful!');
    setTimeout(() => navigateTo('dashboard'), 1000);
}

function handlePasswordRecovery(event) {
    event.preventDefault();
    
    const email = document.getElementById('recovery-email').value.trim();
    
    if (appState.users[email]) {
        showMessage('Password reset link sent to ' + email);
        setTimeout(() => navigateTo('login'), 2000);
    } else {
        showMessage('Email not found in our system.');
    }
}

function loginUser(email, name, userId) {
    appState.currentUser = {
        email,
        name,
        id: userId
    };
    saveAppState();
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        appState.currentUser = null;
        saveAppState();
        document.getElementById('register-form').reset();
        document.getElementById('login-form').reset();
        navigateTo('landing');
        showMessage('Logged out successfully');
    }
}

// ==================== DASHBOARD ====================

function initializeDashboard() {
    if (!appState.currentUser) {
        navigateTo('login');
        return;
    }
    
    const userName = appState.currentUser.name.split(' ')[0];
    document.getElementById('dashboard-name').textContent = userName;
    
    // Display pets
    const petsList = document.getElementById('pets-list');
    const userPets = appState.pets[appState.currentUser.id] || [];
    
    petsList.innerHTML = '';
    if (userPets.length === 0) {
        petsList.innerHTML = '<p style="grid-column: 1/-1; color: #999; padding: 30px 0;">No pets added yet</p>';
    } else {
        userPets.forEach(pet => {
            const petEmoji = getPetEmoji(pet.species);
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.innerHTML = `
                <div class="pet-emoji">${petEmoji}</div>
                <div class="pet-name">${pet.name}</div>
                <div class="pet-info">${pet.species} • ${pet.age} years</div>
            `;
            petsList.appendChild(petCard);
        });
    }
    
    // Display appointments
    const appointmentsList = document.getElementById('appointments-list');
    const userAppointments = appState.appointments[appState.currentUser.id] || [];
    
    appointmentsList.innerHTML = '';
    if (userAppointments.length === 0) {
        appointmentsList.innerHTML = '<p class="no-appointments">No upcoming appointments scheduled</p>';
    } else {
        userAppointments.forEach(apt => {
            const aptItem = document.createElement('div');
            aptItem.className = 'appointment-item';
            aptItem.innerHTML = `
                <div class="pet-name">${apt.petName}</div>
                <div class="date-time">📅 ${apt.date} at ${apt.time}</div>
                <div class="vet-name">${apt.vetName}</div>
            `;
            appointmentsList.appendChild(aptItem);
        });
    }
}

// ==================== PET MANAGEMENT ====================

function handlePetSubmit(event) {
    event.preventDefault();
    
    if (!appState.currentUser) {
        navigateTo('login');
        return;
    }
    
    const petName = document.getElementById('pet-name').value.trim();
    const species = document.getElementById('pet-species').value;
    const breed = document.getElementById('pet-breed').value.trim();
    const age = parseFloat(document.getElementById('pet-age').value);
    const weight = parseFloat(document.getElementById('pet-weight').value) || null;
    const medicalNotes = document.getElementById('pet-medical-notes').value.trim();
    
    const pet = {
        id: 'pet_' + Date.now(),
        name: petName,
        species,
        breed,
        age,
        weight,
        medicalNotes
    };
    
    // Add to user's pets
    if (!appState.pets[appState.currentUser.id]) {
        appState.pets[appState.currentUser.id] = [];
    }
    appState.pets[appState.currentUser.id].push(pet);
    
    saveAppState();
    
    showMessage('Pet information saved successfully!');
    
    // Reset form and update list
    document.getElementById('pet-form').reset();
    updatePetsSummary();
    
    // Update pets dropdown in appointments
    updatePetDropdown();
}

function updatePetsSummary() {
    const summaryList = document.getElementById('pets-summary-list');
    const userPets = appState.pets[appState.currentUser.id] || [];
    
    summaryList.innerHTML = '';
    if (userPets.length === 0) {
        summaryList.innerHTML = '<p style="color: #999; font-style: italic;">No pets added yet</p>';
    } else {
        userPets.forEach(pet => {
            const item = document.createElement('div');
            item.className = 'pet-summary-item';
            item.innerHTML = `
                <div class="species">${getPetEmoji(pet.species)} ${pet.name}</div>
                <div class="details">${pet.species} • ${pet.breed || 'Breed not specified'} • ${pet.age} years old</div>
            `;
            summaryList.appendChild(item);
        });
    }
}

function getPetEmoji(species) {
    const emojis = {
        'Dog': '🐕',
        'Cat': '🐱',
        'Rabbit': '🐰',
        'Hamster': '🐹',
        'Bird': '🐦',
        'Other': '🐾'
    };
    return emojis[species] || '🐾';
}

// ==================== APPOINTMENT BOOKING ====================

function initializeAppointmentPage() {
    if (!appState.currentUser) {
        navigateTo('login');
        return;
    }
    
    updatePetDropdown();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('apt-date').setAttribute('min', today);
}

function updatePetDropdown() {
    const petDropdown = document.getElementById('apt-pet');
    const userPets = appState.pets[appState.currentUser.id] || [];
    
    petDropdown.innerHTML = '<option value="">Choose your pet...</option>';
    
    userPets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet.id;
        option.textContent = pet.name + ' (' + pet.species + ')';
        petDropdown.appendChild(option);
    });
}

function updateVeterinarians() {
    // Could be extended to show different vets per branch
    // For now, showing all vets regardless of branch
}

function populateAvailableTimeSlots() {
    const timeSlotContainer = document.getElementById('time-slots');
    
    // Generate available time slots
    const slots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];
    
    slots.forEach(slot => {
        const slotButton = document.createElement('div');
        slotButton.className = 'time-slot';
        slotButton.textContent = slot;
        slotButton.onclick = function() {
            // Remove selection from all slots
            document.querySelectorAll('.time-slot').forEach(s => {
                s.classList.remove('selected');
            });
            // Select this slot
            this.classList.add('selected');
            appState.selectedTimeSlot = slot;
        };
        timeSlotContainer.appendChild(slotButton);
    });
}

function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    if (!appState.currentUser) {
        navigateTo('login');
        return;
    }
    
    const branch = document.getElementById('apt-branch').value;
    const type = document.getElementById('apt-type').value;
    const vetId = document.getElementById('apt-vet').value;
    const vetName = document.getElementById('apt-vet').options[document.getElementById('apt-vet').selectedIndex].text;
    const reason = document.getElementById('apt-reason').value;
    const petId = document.getElementById('apt-pet').value;
    const date = document.getElementById('apt-date').value;
    const notes = document.getElementById('apt-notes').value.trim();
    
    if (!appState.selectedTimeSlot) {
        showMessage('Please select an appointment time');
        return;
    }
    
    // Find pet name
    const userPets = appState.pets[appState.currentUser.id] || [];
    const selectedPet = userPets.find(p => p.id === petId);
    const petName = selectedPet ? selectedPet.name : 'Pet';
    
    const appointment = {
        id: 'apt_' + Date.now(),
        branch,
        type,
        vetName,
        reason,
        petId,
        petName,
        date,
        time: appState.selectedTimeSlot,
        notes,
        status: 'confirmed'
    };
    
    if (!appState.appointments[appState.currentUser.id]) {
        appState.appointments[appState.currentUser.id] = [];
    }
    appState.appointments[appState.currentUser.id].push(appointment);
    
    saveAppState();
    
    showMessage('Appointment booked successfully for ' + petName + ' on ' + date + ' at ' + appState.selectedTimeSlot);
    
    setTimeout(() => {
        document.getElementById('appointment-form').reset();
        appState.selectedTimeSlot = null;
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        navigateTo('dashboard');
    }, 2000);
}

// ==================== EMERGENCY BOOKING ====================

function handleEmergencySubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('emergency-name').value.trim();
    const phone = document.getElementById('emergency-phone').value.trim();
    const petName = document.getElementById('emergency-pet').value.trim();
    const issue = document.getElementById('emergency-issue').value.trim();
    
    // Store emergency request
    const emergencyRequest = {
        id: 'emg_' + Date.now(),
        name,
        phone,
        petName,
        issue,
        timestamp: new Date().toLocaleString()
    };
    
    // In a real app, this would send to a server
    console.log('Emergency request submitted:', emergencyRequest);
    
    showMessage('We received your emergency request. A veterinarian will call you shortly at ' + phone);
    
    setTimeout(() => {
        document.getElementById('emergency-form').reset();
        navigateTo('landing');
    }, 2500);
}

// ==================== MESSAGING ====================

function showMessage(text) {
    const messageEl = document.getElementById('success-message');
    document.getElementById('success-text').textContent = text;
    messageEl.classList.add('show');
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

function closeMessage() {
    document.getElementById('success-message').classList.remove('show');
}

// ==================== PERSISTENCE ====================

function saveAppState() {
    localStorage.setItem('vetClinicAppState', JSON.stringify(appState));
}

function loadAppState() {
    const saved = localStorage.getItem('vetClinicAppState');
    if (saved) {
        try {
            appState = JSON.parse(saved);
        } catch (e) {
            console.log('Could not load saved state');
        }
    }
    
    // If already logged in, go to dashboard
    if (appState.currentUser) {
        setTimeout(() => {
            navigateTo('dashboard');
        }, 100);
    }
}

// ==================== INITIALIZATION ====================

// Check if user is logged in on page load
window.addEventListener('load', function() {
    if (appState.currentUser) {
        navigateTo('dashboard');
    } else {
        navigateTo('landing');
    }
});
