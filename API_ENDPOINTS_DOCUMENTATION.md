# API Endpoints Documentation

This document describes the API endpoints that the frontend will call for The Hidden Chamber authentication system.

## Base URL
The base URL should be configured via environment variable `VITE_API_BASE_URL` or defaults to `https://api.ostrometfils.com`

---

## Endpoint 1: Verify Password

**Purpose:** Verify password for accessing The Hidden Chamber page

### Request
- **Method:** `POST`
- **URL:** `/api/auth/verify-password`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "password": "string"
  }
  ```

### Response Success (200)
```json
{
  "success": true,
  "message": "Password verified successfully",
  "token": "optional-jwt-token-for-session" // Optional, for session management
}
```

### Response Error (401)
```json
{
  "success": false,
  "message": "Invalid password"
}
```

### Frontend Implementation
- Location: `src/utils/api.ts` - `verifyPassword()` function
- Used in: `src/components/PasswordModal.tsx`
- Behavior: 
  - If token is provided, it's stored in `localStorage` as `hiddenChamberToken`
  - Password verification status is stored in `sessionStorage` as `passwordVerified: 'true'`
  - On success, user can access The Hidden Chamber page

---

## Endpoint 2: Request Password

**Purpose:** Request password to be sent to user's email when they discover all secrets

### Request
- **Method:** `POST`
- **URL:** `/api/auth/request-password`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "secretsFound": {
      "street": 5,
      "road": 6,
      "plane": 4
    },
    "totalFound": 15,
    "totalLabels": 15
  }
  ```

### Response Success (200)
```json
{
  "success": true,
  "message": "Password will be sent to your email shortly"
}
```

### Response Error (400)
Possible error messages:
- `"Invalid email address"` - Email format is invalid
- `"Email already registered"` - Email has already been used to request a password
- `"All secrets not found"` - User hasn't discovered all secrets yet (frontend should prevent this, but backend should validate)

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Frontend Implementation
- Location: `src/utils/api.ts` - `requestPassword()` function
- Used in: `src/components/EmailModal.tsx`
- Trigger: When user clicks "Enter the Chamber" button after finding all secrets
- Behavior:
  - Email is validated on frontend before sending
  - Email and timestamp are stored in `localStorage` to prevent duplicate requests
  - Shows success message and navigates to The Hidden Chamber page after email is submitted

---

## Data Structure Details

### Secrets Found Object
```typescript
{
  street: number,  // Number of secrets found in Street scene (max: 5)
  road: number,    // Number of secrets found in Road scene (max: 6)
  plane: number    // Number of secrets found in Plane scene (max: 4)
}
```

### Total Counts
- `totalFound`: Sum of all secrets found across all scenes
- `totalLabels`: Total number of secrets available (15 in this case)

---

## Frontend Flow

### Flow 1: User finds all secrets and requests password
1. User discovers all 15 secrets
2. Clicks "Enter the Chamber" button on footer
3. Email modal appears (`EmailModal` component)
4. User enters email
5. Frontend calls `/api/auth/request-password` with email and secrets data
6. On success, navigates to `/the-hidden-chamber`
7. Password modal appears (`PasswordModal` component)
8. User enters password received via email
9. Frontend calls `/api/auth/verify-password`
10. On success, user can view The Hidden Chamber page

### Flow 2: User tries to access page directly
1. User navigates to `/the-hidden-chamber` (via menu or direct URL)
2. Password modal appears immediately
3. User enters password
4. Frontend calls `/api/auth/verify-password`
5. On success, user can view The Hidden Chamber page

---

## Session Management

### Password Verification
- Stored in `sessionStorage` as `passwordVerified: 'true'`
- Valid for the current browser session only
- Cleared when browser tab/window is closed

### Token (Optional)
- If backend provides a token, it's stored in `localStorage` as `hiddenChamberToken`
- Can be used for API authentication if needed
- Persists across browser sessions

### Email Request Tracking
- Email stored in `localStorage` as `passwordRequestEmail`
- Timestamp stored in `localStorage` as `passwordRequestTime`
- Used to prevent duplicate requests (frontend-side check)

---

## Error Handling

The frontend handles errors gracefully:
- Network errors are caught and displayed to user
- Invalid responses show appropriate error messages
- User can retry after errors
- Password modal allows cancellation (navigates back to home)

---

## Notes for Backend Team

1. **Password Verification:**
   - Each user should have a unique password
   - Passwords should be case-sensitive
   - Consider rate limiting to prevent brute force attacks

2. **Email Request:**
   - Validate that all secrets are found before sending password
   - Send password via email using Nodemailer
   - Consider checking if email already exists to prevent duplicates
   - Password should be unique per user/email

3. **Security:**
   - Consider implementing CSRF protection
   - Rate limit both endpoints
   - Log password verification attempts for security monitoring

4. **Email Format:**
   - Frontend validates basic email format before sending
   - Backend should also validate email format
   - Consider email domain validation if needed

---

## Testing

To test before backend is ready, you can:
1. Set `VITE_API_BASE_URL` to a mock server URL
2. Use a service like JSONPlaceholder or MockAPI
3. Temporarily modify `src/utils/api.ts` to return mock responses

Example mock response for testing:
```typescript
// In verifyPassword function, temporarily add:
if (password === 'test123') {
  return { success: true, message: 'Password verified', token: 'mock-token' };
}
```


