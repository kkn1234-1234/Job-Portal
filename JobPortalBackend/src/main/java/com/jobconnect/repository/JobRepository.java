package com.jobconnect.repository;

import com.jobconnect.entity.Job;
import com.jobconnect.entity.EmployerAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    // Find jobs by employer
    List<Job> findByEmployer(EmployerAccount employer);
    
    // Find active jobs
    Page<Job> findByStatus(String status, Pageable pageable);
    
    // Find jobs by multiple criteria
    @Query("SELECT j FROM Job j WHERE " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:jobType IS NULL OR j.jobType = :jobType) AND " +
            "(:workMode IS NULL OR j.workMode = :workMode) AND " +
            "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel) AND " +
            "j.status = 'ACTIVE'")
    Page<Job> searchJobs(@Param("keyword") String keyword,
                        @Param("location") String location,
                        @Param("jobType") String jobType,
                        @Param("workMode") String workMode,
                        @Param("experienceLevel") String experienceLevel,
                        Pageable pageable);
    
    // Count jobs by employer
    Long countByEmployer(EmployerAccount employer);
    
    // Find jobs with deadline approaching
    @Query("SELECT j FROM Job j WHERE j.applicationDeadline <= :deadline AND j.status = 'ACTIVE'")
    List<Job> findJobsWithDeadlineApproaching(@Param("deadline") LocalDateTime deadline);
    
    // Find recently posted jobs
    List<Job> findTop10ByStatusOrderByCreatedAtDesc(String status);
}
