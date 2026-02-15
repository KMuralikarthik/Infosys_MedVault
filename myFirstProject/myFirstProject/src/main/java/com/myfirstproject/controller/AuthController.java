package com.myfirstproject.controller;

import com.myfirstproject.entity.Account;
import com.myfirstproject.repository.AccountRepository;
import com.myfirstproject.config.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.myfirstproject.entity.DoctorProfile;
import com.myfirstproject.repository.DoctorProfileRepository;



import java.util.*;



@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final JwtUtil jwtUtil;
    private final DoctorProfileRepository doctorProfileRepository;

    private Map<String, String> otpStorage = new HashMap<>();

    public AuthController(AccountRepository accountRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          JavaMailSender mailSender,
                          DoctorProfileRepository doctorProfileRepository) {

        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
        this.doctorProfileRepository = doctorProfileRepository;
    }





    // ===== send otp ======//
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email required");
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        otpStorage.put(email, otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("MedVault OTP Verification");
            message.setText("Your OTP for MedVault registration is: " + otp);

            mailSender.send(message);

            return ResponseEntity.ok("OTP sent successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send OTP");
        }
    }



    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Account account) {

        if (accountRepository.findByEmailIgnoreCase(account.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already exists");
        }

        // 🔥 Validate OTP
        String storedOtp = otpStorage.get(account.getEmail());

        if (storedOtp == null || !storedOtp.equals(account.getOtp())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid OTP");
        }

        account.setPassword(passwordEncoder.encode(account.getPassword()));

        Account savedUser = accountRepository.save(account);// SAVE USER FIRST
        System.out.println("Saved Role: " + savedUser.getRole());

        // 🔥 CREATE DOCTOR PROFILE IF ROLE = Doctor
        if ("Doctor".equalsIgnoreCase(savedUser.getRole())) {

            DoctorProfile profile = new DoctorProfile();
            profile.setSpecialization("General Physician");
            profile.setHospitalName("Default Hospital");
            profile.setExperienceYears(1);
            profile.setUser(savedUser);

            doctorProfileRepository.save(profile);
        }

        otpStorage.remove(account.getEmail()); // clear OTP

        return ResponseEntity.ok("User registered successfully");
    }



    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        Optional<Account> optionalUser =
                accountRepository.findByEmailIgnoreCase(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        Account user = optionalUser.get();

        // 🔥 Check password correctly
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());   // 🔥 ADD THIS
        response.put("email", user.getEmail()); // optional but good

        return ResponseEntity.ok(response);
    }
}
