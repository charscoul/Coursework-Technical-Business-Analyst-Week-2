# Pritzki Veterinary Clinic - Check-In Kiosk

A simple, secure check-in kiosk interface for a veterinary clinic's waiting room.

## Overview

This kiosk allows clients arriving for appointments to:
1. Look up their appointment using their phone number
2. Confirm their pet's information and appointment time
3. Review pre-appointment instructions
4. Complete the digital check-in process

Clients without a scheduled appointment are directed to speak with reception staff.

## Features

### Security
- **Phone number verification required**: No appointment information is displayed without a valid phone number match
- **Today's appointments only**: Only appointments scheduled for today are accessible
- **No personal data exposure**: Client names and other sensitive information remain private until verified

### User Flows

#### 1. Successful Check-In Flow
```
Phone Number Entry
    ↓
Appointment Confirmation (pet name, type, time, date)
    ↓
Pre-Appointment Instructions
    ↓
Check-In Complete
```

#### 2. No Appointment Flow
```
Phone Number Entry
    ↓
No Appointment Found (redirect to speak with reception)
    ↓
Option to Try Again with Different Number
```

## Files

- **index.html** - Main kiosk interface with all screens
- **styles.css** - Complete styling with responsive design
- **script.js** - Navigation logic and interaction handling
- **data.js** - Mock appointment database and utility functions

## Features

### International Country Support
- **Country code dropdown with flags** - Select from 8 countries (🇬🇧 UK, 🇺🇸 USA, 🇫🇷 France, 🇩🇪 Germany, 🇮🇹 Italy, 🇪🇸 Spain, 🇳🇱 Netherlands, 🇦🇺 Australia)
- **International phone formats** - Proper formatting for each country's phone number system
- **Visual country identification** - Flag emojis and country names for easy recognition

### User Support
- **"Something Not Right?" button** - Appears on confirmation screen to direct confused users to speak with staff
- **Issue resolution screen** - Explains what staff can help with and directs to reception
- **Clear error messages** - Guides users through the lookup process

## Testing the Kiosk

### Test Phone Numbers (Valid Appointments for Today)

| Country | Country Code | Phone Number | Client | Pet | Time |
|---|---|---|---|---|---|
| 🇬🇧 United Kingdom | +44 | 07123 456789 | Sarah Johnson | Max | 9:30 AM |
| 🇬🇧 United Kingdom | +44 | 07234 567890 | Michael Chen | Whiskers | 10:15 AM |
| 🇬🇧 United Kingdom | +44 | 07345 678901 | Emma Rodriguez | Bella | 11:00 AM |
| 🇺🇸 United States | +1 | 555 456 7890 | James Wilson | Rocky | 2:00 PM |
| 🇫🇷 France | +33 | 1 23 45 67 89 | Lisa Anderson | Mittens | 3:30 PM |

### Test Phone Numbers (No Appointment Today)

| Country | Country Code | Phone Number | Reason |
|---|---|---|---|
| 🇩🇪 Germany | +49 | 30 12345678 | Appointment scheduled for tomorrow, not today |
| Any | Any | 999 9999 | No appointment in system |

## How to Use

1. Open `index.html` in a web browser
2. Select a country from the dropdown (with flag icon and country code)
3. Enter the phone number (format varies by country)
4. Click "Look Up Appointment" or press Enter
5. Follow the prompts through the kiosk flow
6. Use "Something Not Right?" to get staff assistance or "Start Over" to reset

## Design Principles

### Accessibility
- Large, easy-to-read text
- Clear visual hierarchy
- High contrast colors for readability
- Keyboard-friendly navigation (Enter key support)
- Touch-friendly button sizes

### User Experience
- Simple, linear workflow
- Clear error messages
- Visual feedback on interactions
- Auto-formatting of phone number input
- Animated transitions between screens

### Security & Privacy
- No appointment data displayed without phone verification
- Only today's appointments accessible
- Sensitive information (client names) hidden on first screen
- Clear "speak to reception" flow for unscheduled visitors

## Responsive Design

The kiosk interface is fully responsive and works on:
- Desktop monitors (1920px and wider)
- Tablets (768px to 1024px)
- Mobile devices (480px and above)
- Can be optimized for touch-screen kiosk hardware

## Customization

To customize the kiosk:

1. **Add more appointments**: Edit the `appointmentDatabase` array in `data.js`
2. **Change colors**: Modify CSS custom properties in `:root` selector in `styles.css`
3. **Update instructions**: Edit the instructions in `index.html` (screen #3)
4. **Modify clinic name**: Change "Pritzki Veterinary Clinic" throughout the files

## Technical Stack

- **HTML5** - Semantic structure and form elements
- **CSS3** - Flexbox and Grid layouts, CSS variables, animations
- **Vanilla JavaScript** - No external dependencies required

## Future Enhancements

Potential features to add:
- Integration with actual appointment management system
- SMS notification confirmation
- Multi-language support
- Accessibility features (screen reader support)
- Admin dashboard for managing appointments
- Check-in timestamp tracking
- Pet medical history display (for returning clients)
- Payment processing integration
