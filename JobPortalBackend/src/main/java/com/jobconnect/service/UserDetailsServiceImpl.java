package com.jobconnect.service;

import com.jobconnect.entity.ApplicantAccount;
import com.jobconnect.entity.EmployerAccount;
import com.jobconnect.repository.ApplicantAccountRepository;
import com.jobconnect.repository.EmployerAccountRepository;
import com.jobconnect.security.AccountPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final ApplicantAccountRepository applicantRepository;
    private final EmployerAccountRepository employerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ApplicantAccount applicant = applicantRepository.findByEmail(email).orElse(null);
        if (applicant != null) {
            return AccountPrincipal.applicant(applicant.getId(), applicant.getEmail(), applicant.getPassword());
        }

        EmployerAccount employer = employerRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Account not found"));

        return AccountPrincipal.employer(employer.getId(), employer.getEmail(), employer.getPassword());
    }
}
