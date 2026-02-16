# Firestore Security Rules Setup

## Quick Start (Development Mode)

For testing, the app needs open Firestore access. Here's how to set it up:

### Option 1: Firebase Console (Easiest)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `courtflow-app`
3. **Navigate to Firestore Database**:
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top
4. **Paste these development rules**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
5. **Click "Publish"**

⚠️ **WARNING**: These rules allow ANYONE to read/write your database. Use ONLY for development!

### Option 2: Firebase CLI (If you have it installed)

```bash
# Deploy rules from the firestore.rules file
firebase deploy --only firestore:rules
```

## Current Rules Status

Your current rules are likely set to:
```
allow read, write: if false;
```

This blocks ALL access, which is why your app is getting permission errors.

## Testing the CRUD Form

Once you've updated the rules:

1. **Reload your app** (press `r` in Expo terminal)
2. **Navigate to "Firestore" tab** (cloud icon)
3. **Try creating a test entry**:
   - Fill in the "String Field"
   - Add data to array items
   - Click "Create"

You should see the data appear in:
- The list below the form
- Firebase Console → Firestore Database → `firestoreTesting` collection

## Production Rules (Future)

When you're ready to secure your database:

1. **Uncomment the production rules** in `firestore.rules`
2. **Set up Firebase Authentication** (currently not implemented)
3. **Deploy the secure rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

The production rules include:
- ✅ User authentication required
- ✅ Users can only access their own data
- ✅ Proper ownership checks
- ✅ Collection-specific permissions

## Checking Current Rules

To see your current Firestore rules:
1. Go to Firebase Console
2. Firestore Database → Rules tab
3. You'll see the currently deployed rules

## Common Errors

**Error**: `Missing or insufficient permissions`
- **Cause**: Rules are blocking access
- **Fix**: Update rules in Firebase Console as shown above

**Error**: `PERMISSION_DENIED`
- **Cause**: Same as above
- **Fix**: Publish the development rules

## Next Steps

1. ✅ Update Firestore rules (as shown above)
2. ✅ Test the CRUD form
3. 🔄 Later: Set up Firebase Authentication
4. 🔄 Later: Switch to production rules
