package com.jobconnect.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
public class JobCreateRequest {
    @NotBlank(message = "Job title is required")
    private String title;
    
    @NotBlank(message = "Company name is required")
    private String company;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotBlank(message = "Job type is required")
    @Pattern(regexp = "FULL_TIME|PART_TIME|CONTRACT|INTERNSHIP", message = "Invalid job type")
    private String jobType;
    
    @NotBlank(message = "Work mode is required")
    @Pattern(regexp = "ONSITE|REMOTE|HYBRID", message = "Invalid work mode")
    private String workMode;
    
    @NotBlank(message = "Experience level is required")
    @Pattern(regexp = "ENTRY|MID|SENIOR|EXECUTIVE", message = "Invalid experience level")
    private String experienceLevel;
    
    @NotBlank(message = "Description is required")
    @Size(min = 50, max = 3000, message = "Description must be between 50 and 3000 characters")
    private String description;
    
    private String requirements;
    private String responsibilities;
    private String salary;
    private String skills;
    
    @Min(value = 0, message = "Minimum experience cannot be negative")
    private Integer minExperience;
    
    @Min(value = 0, message = "Maximum experience cannot be negative")
    private Integer maxExperience;
    
    private String education;
    private String industry;
    private String benefits;
    private LocalDateTime applicationDeadline;
}
