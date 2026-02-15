package com.myfirstproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfirstproject.entity.PatientProfile;
import com.myfirstproject.entity.Account;
import com.myfirstproject.repository.PatientProfileRepository;

@Service
public class PatientProfileService {

    @Autowired
    private PatientProfileRepository repository;

    public PatientProfile createProfile(PatientProfile profile) {
        return repository.save(profile);
    }

    public PatientProfile getByUser(Account user) {
        return repository.findByUser(user).orElse(null);
    }
}
