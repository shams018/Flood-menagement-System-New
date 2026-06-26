# SOS Admin Notification System - Complete Guide

## Overview

When a user triggers SOS or requests emergency assistance, **all admins automatically receive notifications** with:
- 🗺️ Location map image
- 👤 User information (name, email)
- 📍 Coordinates (latitude, longitude)
- ⏰ Timestamp
- 🚑 Emergency type (Medical, Police, Fire, Rescue)

## Quick Start

### 1. Setup (One Time)

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend  
npm run dev

# Terminal 3: Verify System (Optional)
cd backend
node test-sos-notifications.mjs
```

### 2. Create Test Accounts (One Time)

**Create Regular User:**
1. Go to http://localhost:5173
2. Click "Register"
3. Fill in: Email, Password, Name, Location
4. Click "Register"

**Create Admin User** (via MongoDB):
```bash
mongosh
use flood_management

# Check if admin exists
db.admins.find()

# If empty, create one:
db.admins.insertOne({
  email: "admin@example.com",
  password: "hashed_password",
  full_name: "Admin User",
  role: "admin"
})
```

### 3. Test SOS Trigger

**Step 1: Login as Regular User**
- Go to http://localhost:5173
- Login with regular user account

**Step 2: Trigger Emergency**
- Find and click "Emergency SOS" button
- Allow location permission (or manually enter coordinates)
- Click "Initiate SOS"
- Should see map with location marker

**Step 3: Request Assistance**
- While SOS is active, click one of:
  - 🚑 Medical Unit
  - 🚔 Police Support  
  - 🚒 Fire Dept
  - 🆘 Rescue Squad

**Step 4: Verify Admin Received Notifications**
- Logout
- Login as Admin
- Go to Notifications/Alerts section
- Should see:
  - "🚨 Emergency SOS Signal" notification with map
  - "🚑 Medical Unit Requested" (if you clicked that)
  - "🚔 Police Support Requested" (if you clicked that)
  - Etc.

## Verification Methods

### Method 1: Admin Dashboard

1. **Login as Admin**
   - Go to http://localhost:5173/admin
   - Login with admin credentials

2. **View Notifications**
   - Look for notifications panel/section
   - Should show emergency SOS notifications
   - Click to see full details with map image

### Method 2: Check Notifications Endpoint

```bash
# Get admin's unread emergency notifications
curl -X GET "http://localhost:5000/api/notifications?filter=unread&category=emergency" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Should return:
```json
{
  "notifications": [
    {
      "title": "🚨 Emergency SOS Signal",
      "body": "John Doe triggered SOS at 34.0522, -118.2437",
      "imageUrl": "https://maps.geoapify.com/...",
      "accentColor": "red",
      "priority": 1,
      "sosData": {
        "emergencyType": "sos_initiated",
        "userName": "John Doe",
        "userEmail": "john@example.com"
      },
      "location": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "placeName": "34.0522, -118.2437"
      }
    }
  ]
}
```

### Method 3: Database Verification

```bash
mongosh
use flood_management

# Find all SOS notifications
db.notifications.find({type: "emergency"}).pretty()

# Should show documents with:
# - user: admin_id
# - title: "🚨 Emergency SOS Signal" or "🚑 Medical Unit Requested" etc
# - imageUrl: map image URL
# - location: {latitude, longitude, placeName}
# - sosData: {emergencyType, userName, userEmail}

# Count notifications per admin
db.notifications.aggregate([
  {$match: {type: "emergency"}},
  {$group: {_id: "$user", count: {$sum: 1}}}
])
```

### Method 4: Run Test Script

```bash
cd backend
node test-sos-notifications.mjs
```

Output will show:
- ✅ Number of admins
- ✅ Number of SOS notifications
- 📊 Notifications per admin
- 🗺️ Recent SOS alerts

## Expected Results ✅

After triggering SOS and requesting assistance, you should see:

