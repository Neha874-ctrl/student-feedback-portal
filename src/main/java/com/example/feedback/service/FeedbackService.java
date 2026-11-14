package com.example.feedback.service;

import com.example.feedback.model.Feedback;

import java.util.List;
import java.util.Optional;

public interface FeedbackService {
    List<Feedback> getAllFeedback();
    Optional<Feedback> getFeedbackById(Long id);
    Feedback saveFeedback(Feedback feedback);
    boolean deleteFeedback(Long id);
}
