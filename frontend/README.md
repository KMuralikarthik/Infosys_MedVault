# MedVault: Health Management Platform

MedVault is a comprehensive full-stack healthcare application designed to facilitate seamless appointment scheduling, medical records management, and consultation workflows between patients and healthcare professionals.

## Architecture Overview

The system operates on a modern separated backend and frontend architecture:
- **Frontend**: React (Vite) single-page application focused on responsive, intuitive user experiences. State is managed via React ContextAPI. Includes role-based dashboards for Patients and Doctors.
- **Backend**: Java Spring Boot application providing RESTful APIs. It handles all business logic, security, and data persistence.
- **Database**: configured to use an in-memory execution via H2 for streamlined local development and testing, with readily available PostgreSQL configuration for production deployment.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Java JDK 21
- Maven (`mvn`)

### 1. Starting the Backend (Spring Boot)
The backend service must be running for the frontend to authenticate and load data.

1. Navigate to the backend directory:
   ```bash
   cd medvault-backend
   ```
2. Compile and run the Spring Boot application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. The server will start on `http://localhost:8080`.
*(Note: It is using a local in-memory H2 database. Data will reset on server restart. To use persistent PostgreSQL, update the application.properties file)*

### 2. Starting the Frontend (React Vite)
The frontend communicates directly with the backend via Axios.

1. Open a new terminal and navigate to the root directory:
   ```bash
   cd path/to/medvault-frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:5173`. Make sure the `.env` file reads `VITE_API_URL=http://localhost:8080/api`.

---

## 🔐 Authentication & Roles

MedVault uses **JWT (JSON Web Tokens)** for stateless authentication. 
Upon logging in, the server returns a token which the React app's Axios interceptor automatically attaches as a Bearer token (`Authorization: Bearer <token>`) to all subsequent API requests.

The system enforces strictly defined Role-Based Access Control (RBAC):
- **ROLE_PATIENT**: Can view doctors, book appointments, view their own appointment history, and submit feedback.
- **ROLE_DOCTOR**: Can view their schedule, accept/reject incoming appointment requests, complete consultations by adding diagnosis data, and update their availability.

---

## 📡 Core API Reference (`http://localhost:8080/api`)

### Authentication (`/auth`)
* `POST /auth/register`: Register a new Patient or Doctor account.
* `POST /auth/login`: Authenticate an existing account and retrieve the JWT.

### Patient Endpoints
* `GET /doctors`: Retrieve a list of all available doctors and their profiles.
* `POST /appointments`: Book a new appointment.
* `GET /patients/{id}/appointments`: Fetch the appointment history for a specific patient.
* `POST /feedback`: Submit a numeric rating and comment after a completed consultation.

### Doctor Endpoints (`/doctor`)
* `GET /doctor/dashboard/stats/{doctorId}`: Get metric counts for today's pending, completed, and total appointments.
* `GET /doctor/requests/{doctorId}`: View all `PENDING` appointment requests.
* `PUT /doctor/requests/{id}`: Approve or reject a specific appointment request.
* `POST /doctor/consultation/{id}`: Mark a visit as `COMPLETED` and attach consultation data (JSON block containing medical notes and prescriptions).
* `GET /doctor/availability/{doctorId}`: Fetch the doctor's weekly working days and hours.
* `PUT /doctor/availability/{doctorId}`: Update the doctor's availability configuration.

---

## 🛠️ Tech Stack & Dependencies

### Backend
- **Spring Boot 3.4.x**: Core application framework.
- **Spring Data JPA & Hibernate**: ORM for database queries and entity management mapping.
- **Spring Security**: handles endpoint authorization rules (`@PreAuthorize()`) and HTTP security chains.
- **JJWT Library**: Generates and parses cryptographic session tokens.
- **Lombok**: Boilerplate reduction for Java classes.

### Frontend
- **React 18**: Core UI rendering engine.
- **Vite**: Rapid development build tool.
- **Axios**: Promised based HTTP client customized with interceptors.
- **Tailwind CSS**: Utility-first CSS framework for styling.