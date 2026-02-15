package com.myfirstproject.controller;

import com.myfirstproject.entity.Account;
import com.myfirstproject.repository.AccountRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    private final AccountRepository accountRepository;

    public AccountController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @GetMapping("/doctors")
    public List<Account> getDoctors() {
        return accountRepository.findByRoleIgnoreCase("DOCTOR");
    }
}
