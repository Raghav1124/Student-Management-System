import sqlite3
import sys
import os
import time


def init_database():
    try:
        print("Initializing database...")

        # Check if database exists and is locked
        db_file = "database.db"
        if os.path.exists(db_file):
            print("Database file exists, checking if it's locked...")
            try:
                # Try to open and close the file to check lock
                with open(db_file, 'a') as f:
                    f.close()
                print("Database file is not locked, removing...")
                os.remove(db_file)
            except PermissionError:
                print("ERROR: Database file is locked by another process!")
                print("Please close all applications that might be using database.db")
                print("Then run this script again.")
                sys.exit(1)

        # Create new database
        print("Creating new database...")
        conn = sqlite3.connect(db_file)

        # Enable foreign key constraints
        conn.execute("PRAGMA foreign_keys = ON")

        # Read and execute the SQL file
        with open("init.sql", "r", encoding="utf-8") as f:
            sql_script = f.read()

        # Split the script into individual statements
        statements = sql_script.split(';')

        successful_statements = 0
        for i, statement in enumerate(statements, 1):
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    conn.execute(statement)
                    successful_statements += 1
                    print(f"✓ Executed statement {i}")
                except sqlite3.Error as e:
                    print(f"✗ Error executing statement {i}:")
                    print(f"   Error: {e}")
                    if "FOREIGN KEY constraint failed" in str(e):
                        print("   This is usually due to incorrect table drop order")

        conn.commit()
        conn.close()

        print("\n" + "="*50)
        print(f"Database created successfully!")
        print(f"Executed {successful_statements} statements")
        print("="*50)
        print("\n=== TEST CREDENTIALS ===")
        print("Teachers:")
        print("  - Username: Teacher A | Password: pass123 | Role: teacher")
        print("  - Username: Teacher B | Password: pass123 | Role: teacher")
        print("\nStudents:")
        print("  - Username: Alice     | Password: alice123 | Role: student")
        print("  - Username: Bob       | Password: bob123   | Role: student")
        print("\nAccess URL: http://127.0.0.1:5000")
        print("="*50)

    except FileNotFoundError:
        print("Error: init.sql file not found!")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    init_database()
