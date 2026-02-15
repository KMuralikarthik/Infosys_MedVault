package com.myfirstproject.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;


import jakarta.persistence.*;

@Entity
@Table(name = "doctor_profiles")
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String specialization;

    private String hospitalName;

    private Integer experienceYears;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private Account user;



    public DoctorProfile() {
    }

    public DoctorProfile(Integer id, String specialization,
                         String hospitalName, Integer experienceYears,
                         Account user) {
        this.id = id;
        this.specialization = specialization;
        this.hospitalName = hospitalName;
        this.experienceYears = experienceYears;
        this.user = user;
    }

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Account getUser() {
        return user;
    }

    public void setUser(Account user) {
        this.user = user;
    }
}
