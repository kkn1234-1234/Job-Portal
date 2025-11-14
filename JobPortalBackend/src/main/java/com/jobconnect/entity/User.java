package com.jobconnect.entity;

import lombok.Data;

@Data
public class User {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String bio;
    private String skills;
    private String experience;
    private String education;
    private String resumeUrl;
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companyLocation;
}
