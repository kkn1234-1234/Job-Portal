package com.jobconnect.controller;

import com.jobconnect.dto.JobCreateRequest;
import com.jobconnect.dto.JobSearchRequest;
import com.jobconnect.entity.Job;
import com.jobconnect.security.AccountPrincipal;
import com.jobconnect.service.JobService;
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
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class JobController {

    private final JobService jobService;

    // Get all active jobs with pagination
    @GetMapping
    public ResponseEntity<Page<Job>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(jobService.getAllJobs(pageable));
    }

    // Search jobs with filters
    @PostMapping("/search")
    public ResponseEntity<Page<Job>> searchJobs(@RequestBody JobSearchRequest request) {
        return ResponseEntity.ok(jobService.searchJobs(request));
    }

    // Get job by ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Create new job (Employer only)
    @PostMapping
    public ResponseEntity<?> createJob(
            @Valid @RequestBody JobCreateRequest request,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            if (principal == null || principal.getRole().isApplicant()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only employers can post jobs"));
            }
            Job job = jobService.createJob(request, principal.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update job (Employer only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobCreateRequest request,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            Job job = jobService.updateJob(id, request, principal.getId());
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete job (Employer only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long id,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            jobService.deleteJob(id, principal.getId());
            return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Close job posting (Employer only)
    @PutMapping("/{id}/close")
    public ResponseEntity<?> closeJob(
            @PathVariable Long id,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            jobService.closeJob(id, principal.getId());
            return ResponseEntity.ok(Map.of("message", "Job closed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get jobs posted by employer
    @GetMapping("/employer/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs(Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(jobService.getJobsByEmployer(principal.getId()));
    }

    // Save job (Applicant only)
    @PostMapping("/{id}/save")
    public ResponseEntity<?> saveJob(
            @PathVariable Long id,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            if (principal == null || principal.getRole().isEmployer()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only applicants can save jobs"));
            }
            jobService.saveJob(id, principal.getId());
            return ResponseEntity.ok(Map.of("message", "Job saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Unsave job (Applicant only)
    @DeleteMapping("/{id}/save")
    public ResponseEntity<?> unsaveJob(
            @PathVariable Long id,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            jobService.unsaveJob(id, principal.getId());
            return ResponseEntity.ok(Map.of("message", "Job unsaved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get saved jobs (Applicant only)
    @GetMapping("/saved")
    public ResponseEntity<List<Job>> getSavedJobs(Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(jobService.getSavedJobs(principal.getId()));
    }
}
