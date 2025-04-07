// HomePage.js
import React, { useState } from "react";
import "./HomePage.css";

function HomePage() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [task, setTask] = useState("");

  const handleAddTask = () => {
    alert(`New Task: ${task}`);
    setTask("");
  };

  return React.createElement(
    "div",
    { className: "home" },
    [
      React.createElement("h1", { key: "heading" }, "Welcome to To do dashboard"),

      React.createElement(
        "button",
        {
          className: "toggle-btn",
          onClick: () => setShowAddTask(!showAddTask),
          key: "toggle"
        },
        showAddTask ? "Hide Add Task" : "Add New Task"
      ),

      showAddTask &&
        React.createElement(
          "div",
          { className: "add-task-form", key: "form" },
          [
            React.createElement("input", {
              type: "text",
              placeholder: "Enter a task",
              value: task,
              onChange: (e) => setTask(e.target.value),
              key: "input"
            }),
            React.createElement(
              "button",
              {
                onClick: handleAddTask,
                key: "addBtn"
              },
              "Add Task"
            )
          ]
        ),

      React.createElement("h2", { key: "summary" }, "Summary"),
      React.createElement(
        "ul",
        { key: "list" },
        [
          React.createElement("li", { key: "completed" }, "✅ 5 Completed"),
          React.createElement("li", { key: "pending" }, "🕒 3 Pending"),
          React.createElement("li", { key: "scheduled" }, "📅 2 Scheduled for later")
        ]
      )
    ]
  );
}

export default HomePage;
