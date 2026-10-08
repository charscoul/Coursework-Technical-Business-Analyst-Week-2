# PVC Test Data Guide

## Quick Start

1. Open **test-data-loader.html** in your browser
2. Click "📥 Load Test Data"
3. Confirm the data was loaded
3. Click "Go to PVC →" or open **index.html**
5. Login with any test account credentials
6. Start testing!

## Test Accounts

All test accounts use password: **password123**

| Email | Name | Pets | Status | Best For Testing |
|-------|------|------|--------|------------------|
| alice.johnson@email.com | Alice Johnson | Max (🐕), Whiskers (🐱) | Has appointments | Dashboard, pet viewing, appointment management, assigned vet (Vet 1) |
| bob.smith@email.com | Bob Smith | Buddy (🐕), Fluffy (🐰) | Has mobile appointment | Mobile vet appointments, diabetes management, assigned vet (Vet 2) |
| carol.williams@email.com | Carol Williams | Mittens (🐱), Tweety (🐦), Nibbles (🐹) | Has appointment | Multiple pet species, diverse appointments, assigned vet (Vet 3) |
| david.brown@email.com | David Brown | Rex (🐕) | New user - no appointments | Adding first pet, booking first appointment, assigned vet (Vet 1) |
| emma.davis@email.com | Emma Davis | Luna (🐱), Hoppy & Jumpy (🐰🐰) | Has appointments | Bonded pets, multiple appointments per user, assigned vet (Vet 2) |

## Test Data Overview

### Total Test Data:
- **5 Users** with complete customer profiles
- **11 Pets** across 6 species (dogs, cats, rabbits, hamsters, birds)
- **6 Appointments** with various types and statuses
- **3 Clinic Branches**: Branch 1, Branch 2, Branch 3
- **3 Veterinarians**: Vet 1, Vet 2, Vet 3 (each customer has an assigned vet)

## Test User Paths

