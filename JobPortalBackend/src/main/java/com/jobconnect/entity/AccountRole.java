package com.jobconnect.entity;

public enum AccountRole {
    APPLICANT,
    EMPLOYER;

    public boolean isApplicant() {
        return this == APPLICANT;
    }

    public boolean isEmployer() {
        return this == EMPLOYER;
    }
}
