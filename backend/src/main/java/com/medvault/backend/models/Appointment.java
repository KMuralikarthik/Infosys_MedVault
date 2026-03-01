package com.medvault.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    private String timeSlot; // e.g. "10:00 AM"

    private String status; // "PENDING", "APPROVED", "COMPLETED", "CANCELLED"

    private String consultationType; // "In-person", "Video"

    private String reason;

    // Store consultation outcomes as JSON text for simplicity
    @Column(columnDefinition = "TEXT")
    private String consultationDataJson;
}
