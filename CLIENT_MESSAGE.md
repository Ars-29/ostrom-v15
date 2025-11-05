# Message for Client (Backend Team)

## English Version

Hi team,

The frontend is ready for backend integration. We need **2 API endpoints** to be implemented:

### Endpoint 1: Verify Password
- **URL:** `POST /api/auth/verify-password`
- **Request:** `{ "password": "string" }`
- **Response:** `{ "success": boolean, "message": "string", "token": "optional" }`

### Endpoint 2: Request Password  
- **URL:** `POST /api/auth/request-password`
- **Request:** `{ "email": "string", "secretsFound": { "street": number, "road": number, "plane": number }, "totalFound": number, "totalLabels": number }`
- **Response:** `{ "success": boolean, "message": "string" }`

**Complete API specification** is in `CLIENT_API_SPECIFICATION.md` file with:
- Full request/response formats
- Error handling
- Data structures
- Security recommendations
- Example API calls

The frontend code is already implemented in `src/utils/api.ts` and ready to connect once your endpoints are live.

Please let us know:
1. The backend API base URL (we'll set it in environment variable)
2. When endpoints are ready for testing

---

## Urdu Version (Simplified)

Assalam-o-Alaikum,

Frontend ready hai. Backend ke liye **2 endpoints** chahiye:

### 1. Password Verify
- **URL:** `POST /api/auth/verify-password`
- **Send:** `{ "password": "user password" }`
- **Receive:** `{ "success": true/false, "message": "..." }`

### 2. Password Request
- **URL:** `POST /api/auth/request-password`  
- **Send:** `{ "email": "user@email.com", "secretsFound": {...}, "totalFound": 15, "totalLabels": 15 }`
- **Receive:** `{ "success": true/false, "message": "..." }`

**Full details** `CLIENT_API_SPECIFICATION.md` file mein hain.

Frontend code already `src/utils/api.ts` mein hai. Jab aapke endpoints ready hon, bas URL de den.

---

## Quick Summary

**2 Endpoints Required:**
1. `/api/auth/verify-password` - Password check karne ke liye
2. `/api/auth/request-password` - Email pe password bhejne ke liye

**What we send:**
- Password verification: Just password string
- Password request: Email + secrets data (street: 5, road: 6, plane: 4)

**What we expect back:**
- `{ success: true/false, message: "..." }`

**Full documentation:** `CLIENT_API_SPECIFICATION.md`


