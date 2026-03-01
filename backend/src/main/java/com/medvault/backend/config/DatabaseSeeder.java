package com.medvault.backend.config;

import com.medvault.backend.models.DoctorProfile;
import com.medvault.backend.models.User;
import com.medvault.backend.repository.DoctorProfileRepository;
import com.medvault.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
            DoctorProfileRepository doctorProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Patient 1
        if (!userRepository.existsByEmail("michael.smith@example.com")) {
            User patient = new User("michael.smith@example.com",
                    passwordEncoder.encode("password123"),
                    "Michael Smith",
                    "ROLE_PATIENT");
            userRepository.save(patient);
        }

        // Patient 2
        if (!userRepository.existsByEmail("sarah.jenkins@example.com")) {
            User patient = new User("sarah.jenkins@example.com",
                    passwordEncoder.encode("password123"),
                    "Sarah Jenkins",
                    "ROLE_PATIENT");
            userRepository.save(patient);
            System.out.println("--- Realistic Patients Seeded ---");
        }

        // Doctor 1
        if (!userRepository.existsByEmail("dr.roberts@medvault.com")) {
            User doctor = new User("dr.roberts@medvault.com",
                    passwordEncoder.encode("secureDoc!"),
                    "Dr. Emily Roberts",
                    "ROLE_DOCTOR");
            userRepository.save(doctor);

            DoctorProfile profile = new DoctorProfile();
            profile.setUser(doctor);
            profile.setSpecialty("Cardiology");
            profile.setBio("Board-certified Cardiologist with 15 years of experience in preventative heart care.");
            doctorProfileRepository.save(profile);
        }

        // Doctor 2
        if (!userRepository.existsByEmail("dr.chen@medvault.com")) {
            User doctor = new User("dr.chen@medvault.com",
                    passwordEncoder.encode("secureDoc!"),
                    "Dr. Wei Chen",
                    "ROLE_DOCTOR");
            userRepository.save(doctor);

            DoctorProfile profile = new DoctorProfile();
            profile.setUser(doctor);
            profile.setSpecialty("Neurology");
            profile.setBio("Specializing in adult neurology, migraines, and movement disorders at MedVault Central.");
            doctorProfileRepository.save(profile);

            System.out.println("--- Realistic Doctors Seeded ---");
        }
    }
}
