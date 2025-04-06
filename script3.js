function addTasktop(){
    let sometext=document.getElementById('userinput').value;
    document.getElementById('displaytask').innerHTML=sometext;
}

document.addEventListener('DOMContentLoaded', function() {
    const addTaskButtons = document.querySelectorAll('.add-task-btn');
    
    addTaskButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.section');
            showTaskInput(section);
        });
    });
    
    function showTaskInput(section) {
        let inputContainer = section.querySelector('.task-input-container');
        
        if (!inputContainer) {
            inputContainer = createTaskInputContainer(section);
        }
        
        const input = inputContainer.querySelector('input');
        input.value = '';
        input.style.borderColor = '';
        input.placeholder = 'Enter task description...';
        input.classList.remove('error-shake');
        
        inputContainer.style.display = inputContainer.style.display === 'none' ? 'block' : 'none';
        
        if (inputContainer.style.display === 'block') {
            input.focus();
        }
    }

    
    
    function createTaskInputContainer(section) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'task-input-container';
        inputContainer.style.display = 'none';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-input';
        input.placeholder = 'Enter task description...';
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-input-buttons';
        
        const saveButton = document.createElement('button');
        saveButton.className = 'save-task';
        saveButton.textContent = 'Save';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-task';
        cancelButton.textContent = 'Cancel';
        
        saveButton.addEventListener('click', function() {
            handleTaskSave(input, section);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleTaskSave(input, section);
            }
        });
        
        cancelButton.addEventListener('click', function() {
            inputContainer.style.display = 'none';
        });
        
        buttonsDiv.appendChild(saveButton);
        buttonsDiv.appendChild(cancelButton);
        inputContainer.appendChild(input);
        inputContainer.appendChild(buttonsDiv);
        
        const header = section.querySelector('.section-header');
        header.insertAdjacentElement('afterend', inputContainer);
        
        return inputContainer;
    }
    
    function handleTaskSave(input, section) {
        const taskText = input.value.trim();
        if (!taskText) {
            showInputError(input);
            return;
        }
        
        addTaskToSection(section.querySelector('.section-content'), taskText);
        input.value = '';
        input.closest('.task-input-container').style.display = 'none';
    }
    
    function showInputError(input) {
        input.style.borderColor = '#ff4444';
        input.placeholder = 'Please enter a task first!';
        input.classList.add('error-shake');
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = 'Enter task description...';
            input.classList.remove('error-shake');
        }, 2000);
    }
    
    function addTaskToSection(sectionContent, taskText) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        const checkContainer = document.createElement('span');
        checkContainer.className = 'check-task';
        checkContainer.innerHTML = '✓';
        checkContainer.addEventListener('click', function() {
            this.classList.toggle('completed');
            taskTextSpan.classList.toggle('completed');
        });
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = taskText;
        
        const deleteSpan = document.createElement('span');
        deleteSpan.className = 'delete-task';
        deleteSpan.textContent = '✕';
        deleteSpan.addEventListener('click', function(e) {
            e.stopPropagation();
            taskItem.remove();
        });
        
        taskItem.appendChild(checkContainer);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(deleteSpan);
        sectionContent.appendChild(taskItem);
    }
});