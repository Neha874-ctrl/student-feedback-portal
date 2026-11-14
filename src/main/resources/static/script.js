/**
 * Student Feedback Portal - Frontend Application Logic
 * Communicates with Spring Boot REST API (/api/feedback and /health)
 */

document.addEventListener('DOMContentLoaded', () => {
    // API Endpoints
    const API_BASE = '/api/feedback';
    const HEALTH_API = '/health';

    // State
    let allFeedbacks = [];
    let currentFilterRating = 'all';
    let searchQuery = '';
    let pendingDeleteId = null;

    // DOM Elements
    const feedbackForm = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitSpinner = document.getElementById('submitSpinner');
    const submitAlertPlaceholder = document.getElementById('submitAlertPlaceholder');
    const feedbackList = document.getElementById('feedbackList');
    const feedbackLoading = document.getElementById('feedbackLoading');
    const emptyState = document.getElementById('emptyState');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsCount = document.getElementById('resultsCount');
    const filterOptions = document.querySelectorAll('.filter-option');
    const filterLabel = document.getElementById('filterLabel');
    const systemHealthBadge = document.getElementById('system-health');

    // Stats Elements
    const statTotalReviews = document.getElementById('stat-total-reviews');
    const statAvgRating = document.getElementById('stat-avg-rating');

    // Star Rating Elements
    const starWidget = document.getElementById('starWidget');
    const starIcons = starWidget.querySelectorAll('.star-icon');
    const ratingInput = document.getElementById('rating');
    const ratingText = document.getElementById('ratingText');
    const ratingError = document.getElementById('ratingError');

    // Character counter
    const commentsInput = document.getElementById('comments');
    const charCounter = document.getElementById('charCounter');

    // Delete Modal
    const deleteModalEl = document.getElementById('deleteConfirmModal');
    const deleteModal = new bootstrap.Modal(deleteModalEl);
    const deleteModalTargetName = document.getElementById('deleteModalTargetName');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteSpinner = document.getElementById('deleteSpinner');

    const ratingDescriptions = {
        1: '1 - Poor (Needs major improvement)',
        2: '2 - Fair (Below expectations)',
        3: '3 - Good (Met expectations)',
        4: '4 - Very Good (Exceeded expectations)',
        5: '5 - Excellent (Outstanding course experience)'
    };

    // ================= 1. Health Check =================
    async function checkSystemHealth() {
        try {
            const res = await fetch(HEALTH_API);
            if (res.ok) {
                const data = await res.json();
                systemHealthBadge.className = 'badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill health-badge';
                systemHealthBadge.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> System Online (Port ' + (window.location.port || '80') + ')';
            } else {
                setHealthDegraded();
            }
        } catch (err) {
            setHealthDegraded();
        }
    }

    function setHealthDegraded() {
        systemHealthBadge.className = 'badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill health-badge';
        systemHealthBadge.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Backend Connecting...';
    }

    // ================= 2. Star Rating Widget =================
    function initStarRating() {
        starIcons.forEach(star => {
            // Hover in
            star.addEventListener('mouseenter', () => {
                const hoverVal = parseInt(star.getAttribute('data-value'));
                highlightStars(hoverVal, true);
            });

            // Hover out
            star.addEventListener('mouseleave', () => {
                const currentVal = parseInt(ratingInput.value) || 0;
                highlightStars(currentVal, false);
            });

            // Click to select
            star.addEventListener('click', () => {
                const selectedVal = parseInt(star.getAttribute('data-value'));
                ratingInput.value = selectedVal;
                ratingError.classList.add('d-none');
                ratingText.textContent = ratingDescriptions[selectedVal] || `${selectedVal} Stars`;
                ratingText.classList.remove('text-muted');
                ratingText.classList.add('text-primary', 'fw-semibold');
                highlightStars(selectedVal, false);
            });
        });
    }

    function highlightStars(count, isHover) {
        starIcons.forEach(star => {
            const val = parseInt(star.getAttribute('data-value'));
            if (val <= count) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill');
                if (isHover) {
                    star.classList.add('hovered');
                } else {
                    star.classList.add('filled');
                }
            } else {
                star.classList.remove('bi-star-fill', 'hovered', 'filled');
                star.classList.add('bi-star');
            }
        });
    }

    function resetStarRating() {
        ratingInput.value = '';
        ratingText.textContent = 'Select a rating';
        ratingText.className = 'rating-label text-muted small ms-2';
        highlightStars(0, false);
        ratingError.classList.add('d-none');
    }

    // ================= 3. Character Counter =================
    if (commentsInput && charCounter) {
        commentsInput.addEventListener('input', () => {
            const len = commentsInput.value.length;
            charCounter.textContent = `${len} / 1000`;
            if (len >= 950) {
                charCounter.classList.add('text-danger');
            } else {
                charCounter.classList.remove('text-danger');
            }
        });
    }

    // ================= 4. Fetch Feedback (GET) =================
    async function loadFeedback() {
        showLoading(true);
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) {
                throw new Error(`Failed to load feedback: HTTP ${response.status}`);
            }
            allFeedbacks = await response.json();
            updateStats(allFeedbacks);
            renderFilteredFeedback();
        } catch (error) {
            console.error('Error loading feedback:', error);
            showErrorAlert(`Could not retrieve feedback from backend: ${error.message}`);
            emptyState.classList.remove('d-none');
            feedbackList.innerHTML = '';
        } finally {
            showLoading(false);
        }
    }

    function showLoading(isLoading) {
        if (isLoading) {
            feedbackLoading.classList.remove('d-none');
            feedbackList.classList.add('d-none');
            emptyState.classList.add('d-none');
        } else {
            feedbackLoading.classList.add('d-none');
            feedbackList.classList.remove('d-none');
        }
    }

    // ================= 5. Render Feedback List =================
    function renderFilteredFeedback() {
        // Filter by search query
        let filtered = allFeedbacks.filter(item => {
            const query = searchQuery.toLowerCase().trim();
            if (!query) return true;
            return (
                (item.studentName && item.studentName.toLowerCase().includes(query)) ||
                (item.studentEmail && item.studentEmail.toLowerCase().includes(query)) ||
                (item.subject && item.subject.toLowerCase().includes(query)) ||
                (item.comments && item.comments.toLowerCase().includes(query))
            );
        });

        // Filter by rating
        if (currentFilterRating !== 'all') {
            const r = parseInt(currentFilterRating);
            filtered = filtered.filter(item => item.rating === r);
        }

        resultsCount.textContent = `Showing ${filtered.length} of ${allFeedbacks.length} reviews`;

        if (filtered.length === 0) {
            feedbackList.innerHTML = '';
            emptyState.classList.remove('d-none');
            return;
        }

        emptyState.classList.add('d-none');

        feedbackList.innerHTML = filtered.map(item => {
            const initials = getInitials(item.studentName);
            const formattedDate = formatDate(item.createdAt);
            const starsHtml = renderStarsHtml(item.rating);

            return `
                <div class="col-md-6 col-lg-4" id="feedback-card-${item.id}">
                    <div class="feedback-card shadow-sm">
                        <div class="feedback-header">
                            <div class="d-flex align-items-center gap-3">
                                <div class="avatar-circle">${escapeHtml(initials)}</div>
                                <div class="student-meta">
                                    <div class="student-name" title="${escapeHtml(item.studentName)}">${escapeHtml(item.studentName)}</div>
                                    <div class="student-email" title="${escapeHtml(item.studentEmail)}">${escapeHtml(item.studentEmail)}</div>
                                </div>
                            </div>
                        </div>

                        <div class="px-3 pb-2">
                            <span class="course-badge">
                                <i class="bi bi-book-half me-1"></i>${escapeHtml(item.subject)}
                            </span>
                        </div>

                        <div class="feedback-rating">
                            <div class="stars">${starsHtml}</div>
                            <span class="rating-number">${item.rating}.0 / 5</span>
                        </div>

                        <div class="feedback-body">
                            <p class="feedback-comment">${escapeHtml(item.comments)}</p>
                        </div>

                        <div class="feedback-footer">
                            <div class="feedback-date" title="Submitted on ${formattedDate}">
                                <i class="bi bi-clock me-1"></i>${formattedDate}
                            </div>
                            <button class="btn-delete-card" onclick="window.requestDeleteFeedback(${item.id}, '${escapeHtml(item.studentName).replace(/'/g, "\\'")}')" title="Delete Feedback">
                                <i class="bi bi-trash3"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderStarsHtml(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill text-warning me-1"></i>';
            } else {
                stars += '<i class="bi bi-star text-muted me-1"></i>';
            }
        }
        return stars;
    }

    function getInitials(name) {
        if (!name) return 'S';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'Recently';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ================= 6. Summary Stats =================
    function updateStats(feedbacks) {
        const count = feedbacks.length;
        statTotalReviews.textContent = count;

        if (count === 0) {
            statAvgRating.textContent = '0.0 ★';
        } else {
            const sum = feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0);
            const avg = (sum / count).toFixed(1);
            statAvgRating.textContent = `${avg} ★`;
        }
    }

    // ================= 7. Submit Feedback (POST) =================
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic HTML5 validation
        let isValid = true;
        const studentName = document.getElementById('studentName').value.trim();
        const studentEmail = document.getElementById('studentEmail').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const rating = parseInt(ratingInput.value);
        const comments = commentsInput.value.trim();

        // Reset error messages
        document.getElementById('studentName').classList.remove('is-invalid');
        document.getElementById('studentEmail').classList.remove('is-invalid');
        document.getElementById('subject').classList.remove('is-invalid');
        commentsInput.classList.remove('is-invalid');
        ratingError.classList.add('d-none');

        // Validation Checks
        if (!studentName || studentName.length < 2) {
            document.getElementById('studentName').classList.add('is-invalid');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!studentEmail || !emailRegex.test(studentEmail)) {
            document.getElementById('studentEmail').classList.add('is-invalid');
            isValid = false;
        }

        if (!subject) {
            document.getElementById('subject').classList.add('is-invalid');
            isValid = false;
        }

        if (!rating || rating < 1 || rating > 5) {
            ratingError.classList.remove('d-none');
            isValid = false;
        }

        if (!comments) {
            commentsInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) return;

        // Prepare Request
        const payload = {
            studentName,
            studentEmail,
            subject,
            rating,
            comments
        };

        setSubmitting(true);

        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                let errorMsg = 'Failed to submit feedback. Please check your inputs.';
                if (typeof errData === 'object' && Object.keys(errData).length > 0) {
                    errorMsg = Object.values(errData).join(', ');
                }
                throw new Error(errorMsg);
            }

            const createdFeedback = await response.json();

            // Show Success Notification
            showSubmitSuccessAlert(createdFeedback);

            // Reset form
            feedbackForm.reset();
            resetStarRating();
            if (charCounter) charCounter.textContent = '0 / 1000';

            // Refresh feedback list
            await loadFeedback();

        } catch (error) {
            console.error('Submission error:', error);
            showSubmitErrorAlert(error.message);
        } finally {
            setSubmitting(false);
        }
    });

    function setSubmitting(isSubmitting) {
        if (isSubmitting) {
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').classList.add('d-none');
            submitSpinner.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').classList.remove('d-none');
            submitSpinner.classList.add('d-none');
        }
    }

    function showSubmitSuccessAlert(feedback) {
        submitAlertPlaceholder.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show shadow-sm rounded-3 mb-4" role="alert">
                <div class="d-flex align-items-center">
                    <i class="bi bi-check-circle-fill fs-4 text-success me-3"></i>
                    <div>
                        <h6 class="alert-heading fw-bold mb-1">Feedback Submitted Successfully!</h6>
                        <p class="mb-0 small">
                            Thank you, <strong>${escapeHtml(feedback.studentName)}</strong>! Your feedback for 
                            <strong>${escapeHtml(feedback.subject)}</strong> has been recorded in the H2 database.
                        </p>
                    </div>
                </div>
                <div class="mt-2 pt-2 border-top border-success-subtle d-flex gap-2">
                    <a href="#feedback" class="btn btn-sm btn-success rounded-pill px-3">
                        <i class="bi bi-eye-fill me-1"></i> View on Dashboard
                    </a>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        submitAlertPlaceholder.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showSubmitErrorAlert(msg) {
        submitAlertPlaceholder.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show shadow-sm rounded-3 mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                <strong>Submission Error:</strong> ${escapeHtml(msg)}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    function showErrorAlert(msg) {
        const container = document.getElementById('global-alert-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show shadow-sm rounded-3" role="alert">
                    <i class="bi bi-wifi-off me-2"></i> ${escapeHtml(msg)}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }
    }

    // ================= 8. Delete Feedback (DELETE) =================
    window.requestDeleteFeedback = function(id, studentName) {
        pendingDeleteId = id;
        deleteModalTargetName.textContent = `Feedback submission by "${studentName}" (ID: ${id}) will be permanently removed.`;
        deleteModal.show();
    };

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!pendingDeleteId) return;

        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.querySelector('.btn-text').classList.add('d-none');
        deleteSpinner.classList.remove('d-none');

        try {
            const response = await fetch(`${API_BASE}/${pendingDeleteId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete feedback with ID ${pendingDeleteId}`);
            }

            deleteModal.hide();
            await loadFeedback();
        } catch (error) {
            console.error('Delete error:', error);
            alert(`Error deleting feedback: ${error.message}`);
        } finally {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.querySelector('.btn-text').classList.remove('d-none');
            deleteSpinner.classList.add('d-none');
            pendingDeleteId = null;
        }
    });

    // ================= 9. Filters and Search =================
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderFilteredFeedback();
    });

    filterOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            filterOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentFilterRating = opt.getAttribute('data-rating');
            filterLabel.textContent = opt.textContent;
            renderFilteredFeedback();
        });
    });

    refreshBtn.addEventListener('click', () => {
        loadFeedback();
        checkSystemHealth();
    });

    // ================= 10. Navigation Active State =================
    const navLinks = document.querySelectorAll('.custom-navbar .nav-link');
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash || '#home';
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });

    // ================= Initialize =================
    initStarRating();
    checkSystemHealth();
    loadFeedback();
});
