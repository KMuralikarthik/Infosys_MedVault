package com.medvault.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "doctor_availability")
@Data
@NoArgsConstructor
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long doctorId;

    @ElementCollection
    private List<String> workingDays;

    private String startTime;
    private String endTime;
    private Integer duration;

    @ElementCollection
    private List<String> blockedDates;
}
