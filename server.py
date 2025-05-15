from flask import Flask, request, jsonify, render_template
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS tasks
                 (id INTEGER PRIMARY KEY, 
                 text TEXT NOT NULL, 
                 completed INTEGER DEFAULT 0)''')
    
    conn.commit()
    conn.close()

# Database connection helper
def get_db_connection():
    conn = sqlite3.connect('tasks.db')
    conn.row_factory = sqlite3.Row
    return conn

# Frontend routes
@app.route('/')
def home():
    return render_template('index.html')

# API routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    c = conn.cursor()
    
    filter_type = request.args.get('filter', 'all')
    
    if filter_type == 'active':
        c.execute('SELECT * FROM tasks WHERE completed = 0')
    elif filter_type == 'completed':
        c.execute('SELECT * FROM tasks WHERE completed = 1')
    else:
        c.execute('SELECT * FROM tasks')
    
    tasks = c.fetchall()
    conn.close()
    
    tasks_list = [dict(task) for task in tasks]
    return jsonify(tasks_list)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing task text'}), 400
    
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('INSERT INTO tasks (text) VALUES (?)', (data['text'],))
    conn.commit()
    
    task_id = c.lastrowid
    conn.close()
    
    return jsonify({'id': task_id, 'text': data['text'], 'completed': 0}), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    conn = get_db_connection()
    c = conn.cursor()
    
    if 'text' in data:
        c.execute('UPDATE tasks SET text = ? WHERE id = ?', (data['text'], task_id))
    if 'completed' in data:
        completed = 1 if data['completed'] else 0
        c.execute('UPDATE tasks SET completed = ? WHERE id = ?', (completed, task_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/tasks/clear-completed', methods=['DELETE'])
def clear_completed():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('DELETE FROM tasks WHERE completed = 1')
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)