package com.myfirstproject.service;

import com.myfirstproject.entity.Account;
import com.myfirstproject.entity.Appointment;
import com.myfirstproject.entity.AppointmentStatus;
import com.myfirstproject.repository.AccountRepository;
import com.myfirstproject.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AccountRepository accountRepository;

    // ==========================
    // BOOK APPOINTMENT (PATIENT ONLY)
    // ==========================


    public Appointment bookAppointment(Long patientId,
                                       Long doctorId,
                                       LocalDateTime dateTime) {
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book appointment in the past");
        }


        Account patient = accountRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        if (!"PATIENT".equalsIgnoreCase(patient.getRole())) {
            throw new RuntimeException("Only PATIENT can book appointments");
        }

        Account doctor = accountRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        if (!"DOCTOR".equalsIgnoreCase(doctor.getRole())) {
            throw new RuntimeException("Invalid doctor account");
        }

        List<AppointmentStatus> activeStatuses = List.of(
                AppointmentStatus.PENDING,
                AppointmentStatus.APPROVED
        );

        boolean alreadyBooked =
                appointmentRepository
                        .existsByDoctorAndAppointmentDateAndStatusIn(
                                doctor,
                                dateTime,
                                activeStatuses
                        );

        if (alreadyBooked) {
            throw new RuntimeException("This time slot is already booked");
        }


        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(dateTime);
        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    // ==========================
    // GET APPOINTMENTS FOR DOCTOR
    // ==========================
    public List<Appointment> getDoctorAppointments(Long doctorId) {

        Account doctor = accountRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        if (!"DOCTOR".equalsIgnoreCase(doctor.getRole())) {
            throw new RuntimeException("Access denied: Not a doctor");
        }

        return appointmentRepository.findByDoctor(doctor);
    }

    // ==========================
    // GET APPOINTMENTS FOR PATIENT
    // ==========================
    public List<Appointment> getPatientAppointments(Long patientId) {

        Account patient = accountRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        if (!"PATIENT".equalsIgnoreCase(patient.getRole())) {
            throw new RuntimeException("Access denied: Not a patient");
        }

        return appointmentRepository.findByPatient(patient);
    }

    // ==========================
    // APPROVE / REJECT (DOCTOR ONLY)
    // ==========================
    public Appointment updateStatus(Long appointmentId,
                                    Long doctorId,
                                    AppointmentStatus status) {

        Appointment appointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found"));

        Account doctor = accountRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        if (!"DOCTOR".equalsIgnoreCase(doctor.getRole())) {
            throw new RuntimeException("Only DOCTOR can update appointment status");
        }

        // Extra security check: doctor can update only his own appointment
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("You are not assigned to this appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.REJECTED
                || appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("This appointment cannot be modified");
        }

        if (status == AppointmentStatus.COMPLETED
                && appointment.getStatus() != AppointmentStatus.APPROVED) {
            throw new RuntimeException("Only approved appointments can be completed");
        }


        appointment.setStatus(status);

        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long appointmentId, Long patientId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check patient ownership
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Unauthorized cancel attempt");
        }

        // Prevent cancelling completed appointments
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        return appointmentRepository.save(appointment);
    }

}
