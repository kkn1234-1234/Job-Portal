package com.jobconnect.controller;

import com.jobconnect.dto.AuthRequest;
import com.jobconnect.dto.AuthResponse;
import com.jobconnect.dto.ForgotPasswordRequest;
import com.jobconnect.dto.RegisterRequest;
import com.jobconnect.dto.ResetPasswordRequest;
import com.jobconnect.entity.User;
import com.jobconnect.security.AccountPrincipal;
import com.jobconnect.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        User user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody User updatedUser,
            Authentication auth) {
        try {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            User updated = authService.updateProfile(principal, updatedUser);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> passwords,
            Authentication auth) {
        try {
            String oldPassword = passwords.get("oldPassword");
            String newPassword = passwords.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Old password and new password are required"));
            }
            
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            authService.changePassword(principal, oldPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(Authentication auth) {
        if (auth != null && auth.isAuthenticated()) {
            AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
            User user = authService.getCurrentUser(principal);
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "email", user.getEmail(),
                "role", user.getRole(),
                "name", user.getName()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("valid", false));
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testApi() {
        return ResponseEntity.ok(Map.of("message", "Auth API is working"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            authService.sendForgotPasswordEmail(request);
            return ResponseEntity.ok(Map.of("message", "Password reset instructions sent if the email exists."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
