package com.example.feedback.service;

import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    private Feedback sampleFeedback;

    @BeforeEach
    void setUp() {
        sampleFeedback = new Feedback(
                "Jane Doe",
                "jane.doe@university.edu",
                "Cloud Computing & DevOps",
                5,
                "Outstanding hands-on laboratory exercises and pipeline demos."
        );
        sampleFeedback.setId(1L);
    }

    @Test
    @DisplayName("getAllFeedback should return sorted feedback list from repository")
    void testGetAllFeedback() {
        Feedback secondFeedback = new Feedback(
                "John Smith",
                "john.smith@university.edu",
                "Data Structures",
                4,
                "Very helpful explanations on dynamic programming."
        );
        secondFeedback.setId(2L);

        when(feedbackRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(Arrays.asList(sampleFeedback, secondFeedback));

        List<Feedback> result = feedbackService.getAllFeedback();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getStudentName()).isEqualTo("Jane Doe");
        assertThat(result.get(1).getStudentName()).isEqualTo("John Smith");
        verify(feedbackRepository, times(1)).findAllByOrderByCreatedAtDesc();
    }

    @Test
    @DisplayName("getFeedbackById should return feedback when ID exists")
    void testGetFeedbackById_Found() {
        when(feedbackRepository.findById(1L)).thenReturn(Optional.of(sampleFeedback));

        Optional<Feedback> result = feedbackService.getFeedbackById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getSubject()).isEqualTo("Cloud Computing & DevOps");
        verify(feedbackRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getFeedbackById should return empty Optional when ID does not exist")
    void testGetFeedbackById_NotFound() {
        when(feedbackRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Feedback> result = feedbackService.getFeedbackById(999L);

        assertThat(result).isNotPresent();
        verify(feedbackRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("saveFeedback should persist and return the feedback entity")
    void testSaveFeedback() {
        when(feedbackRepository.save(any(Feedback.class))).thenReturn(sampleFeedback);

        Feedback saved = feedbackService.saveFeedback(sampleFeedback);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isEqualTo(1L);
        assertThat(saved.getStudentEmail()).isEqualTo("jane.doe@university.edu");
        verify(feedbackRepository, times(1)).save(sampleFeedback);
    }

    @Test
    @DisplayName("deleteFeedback should return true when feedback exists and is deleted")
    void testDeleteFeedback_Success() {
        when(feedbackRepository.existsById(1L)).thenReturn(true);
        doNothing().when(feedbackRepository).deleteById(1L);

        boolean deleted = feedbackService.deleteFeedback(1L);

        assertThat(deleted).isTrue();
        verify(feedbackRepository, times(1)).existsById(1L);
        verify(feedbackRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("deleteFeedback should return false and not delete when feedback does not exist")
    void testDeleteFeedback_NotFound() {
        when(feedbackRepository.existsById(999L)).thenReturn(false);

        boolean deleted = feedbackService.deleteFeedback(999L);

        assertThat(deleted).isFalse();
        verify(feedbackRepository, times(1)).existsById(999L);
        verify(feedbackRepository, never()).deleteById(anyLong());
    }
}
