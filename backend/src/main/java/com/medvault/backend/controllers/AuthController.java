package com.medvault.backend.controllers;

import com.medvault.backend.dto.ApiResponse;
import com.medvault.backend.dto.JwtResponse;
import com.medvault.backend.dto.LoginRequest;
import com.medvault.backend.dto.SignupRequest;
import com.medvault.backend.models.DoctorProfile;
import com.medvault.backend.models.PatientProfile;
import com.medvault.backend.models.User;
import com.medvault.backend.repository.DoctorProfileRepository;
import com.medvault.backend.repository.PatientProfileRepository;
import com.medvault.backend.repository.UserRepository;
import com.medvault.backend.security.JwtUtils;
import com.medvault.backend.service.OtpService;
import com.medvault.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        UserRepository userRepository;

        @Autowired
        DoctorProfileRepository doctorProfileRepository;

        @Autowired
        PatientProfileRepository patientProfileRepository;

        @Autowired
        PasswordEncoder encoder;

        @Autowired
        JwtUtils jwtUtils;

        @Autowired
        OtpService otpService;

        @Autowired
        EmailService emailService;

        @PostMapping("/login")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                                .getPrincipal();

                User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

                return ResponseEntity.ok(new ApiResponse<JwtResponse>(true, new JwtResponse(jwt,
                                user.getId(),
                                user.getEmail(),
                                user.getName(),
                                user.getRole(),
                                user.getAvatar()), "Login successful"));
        }

        @PostMapping("/send-otp")
        public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
                String email = request.get("email");
                if (email == null || email.trim().isEmpty()) {
                        return ResponseEntity.badRequest().body(new ApiResponse<>(false, null, "Email is required"));
                }
                if (userRepository.existsByEmail(email)) {
                        return ResponseEntity.badRequest()
                                        .body(new ApiResponse<>(false, null, "Error: Email is already in use!"));
                }

                String otp = otpService.generateOtp(email);
                emailService.sendOtpEmail(email, otp);

                return ResponseEntity.ok(new ApiResponse<>(true, null, "OTP sent successfully"));
        }

        @PostMapping("/register")
        public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
                if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                        return ResponseEntity
                                        .badRequest()
                                        .body(new ApiResponse<Object>(false, null, "Error: Email is already in use!"));
                }

                // Verify OTP
                if (!otpService.validateOtp(signUpRequest.getEmail(), signUpRequest.getOtp())) {
                        return ResponseEntity
                                        .badRequest()
                                        .body(new ApiResponse<Object>(false, null, "Error: Invalid or expired OTP!"));
                }

                // Create new user's account
                String role = signUpRequest.getRole() != null && !signUpRequest.getRole().isEmpty()
                                ? signUpRequest.getRole()
                                : "ROLE_PATIENT";

                User user = new User(signUpRequest.getEmail(),
                                encoder.encode(signUpRequest.getPassword()),
                                signUpRequest.getName(),
                                role);

                // Save User
                userRepository.save(user);

                // If it's a doctor, create an empty profile
                if (role.equals("ROLE_DOCTOR")) {
                        DoctorProfile profile = new DoctorProfile();
                        profile.setUser(user);
                        doctorProfileRepository.save(profile);
                } else if (role.equals("ROLE_PATIENT")) {
                        PatientProfile profile = new PatientProfile();
                        profile.setUser(user);
                        patientProfileRepository.save(profile);
                }

                // Auto-login after registration
                String jwt = jwtUtils.generateJwtTokenFromUsername(user.getEmail());

                return ResponseEntity.ok(new ApiResponse<JwtResponse>(true, new JwtResponse(jwt,
                                user.getId(),
                                user.getEmail(),
                                user.getName(),
                                user.getRole(),
                                user.getAvatar()), "User registered successfully!"));
        }

        @GetMapping("/me")
        public ResponseEntity<?> getCurrentUser() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated()
                                || authentication.getPrincipal().equals("anonymousUser")) {
                        return ResponseEntity.status(401)
                                        .body(new ApiResponse<Object>(false, null, "Not authenticated"));
                }

                org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                                .getPrincipal();
                User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

                return ResponseEntity.ok(new ApiResponse<JwtResponse>(true, new JwtResponse(null,
                                user.getId(),
                                user.getEmail(),
                                user.getName(),
                                user.getRole(),
                                user.getAvatar()), "Current user fetched successfully"));
        }
}
