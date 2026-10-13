
import { useState, useEffect } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Complete Java practice", category: "Learning", priority: "High", completed: false },
  { id: 2, title: "Update portfolio website", category: "Personal", priority: "Medium", completed: false },
  { id: 3, title: "Review project documentation", category: "Work", priority: "Low", completed: true },
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

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;

    setTasks((previous) => [
      {
        id: Date.now(),
        title: title.trim(),
        category,
        priority,
        completed: false,
      },
      ...previous,
    ]);

    setTitle("");
    setCategory("Work");
    setPriority("Medium");
    setShowForm(false);
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
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
          <span>TaskFlow <span className="brand-pro">Pro</span></span>
        </a>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          <button className={`nav-item ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>
            <span>▦</span> All Tasks <span className="nav-count">{tasks.length}</span>
          </button>
          <button className={`nav-item ${filter === "Pending" ? "active" : ""}`} onClick={() => setFilter("Pending")}>
            <span>◷</span> Pending
          </button>
          <button className={`nav-item ${filter === "Completed" ? "active" : ""}`} onClick={() => setFilter("Completed")}>
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
              <strong>Priyanka</strong>
              <span>Workspace member</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h1>My Dashboard <span className="heading-sparkle">✦</span></h1>
          </div>
          <div className="topbar-actions">
            <button className="primary-button" onClick={() => setShowForm(!showForm)}>
              + Add New Task
            </button>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="welcome-label">YOUR DAILY OVERVIEW</span>
            <h2>Make today count! ✨</h2>
            <p>Stay focused, organize your work, and celebrate every little win.</p>
          </div>
          <div className="banner-art">
            <div className="art-circle">✓</div>
            <div className="art-card card-one">✦ Stay focused</div>
            <div className="art-card card-two">✓ Progress matters</div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">Total Tasks <span className="stat-icon purple">▦</span></div>
            <strong>{tasks.length}</strong>
            <p>Tasks in your workspace</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">Pending Tasks <span className="stat-icon orange">◷</span></div>
            <strong>{pendingCount}</strong>
            <p>Waiting to be completed</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">Completed Tasks <span className="stat-icon green">✓</span></div>
            <strong>{completedCount}</strong>
            <p>Great job making progress!</p>
          </div>
        </section>

        {showForm && (
          <form className="task-form" onSubmit={addTask}>
            <h2>Create a New Task</h2>
            <label>
              Task title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What do you need to do?" required />
            </label>
            <div className="form-row">
              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Work</option>
                  <option>Learning</option>
                  <option>Personal</option>
                  <option>Projects</option>
                </select>
              </label>
              <label>
                Priority
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary-button">Save Task</button>
            </div>
          </form>
        )}

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>My Tasks</h2>
              <p>Organize your day, one task at a time.</p>
            </div>
            <span className="task-total">{filteredTasks.length} tasks</span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input type="search" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {["All", "Pending", "Completed"].map((item) => (
                <button key={item} className={`filter-tab ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="task-list">
            {filteredTasks.map((task) => (
              <article key={task.id} className={`task-row ${task.completed ? "task-done" : ""}`}>
                <button className={`task-check ${task.completed ? "checked" : ""}`} onClick={() => toggleTask(task.id)} aria-label="Toggle task completion">
                  {task.completed ? "✓" : ""}
                </button>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <span className="task-category">{task.category}</span>
                </div>
                <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                <span className={`status ${task.completed ? "status-completed" : "status-pending"}`}>
                  {task.completed ? "Completed" : "Pending"}
                </span>
                <button className="delete-button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task">×</button>
              </article>
            ))}

            {filteredTasks.length === 0 && (
              <div className="empty-state">
                <span>✦</span>
                <h3>No tasks found</h3>
                <p>Try another search or add a new task.</p>
                <button className="primary-button" onClick={() => setShowForm(true)}>+ Add New Task</button>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 TaskFlow Pro</span>
          <span>Made with <b>♥</b> for better productivity</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
