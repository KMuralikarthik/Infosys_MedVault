package com.medvault.backend.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;

@Service
public class OtpService {

    // Store OTPs in memory: Email -> OTP Data
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    // OTP valid for 5 minutes
    private static final int EXPIRE_MINS = 5;

    public String generateOtp(String email) {
        // Generate 6 digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));

        OtpData otpData = new OtpData(otp, LocalDateTime.now().plusMinutes(EXPIRE_MINS));
        otpStorage.put(email, otpData);

        return otp;
    }

    public boolean validateOtp(String email, String otpProvided) {
        if (!otpStorage.containsKey(email)) {
            return false;
        }

        OtpData otpData = otpStorage.get(email);

        // Check if expired
        if (otpData.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpStorage.remove(email); // Clean up expired OTP
            return false;
        }

        // Match OTP
        if (otpData.getOtp().equals(otpProvided)) {
            otpStorage.remove(email); // OTP is single-use
            return true;
        }

        return false;
    }

    // Inner class to hold OTP and its expiry
    private static class OtpData {
        private String otp;
        private LocalDateTime expiryTime;

        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}
