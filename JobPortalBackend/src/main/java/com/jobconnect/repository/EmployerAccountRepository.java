package com.jobconnect.repository;

import com.jobconnect.entity.EmployerAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerAccountRepository extends JpaRepository<EmployerAccount, Long> {

    Optional<EmployerAccount> findByEmail(String email);

    boolean existsByEmail(String email);
}
