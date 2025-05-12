function checkMatch() {
    const userISO = isoValues[isoSlider.value];
    const userShutter = shutterValues[shutterSlider.value];
    const userAperture = apertureValues[apertureSlider.value];

    const isCorrect = (userISO === goalISO && userShutter === goalShutter && userAperture === goalAperture);

    if (isCorrect) {
        feedbackDiv.innerHTML = `<div class="alert alert-success">Perfect match! 🎉</div>`;
    } else {
        feedbackDiv.innerHTML = `<div class="alert alert-warning">Not quite right! Let's move on.</div>`;
    }

    // Disable the check button and show the finish button
    checkButton.disabled = true;
    checkButton.classList.remove("btn-success");
    checkButton.classList.add("btn-secondary");
    nextBtn.style.display = "block";

    // ✅ Send result to Flask
    fetch("/save_triple_slider_result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            correct: isCorrect,
            iso: userISO,
            shutter: userShutter,
            aperture: userAperture
            // optionally include an ID if available, e.g., challenge_id: "123"
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
