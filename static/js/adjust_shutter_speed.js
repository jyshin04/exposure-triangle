document.addEventListener('DOMContentLoaded', function () {
    const adjustButtons = document.querySelectorAll('.adjust-btn');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const nextBtn = document.getElementById('next-btn');

    const quizContainer = document.querySelector('.quiz-container');
    const questionId = quizContainer.dataset.questionId;
    const correctAction = quizContainer.dataset.correctAction;
    const correctFeedback = quizContainer.dataset.feedbackCorrect;
    const incorrectFeedback = quizContainer.dataset.feedbackIncorrect;

    function save_answer(isCorrect) {
        fetch('/save_quiz_result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question_id: questionId,
                correct: isCorrect,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Result saved:', data);
            })
            .catch((error) => {
                console.error('Error saving result:', error);
            });
    }

    adjustButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const userAction = this.dataset.action;
            const isCorrect = userAction === correctAction;

            save_answer(isCorrect);

            feedbackContainer.style.display = 'block';

            if (isCorrect) {
                feedbackContainer.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                feedbackContainer.style.borderColor = '#28a745';
                feedbackTitle.textContent = 'Correct!';
                feedbackMessage.textContent = 'High ISO increases brightness but adds grain.';
            } else {
                feedbackContainer.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                feedbackContainer.style.borderColor = '#dc3545';
                feedbackTitle.textContent = 'Incorrect';
                feedbackMessage.textContent = 'Some matches are incorrect.';
            }
            feedbackContainer.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
            feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
            feedbackMessage.textContent = isCorrect ? correctFeedback : incorrectFeedback;

            
            nextBtn.style.display = 'inline-block';
            
        });
    });
});
