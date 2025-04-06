// Initialize Supabase client - replace with your actual credentials
const supabaseUrl = 'https://gyywkzwxfuizlhbglady.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5eXdrend4ZnVpemxoYmdsYWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTc2MjgsImV4cCI6MjA1OTUzMzYyOH0.rYuRP2ExtQ93IW1kL0gS0-XasMnNFaUxoBKo_V46rU4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

function addTasktop(){
    let sometext = document.getElementById('userinput').value;
    document.getElementById('displaytask').innerHTML = sometext;
}

document.addEventListener('DOMContentLoaded', function() {
    // Load tasks from Supabase when the page loads
    loadTasksFromSupabase();
    
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
        
        // Show date input field for task due date
        const dateInput = inputContainer.querySelector('.due-date-input');
        if (dateInput) {
            dateInput.value = '';
        }
        
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
        
        // Add date input for due date
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'due-date-input';
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-input-buttons';
        
        const saveButton = document.createElement('button');
        saveButton.className = 'save-task';
        saveButton.textContent = 'Save';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-task';
        cancelButton.textContent = 'Cancel';
        
        saveButton.addEventListener('click', function() {
            handleTaskSave(input, dateInput, section);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleTaskSave(input, dateInput, section);
            }
        });
        
        cancelButton.addEventListener('click', function() {
            inputContainer.style.display = 'none';
        });
        
        buttonsDiv.appendChild(saveButton);
        buttonsDiv.appendChild(cancelButton);
        inputContainer.appendChild(input);
        inputContainer.appendChild(dateInput);
        inputContainer.appendChild(buttonsDiv);
        
        const header = section.querySelector('.section-header');
        header.insertAdjacentElement('afterend', inputContainer);
        
        return inputContainer;
    }
    
    async function handleTaskSave(input, dateInput, section) {
        const taskText = input.value.trim();
        if (!taskText) {
            showInputError(input);
            return;
        }
        
        const dueDate = dateInput.value || null;
        const sectionContent = section.querySelector('.section-content');
        
        // Add task to Supabase
        const taskId = await saveTaskToSupabase(taskText, dueDate);
        
        if (taskId) {
            // Add task to UI with the database ID
            addTaskToSection(sectionContent, taskText, dueDate, taskId);
            input.value = '';
            dateInput.value = '';
            input.closest('.task-input-container').style.display = 'none';
        }
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
    
    function addTaskToSection(sectionContent, taskText, dueDate, taskId) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.taskId = taskId; // Store task ID for future reference
        
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
        
        // Add due date display if available
        if (dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';
            dueDateSpan.textContent = formatDate(dueDate);
            taskItem.appendChild(dueDateSpan);
        }
        
        const deleteSpan = document.createElement('span');
        deleteSpan.className = 'delete-task';
        deleteSpan.textContent = '✕';
        deleteSpan.addEventListener('click', async function(e) {
            e.stopPropagation();
            
            // Delete from Supabase
            const deleted = await deleteTaskFromSupabase(taskId);
            
            if (deleted) {
                taskItem.remove();
            }
        });
        
        taskItem.appendChild(checkContainer);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(deleteSpan);
        sectionContent.appendChild(taskItem);
    }
    
    // Supabase Integration Functions
    
    async function loadTasksFromSupabase() {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('due_date', { ascending: true });
            
            if (error) {
                console.error('Error fetching tasks:', error);
                return;
            }
            
            // Default section to add tasks to
            const defaultSection = document.querySelector('.section-content');
            if (!defaultSection) return;
            
            // Display tasks
            data.forEach(task => {
                addTaskToSection(defaultSection, task.task, task.due_date, task.id);
            });
        } catch (err) {
            console.error('Error loading tasks:', err);
        }
    }
    
    async function saveTaskToSupabase(taskText, dueDate) {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([
                    { task: taskText, due_date: dueDate }
                ])
                .select();
            
            if (error) {
                console.error('Error saving task:', error);
                return null;
            }
            
            return data[0].id;
        } catch (err) {
            console.error('Error saving task:', err);
            return null;
        }
    }
    
    async function deleteTaskFromSupabase(taskId) {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);
            
            if (error) {
                console.error('Error deleting task:', error);
                return false;
            }
            
            return true;
        } catch (err) {
            console.error('Error deleting task:', err);
            return false;
        }
    }
    
    // Helper function to format dates
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
});