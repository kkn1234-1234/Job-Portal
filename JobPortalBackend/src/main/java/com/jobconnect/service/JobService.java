package com.jobconnect.service;

import com.jobconnect.dto.JobCreateRequest;
import com.jobconnect.dto.JobSearchRequest;
import com.jobconnect.entity.ApplicantAccount;
import com.jobconnect.entity.EmployerAccount;
import com.jobconnect.entity.Job;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.ApplicantAccountRepository;
import com.jobconnect.repository.EmployerAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicantAccountRepository applicantRepository;
    private final EmployerAccountRepository employerRepository;

    public Page<Job> getAllJobs(Pageable pageable) {
        return jobRepository.findByStatus("ACTIVE", pageable);
    }

    public Page<Job> searchJobs(JobSearchRequest request) {
        Specification<Job> spec = buildJobSpecification(request);
        Pageable pageable = buildPageable(request);
        return jobRepository.findAll(spec, pageable);
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public List<Job> getJobsByEmployer(Long employerId) {
        EmployerAccount employer = employerRepository.findById(employerId)
            .orElseThrow(() -> new RuntimeException("Employer account not found"));
        return jobRepository.findByEmployer(employer);
    }

    public Job createJob(JobCreateRequest request, Long employerId) {
        EmployerAccount employer = employerRepository.findById(employerId)
            .orElseThrow(() -> new RuntimeException("Employer account not found"));

        Job job = new Job();
        mapJobCreateRequestToJob(request, job);
        job.setEmployer(employer);
        job.setCompany(employer.getCompanyName() != null ? employer.getCompanyName() : request.getCompany());
        
        return jobRepository.save(job);
    }

    public Job updateJob(Long jobId, JobCreateRequest request, Long employerId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Not authorized to update this job");
        }
        
        mapJobCreateRequestToJob(request, job);
        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId, Long employerId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Not authorized to delete this job");
        }
        
        jobRepository.delete(job);
    }

    public void closeJob(Long jobId, Long employerId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("Not authorized to close this job");
        }
        
        job.setStatus("CLOSED");
        jobRepository.save(job);
    }

    public List<Job> getSavedJobs(Long applicantId) {
        ApplicantAccount applicant = applicantRepository.findById(applicantId)
            .orElseThrow(() -> new RuntimeException("Applicant account not found"));
        return applicant.getSavedJobs();
    }

    public void saveJob(Long jobId, Long applicantId) {
        ApplicantAccount applicant = applicantRepository.findById(applicantId)
            .orElseThrow(() -> new RuntimeException("Applicant account not found"));
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!applicant.getSavedJobs().contains(job)) {
            applicant.getSavedJobs().add(job);
            applicantRepository.save(applicant);
        }
    }

    public void unsaveJob(Long jobId, Long applicantId) {
        ApplicantAccount applicant = applicantRepository.findById(applicantId)
            .orElseThrow(() -> new RuntimeException("Applicant account not found"));
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

        applicant.getSavedJobs().remove(job);
        applicantRepository.save(applicant);
    }

    private void mapJobCreateRequestToJob(JobCreateRequest request, Job job) {
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setWorkMode(request.getWorkMode());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setResponsibilities(request.getResponsibilities());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setMinExperience(request.getMinExperience());
        job.setMaxExperience(request.getMaxExperience());
        job.setEducation(request.getEducation());
        job.setIndustry(request.getIndustry());
        job.setBenefits(request.getBenefits());
        job.setApplicationDeadline(request.getApplicationDeadline());
    }

    private Specification<Job> buildJobSpecification(JobSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Always filter active jobs
            predicates.add(criteriaBuilder.equal(root.get("status"), "ACTIVE"));
            
            if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                String keyword = "%" + request.getKeyword().toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")), keyword);
                Predicate descriptionPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")), keyword);
                Predicate companyPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("company")), keyword);
                predicates.add(criteriaBuilder.or(titlePredicate, descriptionPredicate, companyPredicate));
            }
            
            if (request.getLocation() != null && !request.getLocation().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("location")), 
                    "%" + request.getLocation().toLowerCase() + "%"));
            }
            
            if (request.getJobType() != null && !request.getJobType().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("jobType"), request.getJobType()));
            }
            
            if (request.getWorkMode() != null && !request.getWorkMode().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("workMode"), request.getWorkMode()));
            }
            
            if (request.getExperienceLevel() != null && !request.getExperienceLevel().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("experienceLevel"), request.getExperienceLevel()));
            }
            
            if (request.getMinExperience() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("minExperience"), request.getMinExperience()));
            }
            
            if (request.getMaxExperience() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("maxExperience"), request.getMaxExperience()));
            }
            
            if (request.getSkills() != null && !request.getSkills().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("skills")), 
                    "%" + request.getSkills().toLowerCase() + "%"));
            }
            
            if (request.getIndustry() != null && !request.getIndustry().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("industry")), 
                    "%" + request.getIndustry().toLowerCase() + "%"));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Pageable buildPageable(JobSearchRequest request) {
        String sortBy = request.getSortBy() != null ? request.getSortBy() : "createdAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(request.getSortOrder()) 
            ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(request.getPage(), request.getSize(), Sort.by(direction, sortBy));
    }
}
