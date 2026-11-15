package com.example.feedback;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
class FeedbackApplicationTests {

    @Test
    @DisplayName("Application context should load successfully")
    void contextLoads() {
        // Verifies that the Spring Boot Application Context loads successfully
    }

    @Test
    @DisplayName("Main method should execute without throwing exceptions")
    void mainMethodStartsSuccessfully() {
        assertDoesNotThrow(() -> FeedbackApplication.main(new String[]{
                "--spring.main.web-application-type=none",
                "--spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1"
        }));
    }
}
