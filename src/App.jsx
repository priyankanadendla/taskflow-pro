import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://taskflow-backend-wllt.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
        setError("");
      } catch (err) {
        setError(
          "Backend connection failed. Please start Spring Boot."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
    const taskTitle = (task.title || "").toLowerCase();
    const taskCategory = (task.category || "").toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      taskTitle.includes(searchText) ||
      taskCategory.includes(searchText);

    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category: category,
          priority: priority,
          description: "",
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      const savedTask = await response.json();

      setTasks((previous) => [savedTask, ...previous]);
      setTitle("");
      setCategory("Work");
      setPriority("Medium");
      setShowForm(false);
      setError("");
    } catch (err) {
      setError("Task save failed. Please check the backend.");
    }
  }

  async function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      return;
    }

    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const savedTask = await response.json();

      setTasks((previous) =>
        previous.map((item) =>
          item.id === id ? savedTask : item
        )
      );

      setError("");
    } catch (err) {
      setError("Task update failed. Please check the backend.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );

      setError("");
    } catch (err) {
      setError("Task deletion failed. Please check the backend.");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home">
          <span className="brand-icon">✓</span>
          <span>
            TaskFlow <span className="brand-pro">Pro</span>
          </span>
        </a>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          <button
            className={`nav-item ${
              filter === "All" ? "active" : ""
            }`}
            onClick={() => setFilter("All")}
          >
            <span>▦</span> All Tasks
            <span className="nav-count">{tasks.length}</span>
          </button>

          <button
            className={`nav-item ${
              filter === "Pending" ? "active" : ""
            }`}
            onClick={() => setFilter("Pending")}
          >
            <span>◷</span> Pending
          </button>

          <button
            className={`nav-item ${
              filter === "Completed" ? "active" : ""
            }`}
            onClick={() => setFilter("Completed")}
          >
            <span>✓</span> Completed
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon">✦</span>
            <h3>Stay productive!</h3>
            <p>
              Small steps every day lead to big results.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">P</div>
            <div>
              <strong>Priyanka</strong>
              <span>Workspace member</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              YOUR PERSONAL WORKSPACE
            </p>
            <h1>
              My Dashboard{" "}
              <span className="heading-sparkle">✦</span>
            </h1>
          </div>

          <div className="topbar-actions">
            <button
              className="primary-button"
              onClick={() => setShowForm(!showForm)}
            >
              + Add New Task
            </button>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="welcome-label">
              YOUR DAILY OVERVIEW
            </span>
            <h2>Make today count! ✨</h2>
            <p>
              Stay focused, organize your work, and celebrate
              every little win.
            </p>
          </div>

          <div className="banner-art">
            <div className="art-circle">✓</div>
            <div className="art-card card-one">
              ✦ Stay focused
            </div>
            <div className="art-card card-two">
              ✓ Progress matters
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              Total Tasks
              <span className="stat-icon purple">▦</span>
            </div>
            <strong>{tasks.length}</strong>
            <p>Tasks in your workspace</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              Pending Tasks
              <span className="stat-icon orange">◷</span>
            </div>
            <strong>{pendingCount}</strong>
            <p>Waiting to be completed</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              Completed Tasks
              <span className="stat-icon green">✓</span>
            </div>
            <strong>{completedCount}</strong>
            <p>Great job making progress!</p>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            style={{
              color: "red",
              margin: "16px 0",
            }}
          >
            {error}
          </p>
        )}

        {showForm && (
          <form className="task-form" onSubmit={addTask}>
            <h2>Create a New Task</h2>

            <label>
              Task title
              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="What do you need to do?"
                required
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option>Work</option>
                  <option>Learning</option>
                  <option>Personal</option>
                  <option>Projects</option>
                </select>
              </label>

              <label>
                Priority
                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>My Tasks</h2>
              <p>
                Organize your day, one task at a time.
              </p>
            </div>

            <span className="task-total">
              {filteredTasks.length} tasks
            </span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="filter-tabs">
              {["All", "Pending", "Completed"].map((item) => (
                <button
                  key={item}
                  className={`filter-tab ${
                    filter === item ? "selected" : ""
                  }`}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="task-list">
            {loading && <p>Loading tasks...</p>}

            {!loading &&
              filteredTasks.map((task) => (
                <article
                  key={task.id}
                  className={`task-row ${
                    task.completed ? "task-done" : ""
                  }`}
                >
                  <button
                    className={`task-check ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task.id)}
                    aria-label="Toggle task completion"
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <span className="task-category">
                      {task.category || "Work"}
                    </span>
                  </div>

                  <span
                    className={`priority priority-${(
                      task.priority || "Medium"
                    ).toLowerCase()}`}
                  >
                    {task.priority || "Medium"}
                  </span>

                  <span
                    className={`status ${
                      task.completed
                        ? "status-completed"
                        : "status-pending"
                    }`}
                  >
                    {task.completed
                      ? "Completed"
                      : "Pending"}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </article>
              ))}

            {!loading && filteredTasks.length === 0 && (
              <div className="empty-state">
                <span>✦</span>
                <h3>No tasks found</h3>
                <p>
                  Try another search or add a new task.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setShowForm(true)}
                >
                  + Add New Task
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 TaskFlow Pro</span>
          <span>
            Made with <b>♥</b> for better productivity
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;