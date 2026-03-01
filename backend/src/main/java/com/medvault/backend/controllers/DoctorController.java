package com.medvault.backend.controllers;

import com.medvault.backend.dto.ApiResponse;
import com.medvault.backend.models.Appointment;
import com.medvault.backend.models.DoctorAvailability;
import com.medvault.backend.repository.AppointmentRepository;
import com.medvault.backend.repository.DoctorAvailabilityRepository;
import com.medvault.backend.repository.NotificationRepository;
import com.medvault.backend.models.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    NotificationRepository notificationRepository;

    // GET /api/doctor/dashboard/stats
    @GetMapping("/dashboard/stats/{doctorId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long doctorId) {
        List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctorId);

        long pending = allAppointments.stream().filter(a -> "PENDING".equals(a.getStatus())).count();
        long completed = allAppointments.stream().filter(a -> "COMPLETED".equals(a.getStatus())).count();
        long total = allAppointments.size();

        Map<String, Long> stats = new HashMap<>();
        stats.put("pending", pending);
        stats.put("completed", completed);
        stats.put("total", total);

        return ResponseEntity.ok(new ApiResponse<>(true, stats, "Stats fetched successfully"));
    }

    // GET /api/doctor/requests
    @GetMapping("/requests/{doctorId}")
    public ResponseEntity<?> getPendingRequests(@PathVariable Long doctorId) {
        List<Appointment> requests = appointmentRepository.findByDoctorIdAndStatus(doctorId, "PENDING");
        return ResponseEntity.ok(new ApiResponse<>(true, requests, "Requests fetched"));
    }

    // GET /api/doctor/appointments
    @GetMapping("/appointments/{doctorId}")
    public ResponseEntity<?> getAllDoctorAppointments(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, appointments, "Appointments fetched"));
    }

    // PUT /api/doctor/requests/{id}
    @PutMapping("/requests/{id}")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status").toUpperCase(); // Standardize to "APPROVED" or "REJECTED"

        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        appointment.setStatus(newStatus);

        appointmentRepository.save(appointment);

        // Send notification to Patient
        Notification notification = new Notification();
        notification.setUserId(appointment.getPatient().getId());
        notification.setMessage("Your appointment on " + appointment.getAppointmentDate() + " has been " + newStatus);
        notification.setType(newStatus.equals("APPROVED") ? "SUCCESS" : "WARNING");
        notificationRepository.save(notification);

        return ResponseEntity.ok(new ApiResponse<>(true, appointment, "Appointment " + newStatus));
    }

    // POST /api/doctor/consultation/{id}
    @PostMapping("/consultation/{id}")
    public ResponseEntity<?> completeConsultation(@PathVariable Long id, @RequestBody String consultationDataJson) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        appointment.setConsultationDataJson(consultationDataJson);
        appointment.setStatus("COMPLETED");

        appointmentRepository.save(appointment);

        // Send notification to Patient
        Notification notification = new Notification();
        notification.setUserId(appointment.getPatient().getId());
        notification.setMessage("Consultation completed for your visit on " + appointment.getAppointmentDate());
        notification.setType("SUCCESS");
        notificationRepository.save(notification);

        return ResponseEntity.ok(new ApiResponse<>(true, appointment, "Consultation saved successfully"));
    }

    // GET /api/doctor/availability/{doctorId}
    @GetMapping("/availability/{doctorId}")
    public ResponseEntity<?> getAvailability(@PathVariable Long doctorId) {
        DoctorAvailability availability = availabilityRepository.findByDoctorId(doctorId).orElseGet(() -> {
            DoctorAvailability defaultAvail = new DoctorAvailability();
            defaultAvail.setDoctorId(doctorId);
            defaultAvail.setWorkingDays(Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"));
            defaultAvail.setStartTime("09:00 AM");
            defaultAvail.setEndTime("05:00 PM");
            defaultAvail.setDuration(30);
            return defaultAvail;
        });
        return ResponseEntity.ok(new ApiResponse<>(true, availability, "Availability fetched"));
    }

    // PUT /api/doctor/availability/{doctorId}
    @PutMapping("/availability/{doctorId}")
    public ResponseEntity<?> updateAvailability(@PathVariable Long doctorId, @RequestBody DoctorAvailability newAvail) {
        DoctorAvailability availability = availabilityRepository.findByDoctorId(doctorId)
                .orElse(new DoctorAvailability());
        availability.setDoctorId(doctorId);
        availability.setWorkingDays(newAvail.getWorkingDays());
        availability.setStartTime(newAvail.getStartTime());
        availability.setEndTime(newAvail.getEndTime());
        availability.setDuration(newAvail.getDuration());
        availability.setBlockedDates(newAvail.getBlockedDates());

        availabilityRepository.save(availability);
        return ResponseEntity.ok(new ApiResponse<>(true, availability, "Availability updated"));
    }
}
