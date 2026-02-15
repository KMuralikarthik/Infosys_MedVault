package com.myfirstproject.repository;

import com.myfirstproject.entity.Appointment;
import com.myfirstproject.entity.Account;
import com.myfirstproject.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctor(Account doctor);

    List<Appointment> findByPatient(Account patient);

    boolean existsByDoctorAndAppointmentDateAndStatusIn(
            Account doctor,
            LocalDateTime appointmentDate,
            List<AppointmentStatus> statuses
    );
}
