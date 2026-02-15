package com.myfirstproject.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HelloController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello buddy 👋 Spring Boot API is working!";
    }
}
