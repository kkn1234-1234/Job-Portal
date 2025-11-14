package com.jobconnect.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ApplicationStatusUpdateRequest {
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PENDING|REVIEWED|SHORTLISTED|REJECTED|ACCEPTED", message = "Invalid status")
    private String status;
    
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}
