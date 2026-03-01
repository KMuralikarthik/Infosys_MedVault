package com.medvault.backend.controllers;

import com.medvault.backend.dto.ApiResponse;
import com.medvault.backend.models.AuditLog;
import com.medvault.backend.models.MedicalRecord;
import com.medvault.backend.models.RecordAccess;
import com.medvault.backend.models.User;
import com.medvault.backend.repository.AuditLogRepository;
import com.medvault.backend.repository.MedicalRecordRepository;
import com.medvault.backend.repository.RecordAccessRepository;
import com.medvault.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/records")
public class RecordController {

    @Autowired
    MedicalRecordRepository recordRepository;

    @Autowired
    RecordAccessRepository accessRepository;

    @Autowired
    AuditLogRepository auditRepository;

    @Autowired
    UserRepository userRepository;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return userRepository.findByEmail(currentPrincipalName)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void logAction(User user, String action, Long targetId) {
        AuditLog log = new AuditLog();
        log.setUser(user);
        log.setAction(action);
        log.setTargetId(targetId);
        auditRepository.save(log);
    }

    @PostMapping(consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> uploadRecord(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam(value = "notes", required = false) String notes) {

        User patient = getCurrentUser();

        try {
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetLocation);

            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            // Add timestamp prefix to avoid collisions
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            Path filePath = targetLocation.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            MedicalRecord record = new MedicalRecord();
            record.setPatient(patient);
            record.setTitle(title);
            record.setCategory(category);
            record.setNotes(notes);
            record.setFileUrl(uniqueFileName); // In a real app, this would be a full URL or S3 key

            MedicalRecord savedRecord = recordRepository.save(record);

            logAction(patient, "UPLOAD_RECORD", savedRecord.getId());

            return ResponseEntity.ok(new ApiResponse<>(true, savedRecord, "Record uploaded successfully"));

        } catch (IOException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, "Could not upload file: " + ex.getMessage()));
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getMyRecords() {
        User patient = getCurrentUser();
        List<MedicalRecord> records = recordRepository.findByPatient(patient);
        return ResponseEntity.ok(new ApiResponse<>(true, records, "Fetched records successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        User patient = getCurrentUser();
        MedicalRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!record.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse<>(false, null, "Not authorized to delete this record"));
        }

        // We could also delete the physical file here
        recordRepository.delete(record);
        logAction(patient, "DELETE_RECORD", id);

        return ResponseEntity.ok(new ApiResponse<>(true, null, "Record deleted successfully"));
    }

    @PostMapping("/access/grant")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> grantAccess(@RequestBody Map<String, Object> payload) {
        User patient = getCurrentUser();
        Long doctorId = Long.valueOf(payload.get("doctorId").toString());
        Integer days = (Integer) payload.getOrDefault("days", 30); // Default 30 days

        User doctor = userRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));

        Optional<RecordAccess> existingAccess = accessRepository
                .findByPatientIdAndDoctorIdAndRevokedFalse(patient.getId(), doctorId);

        RecordAccess access;
        if (existingAccess.isPresent()) {
            access = existingAccess.get();
            access.setExpiresAt(LocalDateTime.now().plusDays(days));
        } else {
            access = new RecordAccess();
            access.setPatient(patient);
            access.setDoctor(doctor);
            access.setExpiresAt(LocalDateTime.now().plusDays(days));
            access.setRevoked(false);
        }

        accessRepository.save(access);
        logAction(patient, "GRANT_ACCESS", doctorId);

        return ResponseEntity.ok(new ApiResponse<>(true, access, "Access granted to " + doctor.getName()));
    }

    @PostMapping("/access/revoke")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> revokeAccess(@RequestBody Map<String, Object> payload) {
        User patient = getCurrentUser();
        Long doctorId = Long.valueOf(payload.get("doctorId").toString());

        Optional<RecordAccess> access = accessRepository.findByPatientIdAndDoctorIdAndRevokedFalse(patient.getId(),
                doctorId);

        if (access.isPresent()) {
            RecordAccess acc = access.get();
            acc.setRevoked(true);
            accessRepository.save(acc);
            logAction(patient, "REVOKE_ACCESS", doctorId);
            return ResponseEntity.ok(new ApiResponse<>(true, null, "Access revoked successfully"));
        }

        return ResponseEntity.badRequest().body(new ApiResponse<>(false, null, "No active access found"));
    }

    @GetMapping("/shared/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getSharedRecords(@PathVariable Long doctorId) {
        User doctor = getCurrentUser();
        if (!doctor.getId().equals(doctorId)) {
            return ResponseEntity.status(403).body(new ApiResponse<>(false, null, "Unauthorized"));
        }

        List<RecordAccess> activeAccesses = accessRepository.findByDoctorId(doctorId).stream()
                .filter(a -> !a.isRevoked()
                        && (a.getExpiresAt() == null || a.getExpiresAt().isAfter(LocalDateTime.now())))
                .collect(Collectors.toList());

        List<Long> patientIds = activeAccesses.stream()
                .map(a -> a.getPatient().getId())
                .distinct()
                .collect(Collectors.toList());

        // Simple aggregation for response
        List<Object> sharedRecords = patientIds.stream().map(pid -> {
            List<MedicalRecord> patientRecords = recordRepository.findByPatientId(pid);
            User patient = userRepository.findById(pid).orElse(null);
            return new Object() {
                public final User patientInfo = patient;
                public final List<MedicalRecord> records = patientRecords;
            };
        }).collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(true, sharedRecords, "Fetched shared records"));
    }
}
