// Mock appointment database for Pritzki Veterinary Clinic
// Phone numbers are stored with international format

// International Country Codes Configuration
const countryCodeOptions = [
    { code: '+44', flag: '🇬🇧', country: 'United Kingdom', example: '07123 456789' },
    { code: '+1', flag: '🇺🇸', country: 'United States', example: '555 123 4567' },
    { code: '+33', flag: '🇫🇷', country: 'France', example: '1 23 45 67 89' },
    { code: '+49', flag: '🇩🇪', country: 'Germany', example: '30 12345678' },
    { code: '+39', flag: '🇮🇹', country: 'Italy', example: '06 1234 5678' },
    { code: '+34', flag: '🇪🇸', country: 'Spain', example: '91 123 4567' },
    { code: '+31', flag: '🇳🇱', country: 'Netherlands', example: '20 1234567' },
    { code: '+61', flag: '🇦🇺', country: 'Australia', example: '2 1234 5678' }
];

const appointmentDatabase = [
    {
        phoneNumber: "+44 7123 456789",
        clientName: "Sarah Johnson",
        petName: "Max",
        petType: "Golden Retriever",
        appointmentDate: "2026-10-07",
        appointmentTime: "09:30 AM",
        appointmentType: "Annual Checkup"
    },
    {
        phoneNumber: "+44 7234 567890",
        clientName: "Michael Chen",
        petName: "Whiskers",
        petType: "Cat (Tabby)",
        appointmentDate: "2026-10-07",
        appointmentTime: "10:15 AM",
        appointmentType: "Vaccination Update"
    },
    {
        phoneNumber: "+44 7345 678901",
        clientName: "Emma Rodriguez",
        petName: "Bella",
        petType: "Labrador Retriever",
        appointmentDate: "2026-10-07",
        appointmentTime: "11:00 AM",
        appointmentType: "Dental Cleaning"
    },
    {
        phoneNumber: "+1 555 456 7890",
        clientName: "James Wilson",
        petName: "Rocky",
        petType: "German Shepherd",
        appointmentDate: "2026-10-07",
        appointmentTime: "02:00 PM",
        appointmentType: "Injury Assessment"
    },
    {
        phoneNumber: "+33 1 23 45 67 89",
        clientName: "Lisa Anderson",
        petName: "Mittens",
        petType: "Cat (Siamese)",
        appointmentDate: "2026-10-07",
        appointmentTime: "03:30 PM",
        appointmentType: "Behavioral Consultation"
    },
    {
        phoneNumber: "+49 30 12345678",
        clientName: "David Lee",
        petName: "Buddy",
        petType: "Beagle",
        appointmentDate: "2026-10-08",
        appointmentTime: "10:00 AM",
        appointmentType: "Annual Checkup"
    }
];

/**
 * Normalize phone number to international format
 * @param {string} countryCode - Selected country code (e.g., +44, +1, +33)
 * @param {string} localNumber - Local phone number
 * @returns {string} Normalized international phone number
 */
function normalizePhoneNumber(countryCode, localNumber) {
    // Remove all non-digit characters from local number
    let digitsOnly = localNumber.replace(/\D/g, '');
    
    if (!countryCode || !digitsOnly) {
        return null;
    }
    
    // Format as country code + spaces in appropriate positions
    // Add spaces for readability based on country code
    if (countryCode === '+44') {
        // UK format: handle both 07XXXXXXXXX and 7XXXXXXXXX formats
        // Convert to standard +44 7XXX XXXXXX format
        if (digitsOnly.startsWith('07')) {
            digitsOnly = digitsOnly.slice(1); // Remove leading 0
        }
        if (digitsOnly.length === 10 && digitsOnly.startsWith('7')) {
            // Format as +44 7XXX XXXXXX (UK mobile format)
            return `${countryCode} ${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4)}`;
        }
    } else if (countryCode === '+1') {
        // US/Canada format: +1 XXX XXX XXXX
        if (digitsOnly.length >= 10) {
            return `${countryCode} ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 10)}`;
        }
    } else if (countryCode === '+33') {
        // France format: +33 X XX XX XX XX
        if (digitsOnly.length >= 9) {
            return `${countryCode} ${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 3)} ${digitsOnly.slice(3, 5)} ${digitsOnly.slice(5, 7)} ${digitsOnly.slice(7, 9)}`;
        }
    } else if (countryCode === '+49') {
        // Germany format: +49 XX XXXXXXXX
        if (digitsOnly.length >= 10) {
            return `${countryCode} ${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 10)}`;
        }
    } else if (countryCode === '+39') {
        // Italy format: +39 XX XXXX XXXX
        if (digitsOnly.length >= 10) {
            return `${countryCode} ${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 6)} ${digitsOnly.slice(6, 10)}`;
        }
    } else if (countryCode === '+34') {
        // Spain format: +34 XXX XXXXX
        if (digitsOnly.length >= 9) {
            return `${countryCode} ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 8)}`;
        }
    } else if (countryCode === '+31') {
        // Netherlands format: +31 X XXXXXXXX
        if (digitsOnly.length >= 9) {
            return `${countryCode} ${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 9)}`;
        }
    } else if (countryCode === '+61') {
        // Australia format: +61 X XXXX XXXX
        if (digitsOnly.length >= 9) {
            return `${countryCode} ${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 5)} ${digitsOnly.slice(5, 9)}`;
        }
    }
    
    return null;
}

/**
 * Format appointment date to readable format
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "Tuesday, October 7, 2026")
 */
function formatAppointmentDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Look up appointment by phone number for today
 * @param {string} countryCode - Selected country code (e.g., +44, +1)
 * @param {string} localNumber - Local phone number
 * @returns {object|null} Appointment object if found for today, null otherwise
 */
function lookupAppointmentByPhone(countryCode, localNumber) {
    const normalizedPhone = normalizePhoneNumber(countryCode, localNumber);
    const todayDate = "2026-10-07"; // Using the exercise context date
    
    if (!normalizedPhone) {
        return null;
    }
    
    const appointment = appointmentDatabase.find(
        appt => appt.phoneNumber === normalizedPhone && appt.appointmentDate === todayDate
    );
    
    return appointment || null;
}

/**
 * Get today's date as YYYY-MM-DD
 * @returns {string} Today's date
 */
function getTodayDate() {
    return "2026-10-07"; // Context date for this exercise
}

/**
 * Validate phone number format (country-specific validation)
 * @param {string} localNumber - Local phone number without country code
 * @returns {boolean} True if valid format
 */
function isValidPhoneFormat(localNumber) {
    const digitsOnly = localNumber.replace(/\D/g, '');
    // Accept various lengths to accommodate different country formats
    // UK: 10-11 digits (07XXXXXXXXX or 7XXXXXXXXX)
    // US: 10 digits
    // Other countries: 9-11 digits
    return digitsOnly.length >= 9 && digitsOnly.length <= 11;
}

/**
 * Get all available country code options
 * @returns {array} Array of country code objects with flag and country name
 */
function getCountryCodeOptions() {
    return countryCodeOptions;
}
