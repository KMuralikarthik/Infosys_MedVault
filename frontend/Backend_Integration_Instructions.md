# MedVault: Backend Integration Guide (Spring Boot)

This document provides the technical requirements, API endpoints, and data structures necessary to integrate the MedVault React frontend with a Spring Boot backend.

## 1. Authentication & Security
The frontend uses **JWT (JSON Web Tokens)** for session management.
- **Security**: Implement Spring Security with JWT.
- **CORS**: Enable CORS for `http://localhost:5173`.
- **Roles**: Support `ROLE_PATIENT` and `ROLE_DOCTOR`.

### Auth Endpoints
- `POST /api/auth/login`: Returns JWT and User object.
- `POST /api/auth/register`: Handle multi-step signup and OTP verification (optional backend-side).

---

## 2. API Endpoints

### 🩺 Patient Management
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/doctors` | GET | List all doctors with specialty & ratings. |
| `/api/appointments` | POST | Book a new appointment. |
| `/api/patients/{id}/appointments` | GET | Get history for a specific patient. |
| `/api/records` | GET/POST | Manage medical documents (PDF/Images). |
| `/api/feedback` | POST | Submit rating and comments for a visit. |

### 👨‍⚕️ Doctor Management
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/doctor/dashboard/stats` | GET | Get today's counts (pending, total, etc.). |
| `/api/doctor/requests` | GET | List pending appointment requests. |
| `/api/doctor/requests/{id}` | PUT | Approve/Reject request (include reason). |
| `/api/doctor/availability` | GET/PUT | Set working hours and block dates. |
| `/api/doctor/consultation/{id}` | POST | Complete visit: save diagnosis & prescriptions. |

---

## 3. Data Models (JSON Structure)

### Appointment Object
```json
{
  "id": "Long",
  "doctorId": "Long",
  "patientId": "String",
  "patientName": "String",
  "date": "YYYY-MM-DD",
  "timeSlot": "HH:mm AM/PM",
  "status": "PENDING | APPROVED | COMPLETED | CANCELLED",
  "consultationType": "In-person | Video",
  "reason": "String",
  "consultationData": {
    "diagnosis": "String",
    "notes": "String",
    "prescriptions": ["String"]
  }
}
```

### Doctor Profile
```json
{
  "id": "Long",
  "name": "String",
  "specialty": "String",
  "bio": "String",
  "education": [{"school": "String", "degree": "String"}],
  "certifications": [{"name": "String", "year": "String"}]
}
```

---

## 4. Frontend Integration Steps
1. **API Base URL**: Update `src/utils/api.js` (or similar) to point to the Spring Boot server (`http://localhost:8080`).
2. **Standardize Responses**: All endpoints should return a standard wrapper:
   ```json
   {
     "success": true,
     "data": { ... },
     "message": "Optional message"
   }
   ```
3. **Environment Variables**: Use a `.env` file in the frontend root:
   ```text
   VITE_API_URL=http://localhost:8080
   ```

## 5. Database Schema Suggestions
- **Users**: (id, email, password, role, name, avatar)
- **Appointments**: (id, patient_id, doctor_id, date, time, status, type, etc.)
- **Doctor_Availability**: (doctor_id, weekday, start_time, end_time, slot_duration)
- **Medical_Records**: (id, patient_id, file_url, type, upload_date)
