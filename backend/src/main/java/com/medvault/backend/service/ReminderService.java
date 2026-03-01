package com.medvault.backend.service;

import com.medvault.backend.models.Appointment;
import com.medvault.backend.models.Notification;
import com.medvault.backend.repository.AppointmentRepository;
import com.medvault.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Runs every day at 8 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendAppointmentReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<Appointment> upcomingAppointments = appointmentRepository.findAll().stream()
                .filter(a -> tomorrow.equals(a.getAppointmentDate()) &&
                        ("APPROVED".equals(a.getStatus()) || "PENDING".equals(a.getStatus())))
                .toList();

        for (Appointment appointment : upcomingAppointments) {
            // Notify Patient
            Notification patientNotification = new Notification();
            patientNotification.setUserId(appointment.getPatient().getId());
            patientNotification
                    .setMessage("Reminder: You have an appointment tomorrow at " + appointment.getTimeSlot() +
                            " with Dr. " + appointment.getDoctor().getName());
            patientNotification.setType("INFO");
            notificationRepository.save(patientNotification);

            // Notify Doctor
            Notification doctorNotification = new Notification();
            doctorNotification.setUserId(appointment.getDoctor().getId());
            doctorNotification.setMessage("Reminder: You have an appointment tomorrow at " + appointment.getTimeSlot() +
                    " with Patient " + appointment.getPatient().getName());
            doctorNotification.setType("INFO");
            notificationRepository.save(doctorNotification);
        }
    }
}
