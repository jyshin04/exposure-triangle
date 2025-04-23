document.addEventListener("DOMContentLoaded", () => {
    const sortableContainer = document.getElementById("sortable-list");
    let dragging;

    sortableContainer.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("sortable-item")) {
            dragging = e.target;
            e.dataTransfer.effectAllowed = "move";
        }
    });

    sortableContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(sortableContainer, e.clientY);
        if (afterElement == null) {
            sortableContainer.appendChild(dragging);
        } else {
            sortableContainer.insertBefore(dragging, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const items = [...container.querySelectorAll(".sortable-item:not(.dragging)")];
        return items.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    document.querySelectorAll(".sortable-item").forEach(item => {
        item.setAttribute("draggable", "true");
        item.addEventListener("dragstart", () => item.classList.add("dragging"));
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
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
        message.textContent = "You've successfully sorted the ISOs from highest to lowest.";
        nextBtn.style.display = "inline-block";
    } else {
        title.textContent = "Try Again";
        message.textContent = "The order isn't quite right. ";
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







