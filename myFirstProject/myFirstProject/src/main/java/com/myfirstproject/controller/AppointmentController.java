package com.myfirstproject.controller;

import com.myfirstproject.entity.*;
import com.myfirstproject.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public Appointment bookAppointment(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestParam String dateTime) {

        return appointmentService.bookAppointment(
                patientId,
                doctorId,
                LocalDateTime.parse(dateTime)
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctorAppointments(@PathVariable Long doctorId) {
        return appointmentService.getDoctorAppointments(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getPatientAppointments(@PathVariable Long patientId) {
        return appointmentService.getPatientAppointments(patientId);
    }

    @PutMapping("/{id}/approve/{doctorId}")
    public Appointment approve(@PathVariable Long id,
                               @PathVariable Long doctorId) {

        return appointmentService.updateStatus(
                id,
                doctorId,
                AppointmentStatus.APPROVED
        );
    }

    @PutMapping("/{id}/reject/{doctorId}")
    public Appointment reject(@PathVariable Long id,
                              @PathVariable Long doctorId) {

        return appointmentService.updateStatus(
                id,
                doctorId,
                AppointmentStatus.REJECTED
        );
    }

    @PutMapping("/{id}/complete/{doctorId}")
    public Appointment complete(@PathVariable Long id,
                                @PathVariable Long doctorId) {

        return appointmentService.updateStatus(
                id,
                doctorId,
                AppointmentStatus.COMPLETED
        );
    }

    @PutMapping("/{id}/cancel/{patientId}")
    public Appointment cancel(@PathVariable Long id,
                              @PathVariable Long patientId) {

        return appointmentService.cancelAppointment(id, patientId);
    }



}
