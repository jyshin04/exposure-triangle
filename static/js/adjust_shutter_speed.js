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

    let resultSaved = false; // ✅ Track whether the result has been saved

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

            if (!resultSaved) {
                save_answer(isCorrect);
                resultSaved = true;
            }

            feedbackContainer.style.display = 'block';
            feedbackContainer.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
            feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
            feedbackMessage.textContent = isCorrect ? correctFeedback : incorrectFeedback;

            nextBtn.style.display = 'inline-block';
        });
    });
});
