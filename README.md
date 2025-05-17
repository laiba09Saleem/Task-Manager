📝 Task Manager

A simple, responsive, and user-friendly **Task Manager** web application built with **HTML**, **CSS**, **JavaScript**, and **Flask (Python)** for managing daily tasks efficiently. It supports task creation, editing, deletion, filtering (active/completed), and clearing completed tasks.

🚀 Features

* ✅ Add new tasks
* 📋 View all, active, or completed tasks
* ✏️ Edit tasks inline with double-click
* 🗑️ Delete individual tasks
* 🧹 Clear all completed tasks
* 🔄 Real-time updates via JavaScript
* 📦 RESTful API built using Flask
* 💾 SQLite database integration
* 🌐 CORS-enabled API for frontend-backend interaction

🛠️ Tech Stack

Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)
* Font Awesome for icons

Backend

* Python 3
* Flask
* Flask-CORS
* SQLite3

📂 Project Structure


task-manager/
│
├── static/
│   ├── style.css         # CSS for styling the app
│   └── script.js         # JavaScript logic
│
├── templates/
│   └── index.html        # Main HTML template
│
├── tasks.db              # SQLite database file (auto-created)
├── app.py                # Flask backend
└── README.md             # Project documentation


⚙️ Setup Instructions

1. Clone the Repository

git clone (https://github.com/laiba09Saleem/Task-Manager.git)
cd task-manager

2. Create a Virtual Environment (Optional but Recommended)


python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install Dependencies

pip install flask flask-cors

4. Run the Application

By default, the app will run on `http://localhost:5000`.

5. Open in Browser

Visit: [http://localhost:5000](http://localhost:5000)

📡 API Endpoints

| Method | Endpoint                     | Description                    |              |                        |
| ------ | ---------------------------- | ------------------------------ | ------------ | ---------------------- |
| GET    | \`/api/tasks?filter=\[all    | active                         | completed]\` | Get filtered task list |
| POST   | `/api/tasks`                 | Add a new task                 |              |                        |
| PUT    | `/api/tasks/<id>`            | Update a task (text/completed) |              |                        |
| DELETE | `/api/tasks/<id>`            | Delete a specific task         |              |                        |
| DELETE | `/api/tasks/clear-completed` | Delete all completed tasks     |              |                        |

🖼️ Screenshots

![Task Manager Screenshot](Task_Manager.png)

📌 Future Enhancements

* User authentication (login/signup)
* Due dates & reminders
* Drag-and-drop task sorting
* Dark mode toggle
* Cloud database support (PostgreSQL/Firebase)

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
