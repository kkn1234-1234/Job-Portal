package com.jobconnect.repository;

import com.jobconnect.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);
    long countByApplicantIdAndReadFalse(Long applicantId);
}
