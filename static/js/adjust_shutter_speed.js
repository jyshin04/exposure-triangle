document.addEventListener("DOMContentLoaded", () => {
    const upArrow = document.getElementById("up-arrow");
    const downArrow = document.getElementById("down-arrow");
    const feedbackContainer = document.getElementById("feedback-container");

    // When the up arrow (correct answer) is clicked
    upArrow.addEventListener("click", () => {
        feedbackContainer.style.display = "block"; // Show feedback message
    });

    // Optionally, you can add behavior for the down arrow (incorrect answer)
    downArrow.addEventListener("click", () => {
        alert("Try Again! Remember, you need to increase the shutter speed.");
    });
});
