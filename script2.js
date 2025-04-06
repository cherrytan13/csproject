document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date-input');
    const calendarDropdown = document.getElementById('calendar-dropdown');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarGrid = document.getElementById('calendar-grid');

    let currentDate = new Date();
    let selectedDate = null;

    // Days of the week headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize calendar
    function initCalendar() {
        updateCalendar();
        renderDayHeaders();
    }

    // Render day headers (Sun, Mon, etc.)
    function renderDayHeaders() {
        calendarGrid.innerHTML = '';
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.classList.add('day-header');
            calendarGrid.appendChild(dayElement);
        });
    }

    // Update calendar grid with days
    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYear.textContent = 
            `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Clear previous days (except headers)
        while (calendarGrid.children.length > 7) {
            calendarGrid.removeChild(calendarGrid.lastChild);
        }

        // Previous month's days
        for (let i = 0; i < firstDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = daysInPrevMonth - firstDay + i + 1;
            dayElement.classList.add('other-month');
            calendarGrid.appendChild(dayElement);
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.addEventListener('click', () => selectDate(new Date(year, month, i)));
            
            // Highlight selected date
            if (selectedDate && 
                selectedDate.getDate() === i && 
                selectedDate.getMonth() === month && 
                selectedDate.getFullYear() === year) {
                dayElement.classList.add('selected');
            }
            
            calendarGrid.appendChild(dayElement);
        }

        // Next month's days (to fill remaining cells)
        const remainingCells = 42 - (firstDay + daysInMonth); // 6 rows * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('other-month');
            calendarGrid.appendChild(dayElement);
        }
    }

    // Select a date
    function selectDate(date) {
        selectedDate = date;
        dateInput.value = date.toLocaleDateString();
        calendarDropdown.style.display = 'none';
        updateCalendar();
    }

    // Toggle calendar dropdown
    dateInput.addEventListener('click', () => {
        calendarDropdown.style.display = 
            calendarDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Navigate to previous month
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    // Navigate to next month
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    // Close calendar when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.calendar-container')) {
            calendarDropdown.style.display = 'none';
        }
    });

    initCalendar();
});