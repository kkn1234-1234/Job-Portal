package com.jobconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Entity
@Table(name = "jobs")
@Data
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String company;
    
    @Column(nullable = false)
    private String location;
    
    private String jobType; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    
    private String workMode; // ONSITE, REMOTE, HYBRID
    
    private String experienceLevel; // ENTRY, MID, SENIOR, EXECUTIVE

    @Column(length = 3000)
    private String description;
    
    @Column(length = 2000)
    private String requirements;
    
    @Column(length = 1000)
    private String responsibilities;
    
    private String salary;
    
    private String skills;
    
    private Integer minExperience; // in years
    
    private Integer maxExperience; // in years
    
    private String education;
    
    private String industry;
    
    private String benefits;
    
    private LocalDateTime applicationDeadline;
    
    private String status; // ACTIVE, CLOSED, DRAFT
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private EmployerAccount employer;
    
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<JobApplication> applications;
    
    @ManyToMany(mappedBy = "savedJobs")
    @JsonIgnore
    private List<ApplicantAccount> savedByApplicants;
}
