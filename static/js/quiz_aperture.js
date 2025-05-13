document.addEventListener('DOMContentLoaded', function() {
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const nextBtn = document.getElementById('next-btn');
    let feedbackShown = false;
    const originalContainers = {};


    draggables.forEach(draggable => {
        originalContainers[draggable.id] = draggable.parentElement;
        draggable.addEventListener('dragstart', dragStart);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
        zone.addEventListener('dragenter', dragEnter);
        zone.addEventListener('dragleave', dragLeave);
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function drop(e) {
        e.preventDefault();
    
        // Always get the closest drop-zone in case the target is a child (like the placeholder span)
        const dropZone = e.target.closest('.drop-zone');
        if (!dropZone) return;
    
        dropZone.classList.remove('drag-over');
    
        const draggableId = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(draggableId);
        const value = draggable.dataset.value;
    
        // Clear previous content
        dropZone.innerHTML = '';
    
        // Create a clone without drag functionality
        // Move the original draggable element into the drop zone
        draggable.removeAttribute('draggable');
        draggable.classList.remove('dragging');
        draggable.style.cursor = 'default';
        draggable.style.transform = 'none';

        dropZone.appendChild(draggable);
        dropZone.dataset.selected = value;
    
        checkCompletion();
    }
    function checkCompletion() {
        const filledZones = Array.from(dropZones).filter(zone => zone.dataset.selected);
    
        if (filledZones.length === dropZones.length) {




            const allCorrect = filledZones.every(zone =>
                zone.dataset.selected === zone.dataset.correct
            );
    
            const questionId = document.querySelector('.quiz-container').dataset.questionId;
    
            // Send result to Flask
            if (!feedbackShown) {
                fetch('/save_quiz_result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        question_id: questionId,
                        correct: allCorrect
                    })
                });
                feedbackShown = true;
            }
            
    
            if (allCorrect) {
                showFeedback(true);
                dropZones.forEach(zone => zone.classList.add('correct'));
            } else {
                showFeedback(false);
                dropZones.forEach(zone => {
                    const selected = zone.dataset.selected;
                    const correct = zone.dataset.correct;
                    const draggable = zone.querySelector('.draggable');
                
                    if (selected !== correct && draggable) {
                        zone.classList.add('incorrect');
                
                        // Restore the draggable to its original container
                        draggable.setAttribute('draggable', 'true');
                        draggable.style.cursor = 'grab';
                
                        originalContainers[draggable.id].appendChild(draggable);
                        zone.innerHTML = '<span class="placeholder">Drop f-number here</span>';
                        delete zone.dataset.selected;
                    } else if (selected === correct) {
                        zone.classList.add('correct');
                    }
                });
                
            }
    
            nextBtn.style.display = 'inline-block';
        }
    }
    

    function showFeedback(isCorrect) {
        feedbackContainer.style.display = 'block';

        if (isCorrect) {
            feedbackContainer.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
            feedbackContainer.style.borderColor = '#28a745';
            feedbackTitle.textContent = 'Correct!';
            feedbackMessage.textContent = 'f/2.0 gives you a blurry background (wide aperture), and f/16 keeps everything sharp.';
        } else {
            feedbackContainer.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            feedbackContainer.style.borderColor = '#dc3545';
            feedbackTitle.textContent = 'Incorrect';
            feedbackMessage.textContent = 'Remember, low f-numbers have blurry backgrounds and high f-numbers have sharp backgrounds.';
        }
    }

    
});
