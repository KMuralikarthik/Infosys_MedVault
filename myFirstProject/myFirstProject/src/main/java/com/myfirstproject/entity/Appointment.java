package com.myfirstproject.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient Account
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Account patient;

    // Doctor Account
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Account doctor;

    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    private String feedback;

    // Constructors
    public Appointment() {
    }

    public Appointment(Long id, Account patient, Account doctor,
                       LocalDateTime appointmentDate,
                       AppointmentStatus status, String feedback) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.status = status;
        this.feedback = feedback;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Account getPatient() {
        return patient;
    }

    public void setPatient(Account patient) {
        this.patient = patient;
    }

    public Account getDoctor() {
        return doctor;
    }

    public void setDoctor(Account doctor) {
        this.doctor = doctor;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
