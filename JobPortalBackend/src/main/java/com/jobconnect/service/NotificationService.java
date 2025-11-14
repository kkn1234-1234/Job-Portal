package com.jobconnect.service;

import com.jobconnect.dto.NotificationResponse;
import com.jobconnect.entity.ApplicantAccount;
import com.jobconnect.entity.EmployerAccount;
import com.jobconnect.entity.Notification;
import com.jobconnect.repository.ApplicantAccountRepository;
import com.jobconnect.repository.EmployerAccountRepository;
import com.jobconnect.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ApplicantAccountRepository applicantRepository;
    private final EmployerAccountRepository employerRepository;

    public Notification createNotification(Long applicantId, Long employerId, String title, String message, String type) {
        ApplicantAccount applicant = applicantRepository.findById(applicantId)
            .orElseThrow(() -> new RuntimeException("Applicant account not found"));
        Notification notification = new Notification();
        notification.setApplicant(applicant);
        if (employerId != null) {
            EmployerAccount employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer account not found"));
            notification.setEmployer(employer);
        }
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(Long applicantId) {
        return notificationRepository.findByApplicantIdOrderByCreatedAtDesc(applicantId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId, Long applicantId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (notification.getApplicant() == null || !notification.getApplicant().getId().equals(applicantId)) {
            throw new RuntimeException("You are not authorized to update this notification");
        }

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    public void markAllAsRead(Long applicantId) {
        List<Notification> notifications = notificationRepository.findByApplicantIdOrderByCreatedAtDesc(applicantId);
        notifications.forEach(notification -> {
            if (!notification.isRead()) {
                notification.setRead(true);
            }
        });
        notificationRepository.saveAll(notifications);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long applicantId) {
        return notificationRepository.countByApplicantIdAndReadFalse(applicantId);
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getType(),
            notification.isRead(),
            notification.getCreatedAt()
        );
    }
}
