package com.jobconnect.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "APPLICANT|EMPLOYER", message = "Role must be APPLICANT or EMPLOYER")
    private String role;
    
    // Additional fields for registration
    private String phone;
    private String companyName; // For employers
    private String companyLocation; // For employers
}
