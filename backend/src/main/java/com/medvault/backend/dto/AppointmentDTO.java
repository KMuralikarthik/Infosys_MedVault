package com.medvault.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AppointmentDTO {
    private Long doctorId;
    private Long patientId;
    private String date; // Using String to match frontend "YYYY-MM-DD"
    private String timeSlot;
    private String consultationType;
    private String reason;
}
