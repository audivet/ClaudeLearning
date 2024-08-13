// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {

    // Task Interactivity: Toggle task details visibility
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            const details = this.nextElementSibling;
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Gamification: Points system (simplified example)
    let points = localStorage.getItem('points') || 0;
    const pointDisplay = document.createElement('div');
    pointDisplay.id = 'points';
    pointDisplay.innerText = `Points: ${points}`;
    document.body.insertBefore(pointDisplay, document.querySelector('main'));

    const taskButtons = document.querySelectorAll('.task-options button');
    taskButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskPoints = parseInt(this.dataset.points || '10');
            points = parseInt(points) + taskPoints;
            localStorage.setItem('points', points);
            pointDisplay.innerText = `Points: ${points}`;
            alert(`You earned ${taskPoints} points!`);
        });
    });

    // Notepad Functionality
    const notepad = document.querySelector('#notepad iframe');
    if (notepad) {
        notepad.addEventListener('load', function() {
            const notepadDoc = notepad.contentDocument || notepad.contentWindow.document;
            const textarea = notepadDoc.querySelector('textarea');
            textarea.value = localStorage.getItem('notes') || '';

            textarea.addEventListener('input', () => {
                localStorage.setItem('notes', textarea.value);
            });
        });
    }

    // Console Functionality
    const consoleFrame = document.querySelector('#console iframe');
    if (consoleFrame) {
        consoleFrame.addEventListener('load', function() {
            const consoleDoc = consoleFrame.contentDocument || consoleFrame.contentWindow.document;
            const editor = consoleDoc.querySelector('.CodeMirror');
            if (editor) {
                const cmInstance = consoleDoc.querySelector('.CodeMirror').CodeMirror;
                const savedCode = localStorage.getItem('code');
                if (savedCode) {
                    cmInstance.setValue(savedCode);
                }

                cmInstance.on('change', function() {
                    localStorage.setItem('code', cmInstance.getValue());
                });
            }
        });
    }
});
