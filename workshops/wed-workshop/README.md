# PVC - Veterinary Clinic Appointment Booking System

A simple clickable HTML/CSS/JavaScript interface for a veterinary clinic's customer-facing appointment booking system.

## Features

### 1. **Landing Page**
- Welcome screen with clinic branding (PVC)
- Quick navigation buttons to Login or New Customer Registration
- Emergency appointment shortcut banner

### 2. **New Customer Registration**
- Collects customer details:
  - First & Last Name
  - Email Address
  - Phone Number
  - Address & City
  - Password & Confirmation
- Form validation (password match verification)
- Auto-login upon successful registration

### 3. **Account Login**
- Email and password authentication
- Failed login directs to password recovery
- Session persistence using browser localStorage

### 4. **Password Recovery**
- Email-based recovery flow
- Simulated password reset (demo functionality)
- Returns user to login page

### 5. **Account Dashboard**
- Personalized welcome message
- **Your Pets** section displaying all registered pets with species icons
- **Upcoming Appointments** section showing scheduled appointments with dates and veterinarian names
- Quick links to add/manage pets and book appointments

### 6. **Pet Management Page**
- Add new pet information or update existing pets
- Fields:
  - Pet Name (required)
  - Species (dropdown: Dog, Cat, Rabbit, Hamster, Bird, Other)
  - Breed
  - Age (in years)
  - Weight (in kg)
  - Medical Notes / Allergies
- Displays summary of all registered pets
- Updates pet dropdown in appointment booking

### 7. **Appointment Booking Page**
- Multi-step appointment selection:
  - **Select Clinic Branch**: Branch 1, Branch 2, or Branch 3
  - **Appointment Type**: In-Clinic or Mobile Vet
  - **Select Veterinarian**: Vet 1, Vet 2, or Vet 3 (or "Any Available" to default to your assigned vet)
  - **Reason for Visit**: Checkup, Vaccination, Dental, Illness, Grooming, Other
  - **Select Pet**: Dropdown populated from registered pets
  - **Preferred Date**: Calendar picker (prevents past dates)
  - **Available Times**: 12 clickable time slots from 9:00 AM - 4:30 PM
  - **Additional Notes**: Optional notes about the appointment

### 8. **Emergency Appointment Page**
- Prominent emergency hotline: +1 (555) 123-9999
- "Available 24/7" status
- Callback request form for emergencies:
  - Name, Phone Number
  - Pet Name & Description of Emergency
- Stores emergency requests with timestamps

## Data Storage

The application uses **browser localStorage** to persist data:
- User accounts and login credentials
- Pet information
- Appointment records
- Session state

**Data persists** between browser sessions - logging out will return to landing page, but your account and pets remain saved.

## File Structure

```
/wed-workshop/
├── index.html      # Main HTML file with all pages
├── styles.css      # Complete styling and responsive design
├── script.js       # Navigation, form handling, and state management
└── README.md       # This file
```

## User Flows

### New User Journey:
1. Landing Page → New Customer Button
2. Registration Form (enter details)
3. Auto-login → Dashboard
4. Add Pet (optional but recommended for appointments)
5. Book Appointment

### Returning User Journey:
1. Landing Page → Login Button
2. Enter credentials
3. Dashboard → View pets/appointments or book new appointment

### Emergency Flow:
1. Landing Page → Emergency Banner/Button
2. Emergency page with phone number
3. Optional: Submit callback request form

## Features Implemented

✅ Page Navigation System  
✅ User Registration with validation  
✅ Login/Logout with session persistence  
✅ Password Recovery flow  
✅ Pet Management (add/view pets)  
✅ Appointment Booking with multiple criteria  
✅ Assigned Vet system with optional vet selection  
✅ Time Slot Selection (clickable calendar view)  
✅ Emergency Appointment pathway  
✅ Success notifications  
✅ Responsive design (mobile, tablet, desktop)  
✅ Form input validation  
✅ Data persistence using localStorage  

## How to Use

1. Open `index.html` in any modern web browser
2. Click "New Customer" to create an account (or use existing credentials from previous session)
3. Complete registration form
4. Add your pet(s) in the Pet Management section
5. Click "Book New Appointment" to schedule an appointment
6. Select all appointment details and a time slot
7. View your dashboard anytime to see pets and upcoming appointments

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## Test Credentials

After creating an account, that email/password will be saved and you can log in with it. Try:
- Email: test@example.com
- Password: demo123

(Create these during your first registration)

## Responsive Design

- **Desktop**: Full layout with multiple columns
- **Tablet**: Optimized 2-column grids
- **Mobile**: Single column, touch-friendly buttons

## Future Enhancements

- Backend integration for real data persistence
- Email notifications for appointments
- Vet availability calendar sync
- Payment processing
- Appointment reminders
- Mobile app version
- Admin dashboard for clinic staff
