package com.jobconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Data
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "applicant_id", nullable = false)
    private ApplicantAccount applicant;
    
    @Column(length = 2000)
    private String coverLetter;
    
    private String resumeUrl;
    
    private String status; // PENDING, REVIEWED, SHORTLISTED, REJECTED, ACCEPTED
    
    @Column(length = 1000)
    private String notes; // Notes from employer
    
    private LocalDateTime appliedAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
