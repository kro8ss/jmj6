// ----- 1. گرفتن المان‌ها از صفحه -----
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// ----- 2. متغیرهای اصلی -----
let tasks = [];
const STORAGE_KEY = 'tasks'; // درست شد
let currentFilter = 'all';

// ----- 3. ذخیره در localStorage -----
function saveTasks() { // درست شد
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ----- 4. بارگذاری از localStorage -----
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

// ----- 5. نمایش وظایف در صفحه -----
function renderTasks() {
    taskList.innerHTML = '';

    let filtered = tasks;
    if (currentFilter === 'completed') {
        filtered = tasks.filter(task => task.completed === true);
    } else if (currentFilter === 'uncompleted') {
        filtered = tasks.filter(task => task.completed === false);
    }

    if (filtered.length === 0) {
        taskList.innerHTML = '<div style="text-align:center;color:#999;">هیچ وظیفه‌ای نیست</div>';
       
        return;
    }

    filtered.forEach(task => {
        const li = document.createElement('li'); // درست شد
        li.className = 'task-item' + (task.completed ? ' completed' : '');

        const textSpan = document.createElement('span'); // درست شد
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        textSpan.addEventListener('click', () => toggleTask(task.id));

        const actionsDiv = document.createElement('div'); // درست شد
        actionsDiv.className = 'task-actions';

        const completeBtn = document.createElement('button'); // درست شد
        completeBtn.textContent = '✔';
        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTask(task.id);
        });

        const deleteBtn = document.createElement('button'); // درست شد
        deleteBtn.textContent = '🗑';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(textSpan);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    });

    updateCounter();
}

// ----- 6. اضافه کردن وظیفه -----
function addTask() {
    const text = taskInput.value.trim(); // درست شد
    if (text === '') {
        alert('لطفاً متن وظیفه را وارد کن');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

// ----- 7. حذف وظیفه -----
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// ----- 8. تغییر وضعیت -----
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// ----- 9. تغییر فیلتر -----
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    renderTasks();
}

// ----- 10. به‌روزرسانی شمارنده -----
function updateCounter() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const pending = total - done;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('doneCount').textContent = done;
    document.getElementById('pendingCount').textContent = pending;
}

// ----- 11. اتصال رویدادها -----
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => { // درست شد
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// ----- 12. راه‌اندازی اولیه -----
loadTasks();
renderTasks();
setFilter('all');