package com.jobconnect.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jobconnect.entity.AccountRole;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountPayload {
    Long id;
    String email;
    AccountRole role;
    String name;
    String fullName;
    String phone;
    String bio;
    String skills;
    String experience;
    String education;
    String resumeUrl;
    String companyName;
    String companyDescription;
    String companyWebsite;
    String companyLocation;
}
