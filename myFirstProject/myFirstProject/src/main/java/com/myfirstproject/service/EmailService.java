package com.myfirstproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // 🔹 OTP Email
    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("MedVault OTP Verification");
        message.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");

        mailSender.send(message);
    }

    // 🔹 Registration Success Email
    public void sendRegistrationSuccess(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to MedVault");
        message.setText(
                "Hello " + name +
                        ",\n\nThank you for registering with MedVault.\n" +
                        "Your account has been successfully created.\n\n" +
                        "Stay Healthy!\nMedVault Team"
        );

        mailSender.send(message);
    }
}
