package com.medvault.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends a real email using Spring Boot's JavaMailSender
     */
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MedVault Registration - Your OTP Code");
            message.setText("Welcome to MedVault!\n\nYour One-Time Password (OTP) is: " + otp
                    + "\n\nThis code will expire in 5 minutes.\n\nThank you,\nThe MedVault Team");

            mailSender.send(message);
            logger.info("Successfully sent OTP email to " + toEmail);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to " + toEmail, e);
        }
    }
}
