package com.jobconnect.repository;

import com.jobconnect.entity.ApplicantAccount;
import com.jobconnect.entity.EmployerAccount;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Find application by applicant and job
    Optional<JobApplication> findByApplicantAndJob(ApplicantAccount applicant, Job job);
    
    // Find all applications by applicant
    Page<JobApplication> findByApplicant(ApplicantAccount applicant, Pageable pageable);
    
    // Find all applications for a job
    List<JobApplication> findByJob(Job job);
    
    // Find all applications for jobs posted by an employer
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.employer = :employer")
    Page<JobApplication> findByJobEmployer(@Param("employer") EmployerAccount employer, Pageable pageable);
    
    // Count applications for a job
    Long countByJob(Job job);
    
    // Find applications by status for an employer's jobs
    @Query("SELECT ja FROM JobApplication ja WHERE ja.status = :status AND ja.job.employer = :employer")
    List<JobApplication> findByStatusAndJobEmployer(@Param("status") String status, @Param("employer") EmployerAccount employer);
    
    // Find applications by status
    List<JobApplication> findByStatus(String status);
    
    // Check if user has applied for a job
    boolean existsByApplicantAndJob(ApplicantAccount applicant, Job job);
    
    // Count applications by status for a job
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.job = :job AND ja.status = :status")
    Long countByJobAndStatus(@Param("job") Job job, @Param("status") String status);
}
