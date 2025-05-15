import sqlite3

# Connect to database
conn = sqlite3.connect('tasks.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables in database:")
print(cursor.fetchall())

# Get all tasks
cursor.execute("SELECT * FROM tasks")
print("\nAll Tasks:")
for row in cursor.fetchall():
    print(row)

conn.close()