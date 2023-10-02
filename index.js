const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const completedTaskList = document.getElementById("completedTaskList");

// タスク生成
function createTaskItem(taskText, completed = false) {
  const li = document.createElement("li");
  li.innerHTML = `<span>・${taskText}</span>
  <span>
    <input type="checkbox" ${completed ? "checked" : ""} />
    <button class="deleteBtn d-btn">✖</button>
  </span>`;
  return li;
}

// タスク追加
function addTask(taskText, completed = false) {
  const taskItem = createTaskItem(taskText, completed);
  if (completed) {
    completedTaskList.appendChild(taskItem);
  } else {
    taskList.appendChild(taskItem);
  }
  attachTaskListeners(taskItem);
}

// リスト移動
function toggleTaskCompletion(taskItem) {
  const checkbox = taskItem.querySelector("input[type='checkbox']");
  const completed = checkbox.checked;

  if (completed) {
    taskList.removeChild(taskItem);
    completedTaskList.appendChild(taskItem);
  } else {
    completedTaskList.removeChild(taskItem);
    taskList.appendChild(taskItem);
  }
  updateTaskStatusInLocalStorage(taskItem, completed);
}

// タスク削除
function deleteTask(taskItem) {
  taskItem.remove();
  removeTaskFromLocalStorage(taskItem);
}

// タスク保存(ローカルストレージ)
function updateTaskStatusInLocalStorage(taskItem, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskText = taskItem.querySelector("span").textContent.slice(1);
  const taskIndex = tasks.findIndex((task) => task.text === taskText);

  if (taskIndex !== -1) {
    tasks[taskIndex].completed = completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// タスク削除(ローカルストレージ)
function removeTaskFromLocalStorage(taskItem) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskText = taskItem.querySelector("span").textContent.slice(1);
  const updatedTasks = tasks.filter((task) => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

// aELを付与
function attachTaskListeners(taskItem) {
  const checkbox = taskItem.querySelector("input[type='checkbox']");
  const deleteBtn = taskItem.querySelector(".deleteBtn");

  checkbox.addEventListener("change", () => {
    toggleTaskCompletion(taskItem);
  });

  deleteBtn.addEventListener("click", () => {
    deleteTask(taskItem);
  });
}

// 追加ボタンにaEL
addTaskBtn.addEventListener("click", () => {
  addTaskFromInput();
});

taskInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addTaskFromInput();
  }
});

function addTaskFromInput() {
  const taskText = taskInput.value;
  if (taskText.trim() !== "") {
    addTask(taskText, false);
    taskInput.value = "";

    saveTaskToLocalStorage(taskText, false);
  }
}

// ローカルストレージに保存する
function saveTaskToLocalStorage(taskText, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// タスクの復元
function initialize() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTask(task.text, task.completed);
  });
}

initialize();
