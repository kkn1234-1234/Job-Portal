package com.jobconnect.repository;

import com.jobconnect.entity.ApplicantAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicantAccountRepository extends JpaRepository<ApplicantAccount, Long> {

    Optional<ApplicantAccount> findByEmail(String email);

    boolean existsByEmail(String email);
}