### Path 1: New User Registration & First Appointment
**User: David Brown** (Assigned Vet: Vet 1)
- **Steps:**
  1. Go to app, navigate to dashboard (David is already registered with test data)
  2. Visit "Pet Management" - Add a new pet (Rex already exists, but you can add another)
  3. Go to "Book Appointment"
  4. Notice default vet selection will show Vet 1 (David's assigned vet)
  5. Select the new pet, branch, keep vet as assigned or select "Any Available"
  6. Complete booking
- **Validates:** Pet form submission, appointment booking with assigned vet default

### Path 2: Returning User - View Dashboard
**User: Alice Johnson**
- **Steps:**
  1. Login with alice.johnson@email.com
  2. View dashboard with pre-loaded pets and appointments
  3. Click on dashboard elements to see pet cards and appointment details
- **Validates:** Session persistence, dashboard layout, data display

### Path 3: Multiple Appointment Types
**User: Carol Williams**
- **Steps:**
  1. Login with carol.williams@email.com
  2. View 3 different pets (cat, bird, hamster) 
  3. Review appointment showing vaccination/wellness visit
- **Validates:** Multi-species handling, medical notes display

### Path 4: Mobile Vet Appointment
**User: Bob Smith**
- **Steps:**
  1. Login with bob.smith@email.com
  2. View appointment scheduled as "Mobile Vet Visit"
  3. Review medical notes about diabetes management
- **Validates:** Different appointment types, complex medical histories

### Path 5: Bonded Pets (Special Case)
**User: Emma Davis**
- **Steps:**
  1. Login with emma.davis@email.com
  2. View pets - note Hoppy and Jumpy are marked as bonded
  3. View their joint appointment scheduled together
- **Validates:** Handling related pets, special notes management

## Specific Functionality to Test

### Authentication Flow
- ✅ Login with test credentials
- ✅ Session persists between page reloads
- ✅ Logout clears session
- ✅ Create new account alongside existing test data

### Pet Management
- ✅ View multiple pets for same user
- ✅ Add new pet while keeping existing ones
- ✅ Pet data persists after logout/login
- ✅ Medical notes display correctly
- ✅ Different species display with correct emojis

### Appointment System
- ✅ View existing appointments on dashboard
- ✅ Appointments show correct vet, date, time
- ✅ Book new appointment for different branches
- ✅ Select different appointment types (in-clinic vs mobile)
- ✅ Time slot selection works
- ✅ New appointments appear on dashboard

### Branch/Vet System
- ✅ Test data includes appointments at all 3 branches
- ✅ Verify vet names display correctly
- ✅ Try booking at different branches

### Special Cases
- ✅ Diabetic pet with medical management notes (Buddy)
- ✅ Senior pet with multiple medications (Mittens)
- ✅ Bonded pet pair that requires joint appointments
- ✅ Newly adopted pet needing initial screening
- ✅ Indoor-only cat with dietary restrictions

## Medical Scenarios in Test Data

| Pet | Condition | Medical Notes | Testing Focus |
|-----|-----------|---------------|----------------|
| Max | Allergy | Allergic to chicken | Dietary restriction display |
| Whiskers | Digestive | Sensitive stomach | Nutritional notes |
| Buddy | Diabetes | Requires insulin 2x daily | Complex medical management |
| Fluffy | New pet | Needs health screening | Initial health assessment |
| Mittens | Elderly | Thyroid medication required | Senior pet care |
| Tweety | Social needs | Needs toys and enrichment | Behavioral notes |
| Nibbles | New hamster | Needs cage setup advice | Small pet setup |
| Rex | Genetic screening | Hip dysplasia screening done | Preventative testing |
| Luna | Behavioral | Needs regular play sessions | Behavior/enrichment |
| Hoppy | Bonded | Must have joint appointments | Pair management |
| Jumpy | Bonded | Must have joint appointments | Pair management |

## Testing Checklist

### User Authentication
- [ ] Login with valid credentials
- [ ] Attempt login with invalid password
- [ ] Test password recovery flow
- [ ] Logout and verify session clears
- [ ] Verify session persists on page refresh

### Dashboard
- [ ] View all pets for logged-in user
- [ ] Pet cards display emoji, name, species, age
- [ ] View upcoming appointments
- [ ] Appointment cards show date, time, vet name
- [ ] Click "Book New Appointment" button
- [ ] Click "Add/Manage Pets" button

### Pet Management
- [ ] View summary of all pets
- [ ] Add new pet with all fields
- [ ] Verify new pet appears in summary
- [ ] Submit form without required fields (should fail)
- [ ] Check that pet dropdown updates in appointment page

### Appointment Booking
- [ ] Select branch (verify dropdown changes options)
- [ ] Select appointment type
- [ ] Select veterinarian
- [ ] Select reason for visit
- [ ] Select pet from dropdown
- [ ] Pick date with date picker
- [ ] Select time slot from calendar view
- [ ] Submit appointment form
- [ ] Verify appointment appears on dashboard after booking

### Emergency Path
- [ ] Click emergency button on landing page
- [ ] View emergency phone number
- [ ] Fill emergency callback form
- [ ] Submit emergency request
- [ ] Verify success message

## Data Troubleshooting

### Test Data Not Loading
- Check browser console for errors (F12 → Console)
- Ensure test-data.json is in same folder as test-data-loader.html
- Try clearing browser cache and reloading
- Check that localStorage is not disabled

### Pets/Appointments Not Showing
- Verify you're logged in with correct account
- Check browser dev tools (F12 → Application → LocalStorage)
- Ensure you loaded test data to correct localStorage key: `vetClinicAppState`

### Need to Reset
- Click "🗑️ Clear All Data" button in test-data-loader.html
- Or manually clear localStorage in dev tools
- Then reload test data

## Sample Test Script (5-10 minutes)

```
1. Load test data (1 min)
2. Login as Alice Johnson (30 sec)
3. Review dashboard - view 2 pets and 2 appointments (1 min)
4. Go to Pet Management - review all pets (1 min)
5. Logout (30 sec)
6. Login as David Brown (30 sec)
7. Add a new pet (2 min)
8. Book an appointment for that pet (3 min)
9. Verify appointment appears on dashboard (1 min)
10. Test emergency path (1 min)
Total: ~10 minutes of core functionality testing
```

## Advanced Testing Scenarios

### Scenario: Complex Medical History Review
- Login as Bob Smith
- View Buddy's diabetes management appointment
- Check mobile vet visit type
- Verify notes about insulin management
- Test if user can add follow-up appointment

### Scenario: Multi-Pet Household
- Login as Emma Davis
- View 3 pets including bonded rabbits
- Note special scheduling requirements
- Try booking separate appointments for each pet
- Check how system handles bonded pair

### Scenario: Full User Journey
- Login as David Brown (minimal data)
- Add new pet (fill complete form)
- Browse appointment booking form
- Select different combinations of branch/vet
- Complete appointment booking
- Verify new appointment on dashboard
- Logout and login again to verify persistence
