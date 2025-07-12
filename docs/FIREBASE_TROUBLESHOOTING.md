# Firebase Troubleshooting Guide

## Current Issues Identified

1. **Firebase Configuration**: The Firebase config in admin.html has real API keys, but
   firebase-config.js still has placeholder values
2. **Missing saveProducts method**: Fixed - Added the method to firebase-storage-manager.js
3. **Firebase Database Rules**: Likely set to deny access by default

## Quick Debugging Steps

### 1. Open the Debug Tool

Open `debug-firebase.html` in your browser to test Firebase connectivity

### 2. Check Browser Console

Look for these specific errors:

- `PERMISSION_DENIED` - Database rules issue
- `Firebase: No Firebase App '[DEFAULT]' has been created` - Initialization issue
- `Failed to get document because the client is offline` - Network issue

### 3. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `stamp-e20f2`
3. Navigate to **Realtime Database** → **Rules**
4. For testing, use these permissive rules:

```json
{
    "rules": {
        ".read": true,
        ".write": true
    }
}
```

**WARNING**: These rules allow anyone to read/write. For production, use:

```json
{
    "rules": {
        "products": {
            ".read": true,
            ".write": "auth != null"
        },
        "test-write": {
            ".read": true,
            ".write": true
        }
    }
}
```

### 4. Common Issues and Solutions

#### Issue: Products not saving to Firebase

**Solution**:

1. Check if `isFirebaseEnabled` is true in the console:
    ```javascript
    console.log(storageManager.isFirebaseEnabled);
    ```
2. If false, Firebase isn't initializing properly

#### Issue: Firebase not initializing

**Solution**:

1. Make sure Firebase SDK is loaded before firebase-storage-manager.js
2. Check for duplicate Firebase initialization
3. Verify API keys are correct

#### Issue: Data saves to localStorage instead of Firebase

**Solution**:

1. This happens when Firebase initialization fails
2. Check console for Firebase errors
3. Verify network connectivity

### 5. Test Firebase Connection

In the browser console on admin.html, run:

```javascript
// Check if Firebase is available
console.log('Firebase available:', typeof firebase !== 'undefined');

// Check if database is accessible
if (typeof firebase !== 'undefined') {
    const db = firebase.database();
    db.ref('.info/connected').on('value', (snapshot) => {
        console.log('Connected to Firebase:', snapshot.val());
    });
}

// Check storage manager status
console.log('Storage Manager Firebase enabled:', storageManager.isFirebaseEnabled);

// Test write
const testData = { test: true, timestamp: Date.now() };
firebase
    .database()
    .ref('test')
    .set(testData)
    .then(() => console.log('Write successful'))
    .catch((error) => console.error('Write failed:', error));
```

### 6. Verify Data Flow

1. When adding a product, check Network tab for Firebase requests
2. Look for requests to `firebaseio.com`
3. Check response status (should be 200)

### 7. Firebase Dashboard

1. Go to Firebase Console → Realtime Database
2. You should see data structure like:
    ```
    products/
      ├── [product-id-1]/
      │   ├── title: "Product Name"
      │   ├── price: 1000
      │   └── ...
      └── [product-id-2]/
          └── ...
    ```

## Files to Check

1. **admin.html** - Lines 14-27 for Firebase initialization
2. **firebase-storage-manager.js** - Lines 13-50 for Firebase setup
3. **firebase-config.js** - Currently has placeholder values (not used)

## Next Steps

1. Use `debug-firebase.html` to test connectivity
2. Update Firebase Database rules
3. Verify products are saving to Firebase, not localStorage
4. Monitor browser console for errors
5. Check Firebase Dashboard for saved data

## Support

If issues persist:

1. Check Firebase service status
2. Verify billing account (free tier should be sufficient)
3. Check browser compatibility (modern browsers required)
4. Disable browser extensions that might block Firebase
