package com.jobconnect.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicantProfileDto {
    Long id;
    String fullName;
    String email;
    String phone;
    String bio;
    String skills;
    String experience;
    String education;
    String resumeUrl;
}
