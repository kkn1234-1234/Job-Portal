package com.jobconnect.controller;

import com.jobconnect.dto.ApplicationCreateRequest;
import com.jobconnect.dto.ApplicationStatusUpdateRequest;
import com.jobconnect.entity.JobApplication;
import com.jobconnect.security.AccountPrincipal;
import com.jobconnect.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ApplicationController {

    private final ApplicationService applicationService;

    // Apply for a job (Applicant only)
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(
            @Valid @RequestBody ApplicationCreateRequest request,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            if (!principal.getRole().isApplicant()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only applicants can apply for jobs"));
            }
            JobApplication application = applicationService.applyForJob(request, principal.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Withdraw application (Applicant only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> withdrawApplication(
            @PathVariable Long id,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            applicationService.withdrawApplication(id, principal.getId());
            return ResponseEntity.ok(Map.of("message", "Application withdrawn successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update application status (Employer only)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            if (!principal.getRole().isEmployer()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only employers can update application status"));
            }
            JobApplication application = applicationService.updateApplicationStatus(id, request, principal.getId());
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get my applications (Applicant only)
    @GetMapping("/my")
    public ResponseEntity<Page<JobApplication>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        Pageable pageable = PageRequest.of(page, size);
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(applicationService.getApplicationsByApplicant(principal.getId(), pageable));
    }

    // Get applications for a specific job (Employer only)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsByJob(
            @PathVariable Long jobId,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            if (!principal.getRole().isEmployer()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only employers can view job applications"));
            }
            List<JobApplication> applications = applicationService.getApplicationsByJob(jobId, principal.getId());
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all applications for employer's jobs (Employer only)
    @GetMapping("/employer")
    public ResponseEntity<Page<JobApplication>> getEmployerApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        if (!principal.getRole().isEmployer()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(applicationService.getApplicationsByEmployer(principal.getId(), pageable));
    }

    // Get application by ID
    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Check if user has applied for a job
    @GetMapping("/check/{jobId}")
    public ResponseEntity<Map<String, Boolean>> hasApplied(
            @PathVariable Long jobId,
            Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        boolean hasApplied = applicationService.hasApplied(principal.getId(), jobId);
        return ResponseEntity.ok(Map.of("hasApplied", hasApplied));
    }

    // Get application count for a job
    @GetMapping("/job/{jobId}/count")
    public ResponseEntity<Map<String, Long>> getApplicationCount(@PathVariable Long jobId) {
        Long count = applicationService.countApplicationsByJob(jobId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Get applications by status (Employer only)
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getApplicationsByStatus(
            @PathVariable String status,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            if (!principal.getRole().isEmployer()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only employers can view applications by status"));
            }
            List<JobApplication> applications = applicationService.getApplicationsByStatus(status, principal.getId());
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
