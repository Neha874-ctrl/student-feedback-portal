package com.example.feedback;

import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        feedbackRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/feedback - should create new feedback with valid data")
    void shouldCreateFeedbackSuccessfully() throws Exception {
        Feedback feedback = new Feedback(
                "Jane Doe",
                "jane.doe@example.com",
                "Computer Networks",
                5,
                "Excellent course with great practical assignments!"
        );

        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(feedback)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.studentName").value("Jane Doe"))
                .andExpect(jsonPath("$.studentEmail").value("jane.doe@example.com"))
                .andExpect(jsonPath("$.subject").value("Computer Networks"))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comments").value("Excellent course with great practical assignments!"))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/feedback - should return 400 Bad Request when validation fails")
    void shouldReturnBadRequestWhenValidationFails() throws Exception {
        Feedback invalidFeedback = new Feedback(
                "", // Blank name
                "invalid-email", // Bad email
                "", // Blank subject
                6, // Rating out of range (1-5)
                "" // Blank comments
        );

        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidFeedback)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.studentName").isNotEmpty())
                .andExpect(jsonPath("$.studentEmail").isNotEmpty())
                .andExpect(jsonPath("$.subject").isNotEmpty())
                .andExpect(jsonPath("$.rating").isNotEmpty())
                .andExpect(jsonPath("$.comments").isNotEmpty());
    }

    @Test
    @DisplayName("GET /api/feedback - should retrieve all submitted feedback")
    void shouldRetrieveAllFeedback() throws Exception {
        Feedback f1 = new Feedback("Alice Smith", "alice@example.com", "DevOps", 4, "Insightful pipeline demos.");
        Feedback f2 = new Feedback("Bob Brown", "bob@example.com", "Databases", 5, "Clear query optimization concepts.");
        feedbackRepository.save(f1);
        feedbackRepository.save(f2);

        mockMvc.perform(get("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].studentName", anyOf(is("Alice Smith"), is("Bob Brown"))));
    }

    @Test
    @DisplayName("GET /api/feedback/{id} - should retrieve feedback by ID")
    void shouldRetrieveFeedbackById() throws Exception {
        Feedback saved = feedbackRepository.save(
                new Feedback("Charlie", "charlie@example.com", "Algorithms", 4, "Challenging problems.")
        );

        mockMvc.perform(get("/api/feedback/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.studentName").value("Charlie"))
                .andExpect(jsonPath("$.subject").value("Algorithms"));
    }

    @Test
    @DisplayName("GET /api/feedback/{id} - should return 404 when ID does not exist")
    void shouldReturn404WhenNotFound() throws Exception {
        mockMvc.perform(get("/api/feedback/999999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/feedback/{id} - should delete feedback and return 200")
    void shouldDeleteFeedbackSuccessfully() throws Exception {
        Feedback saved = feedbackRepository.save(
                new Feedback("David", "david@example.com", "Web Tech", 3, "Good introduction to CSS.")
        );

        mockMvc.perform(delete("/api/feedback/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/feedback/" + saved.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/feedback/{id} - should return 404 when deleting non-existent ID")
    void shouldReturn404WhenDeletingNonExistent() throws Exception {
        mockMvc.perform(delete("/api/feedback/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
