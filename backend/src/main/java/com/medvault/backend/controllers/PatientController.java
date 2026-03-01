package com.medvault.backend.controllers;

import com.medvault.backend.dto.ApiResponse;
import com.medvault.backend.models.Appointment;
import com.medvault.backend.models.DoctorProfile;
import com.medvault.backend.models.User;
import com.medvault.backend.models.Feedback;
import com.medvault.backend.repository.AppointmentRepository;
import com.medvault.backend.repository.DoctorProfileRepository;
import com.medvault.backend.repository.UserRepository;
import com.medvault.backend.repository.FeedbackRepository;
import com.medvault.backend.repository.NotificationRepository;
import com.medvault.backend.models.Notification;
import com.medvault.backend.models.DoctorAvailability;
import com.medvault.backend.repository.DoctorAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import com.medvault.backend.dto.AppointmentDTO;
import java.time.LocalDate;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PatientController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    DoctorProfileRepository doctorProfileRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    DoctorAvailabilityRepository availabilityRepository;

    // GET /api/doctors
    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        List<User> doctors = userRepository.findByRole("ROLE_DOCTOR");

        // Simple DTO mapping for this example
        List<Object> doctorDetails = doctors.stream().map(doctor -> {
            DoctorProfile profile = doctorProfileRepository.findByUserId(doctor.getId()).orElse(null);
            return new Object() {
                public final Long id = doctor.getId();
                public final String name = doctor.getName();
                public final String email = doctor.getEmail();
                public final String avatar = doctor.getAvatar();
                public final String specialty = profile != null ? profile.getSpecialty() : "General";
                public final String bio = profile != null ? profile.getBio() : "";
            };
        }).collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(true, doctorDetails, "Doctors fetched successfully"));
    }

    // GET /api/doctors/{id}/slots
    @GetMapping("/doctors/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(@PathVariable Long id, @RequestParam String date) {
        // Here we ideally generate time slots based on doctor's actual availability
        // configuration.
        // For simplicity now, we return a mock list and filter out already booked slots
        // for this date.

        List<String> allSlots = List.of(
                "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
                "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
                "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM");

        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorId(id).stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().toString().equals(date))
                .filter(a -> !a.getStatus().equals("CANCELLED") && !a.getStatus().equals("REJECTED"))
                .collect(Collectors.toList());

        List<String> bookedTimes = bookedAppointments.stream().map(Appointment::getTimeSlot)
                .collect(Collectors.toList());
        List<String> availableSlots = allSlots.stream().filter(slot -> !bookedTimes.contains(slot))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(true, availableSlots, "Available slots fetched"));
    }

    // POST /api/appointments
    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentDTO appointmentDto) {
        Appointment appointment = new Appointment();

        User doctor = userRepository.findById(appointmentDto.getDoctorId()).orElseThrow();
        User patient = userRepository.findById(appointmentDto.getPatientId()).orElseThrow();

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(LocalDate.parse(appointmentDto.getDate()));
        appointment.setTimeSlot(appointmentDto.getTimeSlot());
        appointment.setConsultationType(appointmentDto.getConsultationType());
        appointment.setReason(appointmentDto.getReason());
        appointment.setStatus("PENDING");

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Send notification to Doctor
        Notification notification = new Notification();
        notification.setUserId(doctor.getId());
        notification.setMessage("New appointment request from " + patient.getName());
        notification.setType("INFO");
        notificationRepository.save(notification);

        return ResponseEntity.ok(new ApiResponse<>(true, savedAppointment, "Appointment booked successfully"));
    }

    // GET /api/patients/{id}/appointments
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patients/{id}/appointments")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long id) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(id);
        return ResponseEntity.ok(new ApiResponse<>(true, appointments, "Appointments fetched"));
    }

    // POST /api/feedback
    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.ok(new ApiResponse<>(true, savedFeedback, "Feedback submitted successfully"));
    }
}
