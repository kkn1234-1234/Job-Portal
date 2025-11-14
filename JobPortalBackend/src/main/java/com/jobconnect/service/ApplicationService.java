package com.jobconnect.service;

import com.jobconnect.dto.ApplicationCreateRequest;
import com.jobconnect.dto.ApplicationStatusUpdateRequest;
import com.jobconnect.entity.ApplicantAccount;
import com.jobconnect.entity.EmployerAccount;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobApplication;
import com.jobconnect.repository.JobApplicationRepository;
import com.jobconnect.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final AccountService accountService;
    private final NotificationService notificationService;

    public JobApplication applyForJob(ApplicationCreateRequest request, Long applicantId) {
        ApplicantAccount applicant = accountService.requireApplicant(applicantId);

        Job job = jobRepository.findById(request.getJobId())
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!"ACTIVE".equals(job.getStatus())) {
            throw new RuntimeException("This job is no longer accepting applications");
        }
        
        // Check if already applied
        Optional<JobApplication> existingApplication = 
            applicationRepository.findByApplicantAndJob(applicant, job);
        
        if (existingApplication.isPresent()) {
            throw new RuntimeException("You have already applied for this job");
        }
        
        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setApplicant(applicant);
        application.setCoverLetter(request.getCoverLetter());
        application.setResumeUrl(request.getResumeUrl() != null ? 
            request.getResumeUrl() : applicant.getResumeUrl());
        
        return applicationRepository.save(application);
    }

    public void withdrawApplication(Long applicationId, Long applicantId) {
        JobApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        if (!application.getApplicant().getId().equals(applicantId)) {
            throw new RuntimeException("Not authorized to withdraw this application");
        }
        
        applicationRepository.delete(application);
    }

    public JobApplication updateApplicationStatus(Long applicationId, 
                                                 ApplicationStatusUpdateRequest request, 
                                                 Long employerId) {
        JobApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        if (!application.getJob().getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Not authorized to update this application");
        }
        
        application.setStatus(request.getStatus());
        application.setNotes(request.getNotes());

        JobApplication saved = applicationRepository.save(application);

        // Notify applicant about status change
        ApplicantAccount applicant = saved.getApplicant();
        Job job = saved.getJob();
        String title = String.format("%s update", job.getTitle());
        String message = buildStatusMessage(saved, request.getStatus(), request.getNotes());
        notificationService.createNotification(
            applicant.getId(),
            employerId,
            title,
            message,
            "APPLICATION_STATUS"
        );
        
        return saved;
    }

    private String buildStatusMessage(JobApplication application, String status, String notes) {
        String base = String.format("Your application for %s at %s is now %s.",
            application.getJob().getTitle(),
            application.getJob().getCompany(),
            status);

        if (notes != null && !notes.isBlank()) {
            return base + " Notes from employer: " + notes;
        }
        return base;
    }

    public Page<JobApplication> getApplicationsByApplicant(Long applicantId, Pageable pageable) {
        ApplicantAccount applicant = accountService.requireApplicant(applicantId);
        return applicationRepository.findByApplicant(applicant, pageable);
    }

    public List<JobApplication> getApplicationsByJob(Long jobId, Long employerId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Not authorized to view applications for this job");
        }
        
        return applicationRepository.findByJob(job);
    }

    public Page<JobApplication> getApplicationsByEmployer(Long employerId, Pageable pageable) {
        EmployerAccount employer = accountService.requireEmployer(employerId);
        return applicationRepository.findByJobEmployer(employer, pageable);
    }

    public Optional<JobApplication> getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId);
    }

    public boolean hasApplied(Long applicantId, Long jobId) {
        ApplicantAccount applicant = accountService.requireApplicant(applicantId);
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        return applicationRepository.findByApplicantAndJob(applicant, job).isPresent();
    }

    public Long countApplicationsByJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.countByJob(job);
    }

    public List<JobApplication> getApplicationsByStatus(String status, Long employerId) {
        EmployerAccount employer = accountService.requireEmployer(employerId);
        return applicationRepository.findByStatusAndJobEmployer(status, employer);
    }
}
