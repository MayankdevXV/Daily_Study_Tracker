
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");

const STORAGE_KEY = "dailyStudyTrackerTasks";

let tasks = [];

// 1. Load saved tasks from the browser.
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);

      if (Array.isArray(parsedTasks)) {
        tasks = parsedTasks.filter(
          (task) =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
      }
    }
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    tasks = [];
  }
}

// 2. Save tasks to the browser.
function saveTasks() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Tasks could not be saved in this browser.");
  }
}

// 3. Update the task count and empty message.
function updateTaskSummary() {
  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  taskCount.textContent =
    tasks.length === 0
      ? "0 tasks"
      : `${completed}/${tasks.length} completed`;

  emptyState.hidden = tasks.length > 0;
}

// 4. Display all tasks on the webpage.
function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    const taskLabel = document.createElement("span");
    taskLabel.className = "task-text";
    taskLabel.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "complete-button";
    completeButton.textContent = task.completed
      ? "Undo"
      : "Complete";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    // Mark a task complete or incomplete.
    completeButton.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Delete a task.
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(
        (item) => item.id !== task.id
      );

      saveTasks();
      renderTasks();
    });

    actions.append(completeButton, deleteButton);
    taskItem.append(taskLabel, actions);
    taskList.append(taskItem);
  });

  updateTaskSummary();
}

// 5. Add a new task.
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (!taskText) return;

  const newTask = {
    id: crypto.randomUUID(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  taskForm.reset();
  taskInput.focus();
});

// 6. Start the app with previously saved tasks.
loadTasks();
renderTasks();

console.log("Daily Study Tracker is ready!");
