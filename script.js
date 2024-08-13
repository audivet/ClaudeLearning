// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const dayButtons = document.querySelectorAll('.day-btn');
    const resourceButtons = document.querySelectorAll('.resource-btn');
    const taskOptionButtons = document.querySelectorAll('.task-option-btn');
    const modal = document.getElementById('embed-modal');
    const embedIframe = document.getElementById('embed-iframe');
    const closeModal = document.querySelector('.close-modal');

    // Task Interactivity: Toggle task details visibility
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            const details = this.nextElementSibling;
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Resource Button Click Handler
    resourceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.dataset.url;
            // Attempt to embed the resource
            openResource(url);
        });
    });

    // Task Option Button Click Handler
    taskOptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentTask = this.closest('.task-details');
            const resourceList = parentTask.querySelectorAll('.resource-btn');
            resourceList.forEach(resBtn => {
                if (!resBtn.dataset.accessed) {
                    resBtn.click();  // Automatically click to open resource
                }
            });
        });
    });

    // Open the resource, try to embed or redirect if necessary
    function openResource(url) {
        // Simple check for embeddable content
        if (url.includes('youtube') || url.includes('google') || url.includes('docs.python.org')) {
            embedIframe.src = url;
            modal.style.display = 'block';
        } else {
            window.open(url, '_blank');
        }
    }

    // Mark resource as accessed after opening
    embedIframe.addEventListener('load', function() {
        const activeButton = document.querySelector(`[data-url="${embedIframe.src}"]`);
        if (activeButton) {
            activeButton.dataset.accessed = true;
        }
        checkTaskCompletion();
    });

    // Close modal event
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        embedIframe.src = ''; // Clear the iframe to stop the video or other resource
    });

    // Check if task can be marked as completed
    function checkTaskCompletion() {
        document.querySelectorAll('.task-details').forEach(task => {
            const resources = task.querySelectorAll('.resource-btn');
            const completeCheckbox = task.querySelector('.task-complete');
            let allAccessed = true;

            resources.forEach(res => {
                if (!res.dataset.accessed) {
                    allAccessed = false;
                }
            });

            completeCheckbox.disabled = !allAccessed;
        });
    }

    // Initial check in case of previously completed tasks
    checkTaskCompletion();

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
