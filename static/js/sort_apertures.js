document.addEventListener("DOMContentLoaded", () => {
    // Initialize SortableJS for better drag-and-drop
    new Sortable(document.getElementById("sortable-list"), {
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
    });
});

function checkOrder() {
    const items = document.querySelectorAll(".sortable-item");
    const values = Array.from(items).map(item => parseFloat(item.dataset.value));
    const sorted = [...values].sort((a, b) => b - a);  // descending

    const isCorrect = values.every((val, index) => val === sorted[index]);

    const feedback = document.getElementById("feedback-container");
    const title = document.getElementById("feedback-title");
    const message = document.getElementById("feedback-message");
    const nextBtn = document.getElementById("next-btn");

    feedback.style.display = "block";
    if (isCorrect) {
        title.textContent = "Correct!";
        message.textContent = "You've successfully sorted the apertures from highest to lowest.";
        feedback.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        feedback.style.borderColor = '#28a745';
        nextBtn.style.display = "inline-block";
    } else {
        title.textContent = "Incorrect.";
        message.textContent = "The order isn't quite right. Remember, higher f-numbers mean smaller apertures.";
        feedback.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        feedback.style.borderColor = '#dc3545';
        nextBtn.style.display = "inline-block";
    }


    // ✅ Send result to Flask
    const questionId = document.querySelector('.quiz-container').dataset.questionId;// assumes quiz-container holds data-question-id
    fetch("/save_quiz_result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question_id: questionId,
            correct: isCorrect
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Result saved:", data);
    })
    .catch(error => {
        console.error("Error saving result:", error);
    });
}
