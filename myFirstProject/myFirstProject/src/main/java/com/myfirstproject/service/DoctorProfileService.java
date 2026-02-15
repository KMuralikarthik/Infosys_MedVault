package com.myfirstproject.service;

import com.myfirstproject.entity.DoctorProfile;
import com.myfirstproject.entity.Account;
import com.myfirstproject.repository.DoctorProfileRepository;
import com.myfirstproject.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorProfileService {

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private AccountRepository accountRepository;

    // Create Doctor Profile
    public DoctorProfile createDoctorProfile(Long accountId,
                                             DoctorProfile profile) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        profile.setUser(account);

        return doctorProfileRepository.save(profile);
    }

    // Get Doctor Profile
    public DoctorProfile getDoctorProfile(Long accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        return doctorProfileRepository.findByUser(account)
                .orElseThrow(() ->
                        new RuntimeException("Doctor profile not found"));
    }

    // Update Doctor Profile
    public DoctorProfile updateDoctorProfile(Long accountId,
                                             DoctorProfile updatedProfile) {

        DoctorProfile existing = getDoctorProfile(accountId);

        existing.setSpecialization(
                updatedProfile.getSpecialization());
        existing.setHospitalName(
                updatedProfile.getHospitalName());
        existing.setExperienceYears(
                updatedProfile.getExperienceYears());

        return doctorProfileRepository.save(existing);
    }

    // Get All Doctors
    public List<DoctorProfile> getAllDoctors() {
        return doctorProfileRepository.findAll();
    }
    // create doctor profile
    public DoctorProfile createDoctorProfileByEmail(
            String email,
            DoctorProfile profile) {

        Account account = accountRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        profile.setUser(account);

        return doctorProfileRepository.save(profile);
    }

    // update doctor profile
    public DoctorProfile updateDoctorProfileByEmail(
            String email,
            DoctorProfile updatedProfile) {

        Account account = accountRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        DoctorProfile existing =
                doctorProfileRepository
                        .findByUser(account)
                        .orElseThrow(() ->
                                new RuntimeException("Doctor profile not found"));

        existing.setSpecialization(
                updatedProfile.getSpecialization());
        existing.setHospitalName(
                updatedProfile.getHospitalName());
        existing.setExperienceYears(
                updatedProfile.getExperienceYears());

        return doctorProfileRepository.save(existing);
    }

    public DoctorProfile getDoctorProfileByEmail(String email) {

        Account user = accountRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return doctorProfileRepository
                .findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }



}
