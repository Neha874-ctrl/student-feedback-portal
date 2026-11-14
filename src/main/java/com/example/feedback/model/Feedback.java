package com.example.feedback.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String studentName;

    @NotBlank(message = "Student email is required")
    @Email(message = "Please provide a valid email address")
    @Column(nullable = false, length = 100)
    private String studentEmail;

    @NotBlank(message = "Subject or course name is required")
    @Column(nullable = false, length = 100)
    private String subject;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    @Column(nullable = false)
    private Integer rating;

    @NotBlank(message = "Feedback comments are required")
    @Size(max = 1000, message = "Comments cannot exceed 1000 characters")
    @Column(nullable = false, length = 1000)
    private String comments;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Feedback() {
    }

    public Feedback(String studentName, String studentEmail, String subject, Integer rating, String comments) {
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.subject = subject;
        this.rating = rating;
        this.comments = comments;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
