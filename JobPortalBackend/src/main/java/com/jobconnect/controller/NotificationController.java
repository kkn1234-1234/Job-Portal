package com.jobconnect.controller;

import com.jobconnect.dto.NotificationResponse;
import com.jobconnect.security.AccountPrincipal;
import com.jobconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        if (!principal.getRole().isApplicant()) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(principal.getId()));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id, Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        if (!principal.getRole().isApplicant()) {
            return ResponseEntity.status(403).build();
        }
        notificationService.markAsRead(id, principal.getId());
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        if (!principal.getRole().isApplicant()) {
            return ResponseEntity.status(403).build();
        }
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        AccountPrincipal principal = (AccountPrincipal) auth.getPrincipal();
        if (!principal.getRole().isApplicant()) {
            return ResponseEntity.status(403).build();
        }
        long count = notificationService.getUnreadCount(principal.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }
}
