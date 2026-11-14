package com.example.feedback.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("application", "Student Feedback Portal");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("database", "H2 (In-Memory)");
        return ResponseEntity.ok(health);
    }
}
