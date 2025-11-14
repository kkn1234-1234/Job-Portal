package com.jobconnect.service;

import com.jobconnect.dto.AccountPayload;
import com.jobconnect.entity.AccountRole;
import com.jobconnect.entity.ApplicantAccount;
import com.jobconnect.entity.EmployerAccount;
import com.jobconnect.repository.ApplicantAccountRepository;
import com.jobconnect.repository.EmployerAccountRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final ApplicantAccountRepository applicantRepository;
    private final EmployerAccountRepository employerRepository;

    public boolean emailExists(String email) {
        return applicantRepository.existsByEmail(email) || employerRepository.existsByEmail(email);
    }

    public Optional<ApplicantAccount> findApplicantByEmail(String email) {
        return applicantRepository.findByEmail(email);
    }

    public Optional<EmployerAccount> findEmployerByEmail(String email) {
        return employerRepository.findByEmail(email);
    }

    public Optional<AccountPayload> findPayloadByEmail(String email) {
        return findApplicantByEmail(email)
            .map(this::toApplicantPayload)
            .or(() -> findEmployerByEmail(email).map(this::toEmployerPayload));
    }

    public ApplicantAccount requireApplicantByEmail(String email) {
        return findApplicantByEmail(email)
            .orElseThrow(() -> new RuntimeException("Applicant account not found"));
    }

    public EmployerAccount requireEmployerByEmail(String email) {
        return findEmployerByEmail(email)
            .orElseThrow(() -> new RuntimeException("Employer account not found"));
    }

    public ApplicantAccount requireApplicant(Long id) {
        return applicantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Applicant account not found"));
    }

    public EmployerAccount requireEmployer(Long id) {
        return employerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employer account not found"));
    }

    public AccountPayload requirePayload(AccountRole role, Long accountId) {
        if (role.isApplicant()) {
            return toApplicantPayload(requireApplicant(accountId));
        }
        return toEmployerPayload(requireEmployer(accountId));
    }

    public AccountPayload toApplicantPayload(ApplicantAccount account) {
        return AccountPayload.builder()
            .id(account.getId())
            .email(account.getEmail())
            .role(AccountRole.APPLICANT)
            .name(account.getFullName())
            .fullName(account.getFullName())
            .phone(account.getPhone())
            .bio(account.getBio())
            .skills(account.getSkills())
            .experience(account.getExperience())
            .education(account.getEducation())
            .resumeUrl(account.getResumeUrl())
            .build();
    }

    public AccountPayload toEmployerPayload(EmployerAccount account) {
        return AccountPayload.builder()
            .id(account.getId())
            .email(account.getEmail())
            .role(AccountRole.EMPLOYER)
            .name(account.getContactName())
            .fullName(account.getContactName())
            .phone(account.getPhone())
            .companyName(account.getCompanyName())
            .companyDescription(account.getCompanyDescription())
            .companyWebsite(account.getCompanyWebsite())
            .companyLocation(account.getCompanyLocation())
            .build();
    }
}
