package com.example.feedback.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class FeedbackModelTest {

    @Test
    @DisplayName("Should test full constructor, getters, and setters")
    void testGettersAndSetters() {
        Feedback feedback = new Feedback();
        feedback.setId(10L);
        feedback.setStudentName("Alice Cooper");
        feedback.setStudentEmail("alice.cooper@example.com");
        feedback.setSubject("Software Engineering");
        feedback.setRating(5);
        feedback.setComments("Great insights into Agile workflows.");
        LocalDateTime now = LocalDateTime.now();
        feedback.setCreatedAt(now);

        assertThat(feedback.getId()).isEqualTo(10L);
        assertThat(feedback.getStudentName()).isEqualTo("Alice Cooper");
        assertThat(feedback.getStudentEmail()).isEqualTo("alice.cooper@example.com");
        assertThat(feedback.getSubject()).isEqualTo("Software Engineering");
        assertThat(feedback.getRating()).isEqualTo(5);
        assertThat(feedback.getComments()).isEqualTo("Great insights into Agile workflows.");
        assertThat(feedback.getCreatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("PrePersist should assign current timestamp if createdAt is null")
    void testPrePersistWhenCreatedAtIsNull() {
        Feedback feedback = new Feedback("Bob", "bob@example.com", "DevOps", 4, "Good course");
        assertThat(feedback.getCreatedAt()).isNull();

        feedback.onCreate();

        assertThat(feedback.getCreatedAt()).isNotNull();
        assertThat(feedback.getCreatedAt()).isBeforeOrEqualTo(LocalDateTime.now());
    }

    @Test
    @DisplayName("PrePersist should preserve existing timestamp if already set")
    void testPrePersistWhenCreatedAtIsNotNull() {
        Feedback feedback = new Feedback("Bob", "bob@example.com", "DevOps", 4, "Good course");
        LocalDateTime specificTime = LocalDateTime.of(2026, 1, 15, 10, 30);
        feedback.setCreatedAt(specificTime);

        feedback.onCreate();

        assertThat(feedback.getCreatedAt()).isEqualTo(specificTime);
    }
}
