package com.jobconnect.dto;

import lombok.Data;

@Data
public class JobSearchRequest {
    private String keyword;
    private String location;
    private String jobType;
    private String workMode;
    private String experienceLevel;
    private Integer minExperience;
    private Integer maxExperience;
    private String skills;
    private String industry;
    private String salaryMin;
    private String salaryMax;
    private String sortBy; // createdAt, salary, company
    private String sortOrder; // ASC, DESC
    private Integer page = 0;
    private Integer size = 10;
}