**In Database:**
```
✅ Multiple Notification documents created (one per admin)
✅ Each has type: "emergency"
✅ Each has accentColor: "red"
✅ Each has imageUrl pointing to map
✅ Each has location with coordinates
✅ Each has sosData with emergency details
```

**In Admin Dashboard:**
```
✅ Red "Emergency SOS Signal" notification appears
✅ Shows user name and email
✅ Shows location coordinates
✅ Shows map image
✅ Shows timestamp
✅ Click detail view shows full information
```

**In API Response:**
```
✅ GET /api/notifications returns notifications with images
✅ Each notification includes imageUrl
✅ Each notification includes location data
✅ Each notification includes sosData
```

## Troubleshooting

### Problem: Admin Not Receiving Notifications

**Check 1: Admin exists in database**
```bash
mongosh
use flood_management
db.admins.count()  # Should be > 0
```

**Check 2: Notifications created in database**
```bash
db.notifications.find({type: "emergency"}).count()  # Should increase after SOS
```

**Check 3: Backend logs**
```
Look for:
- POST /api/sos/initiate - 201 Created
- POST /api/sos/request/:type - 201 Created
- "Error creating admin notifications:" (if any errors)
```

**Check 4: Admin token valid**
- Logout admin
- Login again
- Refresh page
- Check browser console for auth errors

### Problem: Notifications Don't Have Images

**Check notifications endpoint:**
```bash
curl -X GET "http://localhost:5000/api/notifications?filter=unread" \
  -H "Authorization: Bearer TOKEN" | grep imageUrl
```

**If imageUrl is null:**
- Backend code not generating map URLs
- Check `/backend/src/routes/sos.js` has imageUrl generation code

### Problem: Map Images Not Loading

**Check if Geoapify service is accessible:**
```bash
# Try the map URL directly
curl -I "https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:-118.2437,34.0522&zoom=14"
```

**Solutions:**
- Check internet connection
- If offline, use placeholder service: `https://via.placeholder.com/400x300`
- Geoapify requires internet for real-time maps

## Features Implemented

### 1. SOS Initiation (POST /api/sos/initiate)
✅ Creates Alert document
✅ Creates ChatMessage in channel
✅ Creates Notification for each admin with:
- Map image URL
- Location coordinates
- Emergency SOS title
- User information

### 2. Assistance Requests (POST /api/sos/request/:type)
✅ Creates ChatMessage for request
✅ Creates Notification for each admin with:
- Map image URL
- Emergency type (medical/police/fire/rescue)
- User information
- Location coordinates

### 3. Admin Notification Retrieval (GET /api/notifications)
✅ Returns all notifications for authenticated admin
✅ Filters by: unread, category (emergency), priority
✅ Includes imageUrl and sosData
✅ Supports marking as read (PUT /api/notifications/:id/read)

### 4. Real-time WebSocket
✅ Notifications emitted to admin-specific channels
✅ Admin receives real-time alerts
✅ Chat messages broadcast to SOS channel

## Component Integration

To display notifications in admin dashboard, add:

```jsx
import SOSNotificationPanel from "./Admin/SOSNotificationPanel";

// In AdminDashboard or alerts page:
<SOSNotificationPanel />
```

This component:
- Auto-refreshes every 5 seconds
- Shows unread emergency notifications
- Displays map image
- Shows user and location info
- Allows marking as read
- Links to SOS chat channel

## Testing Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Admin account exists in database
- [ ] Regular user account exists
- [ ] User logs in and triggers SOS
- [ ] User requests assistance while SOS active
- [ ] Admin logs in and receives notifications
- [ ] Notifications show map image
- [ ] Notifications show location coordinates
- [ ] Database has Notification documents
- [ ] /api/notifications endpoint returns data
- [ ] test-sos-notifications.mjs shows results
- [ ] Admin can view notification details
- [ ] Admin can see user information
- [ ] Timestamps are correct
