package com.jobconnect.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ApplicationCreateRequest {
    @NotNull(message = "Job ID is required")
    private Long jobId;
    
    @Size(max = 2000, message = "Cover letter cannot exceed 2000 characters")
    private String coverLetter;
    
    private String resumeUrl;
}
