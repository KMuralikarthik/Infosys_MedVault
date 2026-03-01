package com.medvault.backend.repository;

import com.medvault.backend.models.MedicalRecord;
import com.medvault.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatient(User patient);

    List<MedicalRecord> findByPatientId(Long patientId);
}
