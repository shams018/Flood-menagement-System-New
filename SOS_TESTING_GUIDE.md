# SOS System Testing Guide

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- MongoDB running locally
- Admin account created in database
- Test user account (regular user)

## Quick Test Steps

### 1. Start the Servers
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd Flood-menagement-System-New-main
npm run dev
```

### 2. Login as Regular User
- Go to http://localhost:5173
- Login with a regular user account
- Allow location permissions when browser asks

### 3. Trigger SOS Emergency
- Click "Emergency SOS" button on dashboard
- Allow location access (use current location)
- If blocked: Use manual location input (e.g., 34.0522 latitude, -118.2437 longitude for LA)
- Click "Initiate SOS" button
- You should see:
  - Map updates with your location marker
  - Message in SOS chat panel
  - Success notification

### 4. Request Assistance
- While SOS is active (sosActive = true), click one of:
  - "🚑 Medical Unit" 
  - "🚔 Police Support"
  - "🚒 Fire Dept"
  - "🆘 Rescue Squad"
- You should see assistance request in chat panel

## Verification Methods

### Method 1: Check Database Directly
```bash
# Connect to MongoDB
mongosh

# Switch to your database
use flood_management

# Check if Alerts were created
db.alerts.find({kind: "emergency_sos"}).pretty()

# Check if Notifications were created for admins
db.notifications.find({type: "emergency"}).pretty()

# Should see notifications with titles like:
# - "🚨 Emergency SOS Signal"
# - "🚑 Medical Unit Requested"
# - "🚔 Police Support Requested"
```

### Method 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for messages like:
   - Location success/error logs
   - SOS initiation response
   - Assistance request response

### Method 3: Check Backend Console
Look for backend logs showing:
```
POST /api/sos/initiate - 201 Created
POST /api/sos/request/medical - 201 Created
Error creating admin notifications: (if any error)
```

### Method 4: Admin Receives Notifications
1. Login as Admin
2. Go to Alerts/Notifications section
3. Should see:
   - Emergency SOS notification with user location
   - Assistance request notification (Medical/Police/Fire/Rescue)
   - Red accent color and high priority

## Expected Database Documents

### Alert Document Created on SOS Initiate
```json
{
  "kind": "emergency_sos",
  "source": "user",
  "priority": 10,
  "payload": {
    "title": "Emergency SOS Signal",
    "subtitle": "User email@example.com at 34.0522, -118.2437",
    "summary": "Emergency SOS initiated by user",
    "placeLabel": "34.0522, -118.2437"
  }
}
```

### Notification Documents Created
```json
{
  "user": ObjectId("admin_id"),
  "type": "emergency",
  "title": "🚨 Emergency SOS Signal",
  "body": "John Doe (john@example.com) triggered SOS at 34.0522, -118.2437",
  "actionText": "View SOS",
  "accentColor": "red",
  "route": "/alerts",
  "priority": 1,
  "read": false
}
```

## Troubleshooting

### SOS Button Not Working
- Check browser console for errors
- Verify user is logged in
- Check backend logs for 401/403 errors

### Location Not Getting
- Check browser permissions (Allow location access)
- Try manual location input instead
- Check if localhost HTTPS is required (usually not on localhost)

### Notifications Not Appearing
- Check if Admin exists in database: `db.admins.find()`
- Verify backend logs show "creating admin notifications"
- Check database for Notification documents
- Reload admin page to refresh notifications

### Database Query Verification
```javascript
// Check notifications for specific admin
db.notifications.find({
  user: ObjectId("admin_user_id"),
  type: "emergency"
}).sort({createdAt: -1}).limit(5)

// Count total emergency notifications
db.notifications.countDocuments({type: "emergency"})

// Find latest SOS alert
db.alerts.findOne({kind: "emergency_sos"}, {sort: {createdAt: -1}})
```

## Success Indicators ✅

- [ ] SOS button triggers without errors
- [ ] Location is detected (auto or manual)
- [ ] Map displays user location
- [ ] Chat message shows in SOS panel
- [ ] Alert document created in database
- [ ] Assistance request buttons work while sosActive=true
- [ ] Notification documents created for each admin
- [ ] Admin can see notifications in dashboard
- [ ] Real-time WebSocket messages received on admin channel
- [ ] Backend logs show no "creating admin notifications" errors
