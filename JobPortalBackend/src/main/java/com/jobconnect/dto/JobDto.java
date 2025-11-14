package com.jobconnect.dto;

public class JobDto {
    private String title;
    private String location;
    private String skills;
    private Integer experience;
    private String description;
    private Long employerId; // for server side linking
    public JobDto() {}
    // getters/setters
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getLocation() { return location; } public void setLocation(String location) { this.location = location; }
    public String getSkills() { return skills; } public void setSkills(String skills) { this.skills = skills; }
    public Integer getExperience() { return experience; } public void setExperience(Integer experience) { this.experience = experience; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public Long getEmployerId() { return employerId; } public void setEmployerId(Long employerId) { this.employerId = employerId; }
}
