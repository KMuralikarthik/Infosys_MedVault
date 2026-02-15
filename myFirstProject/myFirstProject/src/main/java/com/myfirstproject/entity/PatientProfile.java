package com.myfirstproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patient_profiles")
public class PatientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodGroup;
    private String allergies;
    private String medicalHistory;

    // 🔗 Link to Account (NOT User)
    @OneToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account user;

    public PatientProfile() {
    }

    public PatientProfile(Long id, String bloodGroup,
                          String allergies, String medicalHistory,
                          Account user) {
        this.id = id;
        this.bloodGroup = bloodGroup;
        this.allergies = allergies;
        this.medicalHistory = medicalHistory;
        this.user = user;
    }

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public Account getUser() {
        return user;
    }

    public void setUser(Account user) {
        this.user = user;
    }
}
