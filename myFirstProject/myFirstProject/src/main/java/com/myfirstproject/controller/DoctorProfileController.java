package com.myfirstproject.controller;

import com.myfirstproject.entity.DoctorProfile;
import com.myfirstproject.repository.DoctorProfileRepository;
import com.myfirstproject.service.DoctorProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;


@RestController
@RequestMapping("/doctor")
public class DoctorProfileController {


    @Autowired
    private DoctorProfileService doctorProfileService;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;  // ✅ ADD THIS

    // ================= CREATE PROFILE =================
    @PreAuthorize("hasRole('Doctor')")
    @PostMapping("/create")
    public DoctorProfile createProfile(
            @RequestBody DoctorProfile profile,
            Authentication authentication) {

        String email = authentication.getName();

        return doctorProfileService
                .createDoctorProfileByEmail(email, profile);
    }

    // ================= GET PROFILE =================
    @GetMapping("/{accountId}")
    public DoctorProfile getProfile(
            @PathVariable Long accountId) {

        return doctorProfileService
                .getDoctorProfile(accountId);
    }

    // ================= UPDATE PROFILE =================
    @PreAuthorize("hasRole('Doctor')")
    @PutMapping("/update")
    public DoctorProfile updateProfile(
            @RequestBody DoctorProfile profile,
            Authentication authentication) {

        String email = authentication.getName();

        return doctorProfileService
                .updateDoctorProfileByEmail(email, profile);
    }

    // ================= GET ALL DOCTORS =================
    @GetMapping("/all")
    public List<Map<String, Object>> getAllDoctors() {

        // ✅ USE INJECTED REPOSITORY (NOT CLASS NAME)
        List<DoctorProfile> doctors = doctorProfileRepository.findAll();

        List<Map<String, Object>> response = new ArrayList<>();

        for (DoctorProfile d : doctors) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("specialization", d.getSpecialization());
            map.put("hospitalName", d.getHospitalName());
            map.put("experienceYears", d.getExperienceYears());
            map.put("name", d.getUser().getName());

            response.add(map);
        }

        return response;
    }

    // ================= GET MY PROFILE =================
    @GetMapping("/my-profile")
    public DoctorProfile getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        return doctorProfileService.getDoctorProfileByEmail(email);
    }
}
