package com.jobconnect.security;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordHashTest {

    private static final String EXISTING_HASH = "$2a$10$Dow1tK0N6D2PfYZ7RUTpuOZ4A3TBUnIF.rLnbryuVKC7jHimoMuqu";

    @Test
    void existingHashMatches12345678() {
        var encoder = new BCryptPasswordEncoder();
        assertTrue(encoder.matches("12345678", EXISTING_HASH));
    }
}
