package com.myfirstproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myfirstproject.entity.PatientProfile;
import com.myfirstproject.entity.Account;

import java.util.Optional;

@Repository
public interface PatientProfileRepository
        extends JpaRepository<PatientProfile, Integer> {

    Optional<PatientProfile> findByUser(Account user);
}
