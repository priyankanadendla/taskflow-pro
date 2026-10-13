
import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Complete React project", category: "Development", priority: "High", done: false },
  { id: 2, title: "Practice Java coding", category: "Learning", priority: "High", done: false },
  { id: 3, title: "Review project documentation", category: "Planning", priority: "Medium", done: true },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("taskflow-tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [filter, setFilter] = useState("All Tasks");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;

  const visibleTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All Tasks" ||
      (filter === "Completed" && task.done) ||
      (filter === "Pending" && !task.done);

    return (
      matchesFilter &&
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setTasks((previous) => [
      {
        id: Date.now(),
        title: title.trim(),
        category,
        priority,
        done: false,
      },
      ...previous,
    ]);

    setTitle("");
    setShowForm(false);
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home">
          <span className="brand-icon">✓</span>
          <span>TaskFlow<span className="brand-pro"> Pro</span></span>
        </a>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          <button
            className={filter === "All Tasks" ? "nav-item active" : "nav-item"}
            onClick={() => setFilter("All Tasks")}
          >
            <span>▦</span> All Tasks
            <span className="nav-count">{tasks.length}</span>
          </button>

          <button
            className={filter === "Pending" ? "nav-item active" : "nav-item"}
            onClick={() => setFilter("Pending")}
          >
            <span>◷</span> Pending
          </button>

          <button
            className={filter === "Completed" ? "nav-item active" : "nav-item"}
            onClick={() => setFilter("Completed")}
          >
            <span>✓</span> Completed
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon">✦</span>
            <h3>Stay productive!</h3>
            <p>Small steps every day lead to big results.</p>
          </div>
          <div className="profile">
            <div className="avatar">P</div>
            <div>
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div>
            <p className="eyebrow">MY WORKSPACE / TASKS</p>
            <h1>My Tasks <span className="heading-sparkle">✳</span></h1>
          </div>
          <button className="primary-button" onClick={() => setShowForm(!showForm)}>
            <span>＋</span> Add New Task
          </button>
        </header>

        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="welcome-label">YOUR PRODUCTIVITY SPACE</span>
            <h2>Make today count.</h2>
            <p>Organize your work, focus on what matters, and get things done.</p>
          </div>
          <div className="banner-art" aria-hidden="true">
            <div className="art-circle">✓</div>
            <div className="art-card card-one">✦ Stay focused</div>
            <div className="art-card card-two">✓ Task complete</div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total tasks</span>
              <span className="stat-icon purple">▦</span>
            </div>
            <strong>{tasks.length}</strong>
            <p>Tasks in your workspace</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>In progress</span>
              <span className="stat-icon orange">◷</span>
            </div>
            <strong>{pending}</strong>
            <p>Still to be completed</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Completed</span>
              <span className="stat-icon green">✓</span>
            </div>
            <strong>{completed}</strong>
            <p>Tasks finished so far</p>
          </div>
        </section>

        {showForm && (
          <form className="task-form" onSubmit={addTask}>
            <h2>Create a new task</h2>
            <label>
              Task name
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to do?"
                required
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Development</option>
                  <option>Learning</option>
                  <option>Planning</option>
                  <option>Personal</option>
                </select>
              </label>
              <label>
                Priority
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button">Save Task</button>
            </div>
          </form>
        )}

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Task overview</h2>
              <p>Keep track of everything you need to do.</p>
            </div>
            <span className="task-total">{visibleTasks.length} tasks</span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your tasks..."
                aria-label="Search tasks"
              />
            </div>
            <div className="filter-tabs">
              {["All Tasks", "Pending", "Completed"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "filter-tab selected" : "filter-tab"}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="task-list">
            {visibleTasks.map((task) => (
              <article className={task.done ? "task-row task-done" : "task-row"} key={task.id}>
                <button
                  className={task.done ? "task-check checked" : "task-check"}
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.done ? "Mark task pending" : "Mark task completed"}
                >
                  {task.done ? "✓" : ""}
                </button>

                <div className="task-info">
                  <h3>{task.title}</h3>
                  <span className="task-category">{task.category}</span>
                </div>

                <span className={`priority priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>

                <span className={task.done ? "status status-completed" : "status status-pending"}>
                  {task.done ? "Completed" : "Pending"}
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

            {visibleTasks.length === 0 && (
              <div className="empty-state">
                <span>✦</span>
                <h3>No tasks found</h3>
                <p>Try another search or add a new task to get started.</p>
                <button className="primary-button" onClick={() => setShowForm(true)}>
                  ＋ Create a task
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 TaskFlow Pro</span>
          <span>Plan better. Do better. <b>✦</b></span>
        </footer>
      </main>
    </div>
  );
}

export default App;
