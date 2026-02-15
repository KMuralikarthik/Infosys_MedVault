package com.myfirstproject.repository;

import com.myfirstproject.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByEmailIgnoreCase(String email);

    List<Account> findByRoleIgnoreCase(String role);
}
