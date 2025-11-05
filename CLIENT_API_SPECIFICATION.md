# API Endpoints Specification for Backend Team

## Overview
The frontend is ready and requires 2 API endpoints to be implemented on the backend. All endpoints should use JSON format.

---

## Base URL Configuration
Set the base URL via environment variable or update in `src/utils/api.ts`:
- Default: `https://api.ostrometfils.com`
- Or set `VITE_API_BASE_URL` in `.env` file

---

## Endpoint 1: Verify Password

**Purpose:** Verify user password when accessing The Hidden Chamber page

### Details
- **Method:** `POST`
- **URL:** `/api/auth/verify-password`
- **Content-Type:** `application/json`

### Request Body
```json
{
  "password": "string"
}
```

### Success Response (HTTP 200)
```json
{
  "success": true,
  "message": "Password verified successfully",
  "token": "optional-jwt-token"  // Optional: for session management
}
```

### Error Response (HTTP 401)
```json
{
  "success": false,
  "message": "Invalid password"
}
```

### Notes
- Password should be case-sensitive
- Each user should have a unique password
- Consider rate limiting to prevent brute force
- Optional: Return JWT token for session management

---

## Endpoint 2: Request Password

**Purpose:** Send password to user's email when they discover all secrets

### Details
- **Method:** `POST`
- **URL:** `/api/auth/request-password`
- **Content-Type:** `application/json`

### Request Body
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

### Success Response (HTTP 200)
```json
{
  "success": true,
  "message": "Password will be sent to your email shortly"
}
```

### Error Responses (HTTP 400)
```json
{
  "success": false,
  "message": "Invalid email address"
}
```
OR
```json
{
  "success": false,
  "message": "Email already registered"
}
```
OR
```json
{
  "success": false,
  "message": "All secrets not found"
}
```

### Notes
- Validate email format
- Validate that `totalFound === totalLabels` (all 15 secrets found)
- Check if email already exists in database
- Generate unique password for each user
- Send password via email using Nodemailer
- Store email, password, and secrets data in MongoDB

---

## Data Structure Details

### Secrets Found Object
```typescript
{
  street: number,  // Max: 5 (secrets found in Street scene)
  road: number,    // Max: 6 (secrets found in Road scene)
  plane: number    // Max: 4 (secrets found in Plane scene)
}
```

### Expected Values
- `totalLabels`: Always `15` (5 + 6 + 4)
- `totalFound`: Sum of `street + road + plane` (should be 15 when all found)

---

## Implementation Checklist for Backend

- [ ] Set up MongoDB database
- [ ] Create user collection schema (email, password, secretsFound, createdAt)
- [ ] Implement `/api/auth/verify-password` endpoint
- [ ] Implement `/api/auth/request-password` endpoint
- [ ] Set up Nodemailer for sending emails
- [ ] Generate unique passwords for each user
- [ ] Add email validation
- [ ] Add rate limiting
- [ ] Add error handling
- [ ] Test endpoints with frontend

---

## Frontend Integration

The frontend is **already implemented** and ready. Once backend endpoints are ready:

1. Set `VITE_API_BASE_URL` environment variable to your backend URL
2. Or update the default URL in `src/utils/api.ts`
3. Test the integration

### Frontend Files
- `src/utils/api.ts` - API service functions
- `src/components/PasswordModal.tsx` - Password verification UI
- `src/components/EmailModal.tsx` - Email collection UI
- `src/components/Footer/ScoreFooter.tsx` - Triggers email modal when all secrets found

---

## Example API Calls

### Example 1: Verify Password
```bash
curl -X POST https://api.ostrometfils.com/api/auth/verify-password \
  -H "Content-Type: application/json" \
  -d '{"password": "user123password"}'
```

### Example 2: Request Password
```bash
curl -X POST https://api.ostrometfils.com/api/auth/request-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "secretsFound": {"street": 5, "road": 6, "plane": 4},
    "totalFound": 15,
    "totalLabels": 15
  }'
```

---

## Security Recommendations

1. **Rate Limiting:** Limit password verification attempts (e.g., 5 attempts per 15 minutes)
2. **Password Strength:** Generate strong, unique passwords (12+ characters, mix of letters/numbers)
3. **Email Validation:** Validate email format and domain
4. **HTTPS:** Use HTTPS for all API calls
5. **CORS:** Configure CORS properly for frontend domain
6. **Logging:** Log password verification attempts for security monitoring

---

## Questions?

If you need any clarification on the endpoints or data structures, please let us know. The frontend is ready and waiting for backend integration.


