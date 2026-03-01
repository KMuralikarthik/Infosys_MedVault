package com.medvault.backend.repository;

import com.medvault.backend.models.RecordAccess;
import com.medvault.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecordAccessRepository extends JpaRepository<RecordAccess, Long> {
    List<RecordAccess> findByPatientId(Long patientId);

    List<RecordAccess> findByDoctorId(Long doctorId);

    List<RecordAccess> findByPatientIdAndDoctorId(Long patientId, Long doctorId);

    Optional<RecordAccess> findByPatientIdAndDoctorIdAndRevokedFalse(Long patientId, Long doctorId);
}
