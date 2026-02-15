package com.myfirstproject.repository;

import com.myfirstproject.entity.DoctorProfile;
import com.myfirstproject.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorProfileRepository
        extends JpaRepository<DoctorProfile, Integer> {

    Optional<DoctorProfile> findByUser(Account user);
}
