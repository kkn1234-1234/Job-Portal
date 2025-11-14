package com.jobconnect.service;

import com.jobconnect.config.JwtUtil;
import com.jobconnect.dto.AccountPayload;
import com.jobconnect.dto.AuthRequest;
import com.jobconnect.dto.AuthResponse;
import com.jobconnect.dto.ForgotPasswordRequest;
import com.jobconnect.dto.RegisterRequest;
import com.jobconnect.dto.ResetPasswordRequest;
import com.jobconnect.entity.AccountRole;
import com.jobconnect.entity.ApplicantAccount;
import com.jobconnect.entity.EmployerAccount;
import com.jobconnect.entity.PasswordResetToken;
import com.jobconnect.entity.User;
import com.jobconnect.repository.ApplicantAccountRepository;
import com.jobconnect.repository.EmployerAccountRepository;
import com.jobconnect.repository.PasswordResetTokenRepository;
import com.jobconnect.security.AccountPrincipal;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final ApplicantAccountRepository applicantAccountRepository;
    private final EmployerAccountRepository employerAccountRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;
    private final AccountService accountService;

    public AuthResponse login(AuthRequest request) {
        if (request.getRole() == null || request.getRole().isBlank()) {
            throw new RuntimeException("Login role is required");
        }

        AccountRole role = parseRole(request.getRole());

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new RuntimeException("Invalid email or password");
        }

        AccountPayload payload = buildPayload(role, request.getEmail());
        String token = jwtUtil.generateToken(payload.getEmail(), role.name());
        return new AuthResponse(token, payload);
    }

    public AuthResponse register(RegisterRequest request) {
        if (accountService.emailExists(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        AccountRole role = parseRole(request.getRole());
        AccountPayload payload;

        if (role.isApplicant()) {
            ApplicantAccount account = new ApplicantAccount();
            account.setFullName(request.getName());
            account.setEmail(request.getEmail());
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            account.setPhone(request.getPhone());
            payload = accountService.toApplicantPayload(applicantAccountRepository.save(account));
        } else {
            if (request.getCompanyName() == null || request.getCompanyName().isBlank()) {
                throw new RuntimeException("Company name is required for employer registration");
            }

            EmployerAccount account = new EmployerAccount();
            account.setContactName(request.getName());
            account.setEmail(request.getEmail());
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            account.setPhone(request.getPhone());
            account.setCompanyName(request.getCompanyName());
            account.setCompanyLocation(request.getCompanyLocation());
            payload = accountService.toEmployerPayload(employerAccountRepository.save(account));
        }

        String token = jwtUtil.generateToken(payload.getEmail(), role.name());
        return new AuthResponse(token, payload);
    }

    public User getCurrentUser(AccountPrincipal principal) {
        if (principal.getRole().isApplicant()) {
            ApplicantAccount account = accountService.requireApplicant(principal.getId());
            return toUser(account);
        }
        EmployerAccount account = accountService.requireEmployer(principal.getId());
        return toUser(account);
    }

    public User updateProfile(AccountPrincipal principal, User updatedUser) {
        if (principal.getRole().isApplicant()) {
            ApplicantAccount account = accountService.requireApplicant(principal.getId());
            account.setFullName(updatedUser.getName());
            account.setPhone(updatedUser.getPhone());
            account.setBio(updatedUser.getBio());
            account.setSkills(updatedUser.getSkills());
            account.setExperience(updatedUser.getExperience());
            account.setEducation(updatedUser.getEducation());
            account.setResumeUrl(updatedUser.getResumeUrl());
            return toUser(applicantAccountRepository.save(account));
        }

        EmployerAccount account = accountService.requireEmployer(principal.getId());
        account.setContactName(updatedUser.getName());
        account.setPhone(updatedUser.getPhone());
        account.setCompanyName(updatedUser.getCompanyName());
        account.setCompanyDescription(updatedUser.getCompanyDescription());
        account.setCompanyWebsite(updatedUser.getCompanyWebsite());
        account.setCompanyLocation(updatedUser.getCompanyLocation());
        return toUser(employerAccountRepository.save(account));
    }

    public void changePassword(AccountPrincipal principal, String oldPassword, String newPassword) {
        if (principal.getRole().isApplicant()) {
            ApplicantAccount account = accountService.requireApplicant(principal.getId());
            if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
                throw new RuntimeException("Invalid old password");
            }
            account.setPassword(passwordEncoder.encode(newPassword));
            applicantAccountRepository.save(account);
            return;
        }

        EmployerAccount account = accountService.requireEmployer(principal.getId());
        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }
        account.setPassword(passwordEncoder.encode(newPassword));
        employerAccountRepository.save(account);
    }

    public void sendForgotPasswordEmail(ForgotPasswordRequest request) {
        ApplicantAccount applicant = applicantAccountRepository.findByEmail(request.getEmail()).orElse(null);
        EmployerAccount employer = applicant == null
            ? employerAccountRepository.findByEmail(request.getEmail()).orElse(null)
            : null;

        if (applicant == null && employer == null) {
            throw new RuntimeException("No account found with that email");
        }

        passwordResetTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        PasswordResetToken token = new PasswordResetToken();
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusHours(1));

        if (applicant != null) {
            token.setRole(AccountRole.APPLICANT);
            token.setApplicant(applicant);
        } else {
            token.setRole(AccountRole.EMPLOYER);
            token.setEmployer(employer);
        }

        passwordResetTokenRepository.save(token);

        String name = applicant != null ? applicant.getFullName() : employer.getContactName();
        sendResetEmail(request.getEmail(), token.getToken(), name);
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
            .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (token.isUsed() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token is no longer valid");
        }

        if (token.getRole().isApplicant()) {
            ApplicantAccount account = token.getApplicant();
            if (account == null) {
                throw new RuntimeException("Applicant account not found for reset token");
            }
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            applicantAccountRepository.save(account);
        } else {
            EmployerAccount account = token.getEmployer();
            if (account == null) {
                throw new RuntimeException("Employer account not found for reset token");
            }
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            employerAccountRepository.save(account);
        }

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }

    private AccountRole parseRole(String role) {
        try {
            return AccountRole.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Role must be APPLICANT or EMPLOYER");
        }
    }

    private AccountPayload buildPayload(AccountRole role, String email) {
        if (role.isApplicant()) {
            return accountService.toApplicantPayload(accountService.requireApplicantByEmail(email));
        }
        return accountService.toEmployerPayload(accountService.requireEmployerByEmail(email));
    }

    private User toUser(ApplicantAccount account) {
        User user = new User();
        user.setId(account.getId());
        user.setName(account.getFullName());
        user.setEmail(account.getEmail());
        user.setRole(AccountRole.APPLICANT.name());
        user.setPhone(account.getPhone());
        user.setBio(account.getBio());
        user.setSkills(account.getSkills());
        user.setExperience(account.getExperience());
        user.setEducation(account.getEducation());
        user.setResumeUrl(account.getResumeUrl());
        return user;
    }

    private User toUser(EmployerAccount account) {
        User user = new User();
        user.setId(account.getId());
        user.setName(account.getContactName());
        user.setEmail(account.getEmail());
        user.setRole(AccountRole.EMPLOYER.name());
        user.setPhone(account.getPhone());
        user.setCompanyName(account.getCompanyName());
        user.setCompanyDescription(account.getCompanyDescription());
        user.setCompanyWebsite(account.getCompanyWebsite());
        user.setCompanyLocation(account.getCompanyLocation());
        return user;
    }

    private void sendResetEmail(String toEmail, String token, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("JobConnect password reset requested");
            String resetUrl = String.format("http://localhost:3000/reset-password?token=%s", token);
            String content = """
                <p>Hi %s,</p>
                <p>A request was made to reset the password for your JobConnect account. To create a new password, follow the secure link below. The link remains active for the next 60 minutes.</p>
                <p style=\"margin: 24px 0\"><a href=\"%s\" style=\"display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 600;\">Set new password</a></p>
                <p>If the button does not work, copy and paste this URL into your browser:</p>
                <p style=\"font-size: 13px; color: #475569;\">%s</p>
                <p>If you did not request this change, please ignore this email — your password will remain unchanged.</p>
                <p style=\"margin-top: 24px; color: #475569;\">With appreciation,<br/>JobConnect Support</p>
            """.formatted(name != null ? name : "there", resetUrl, resetUrl);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send reset email. Please try again later.", e);
        }
    }
}
