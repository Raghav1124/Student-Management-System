from flask import Flask, render_template, request, redirect, session, jsonify, flash
import sqlite3
from functools import wraps
import json

app = Flask(__name__)
app.secret_key = "student_management_secret_2024"
app.config['SESSION_TYPE'] = 'filesystem'
DB_NAME = "database.db"

# -------------------
# Database Connection Helper
# -------------------


def get_db():
    """Get database connection"""
    return sqlite3.connect(DB_NAME, check_same_thread=False)

# -------------------
# Decorators
# -------------------


def login_required(f):
    """Decorator to require login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            flash("Please login first", "warning")
            return redirect("/")
        return f(*args, **kwargs)
    return decorated_function


def teacher_required(f):
    """Decorator to require teacher role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            flash("Please login first", "warning")
            return redirect("/")
        if session.get("role") != "teacher":
            flash("Access denied. Teacher role required.", "danger")
            return redirect("/dashboard")
        return f(*args, **kwargs)
    return decorated_function

# -------------------
# Authentication Routes
# -------------------


@app.route("/", methods=["GET", "POST"])
def login():
    """Login page"""
    if "user" in session:
        return redirect("/dashboard")

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        with get_db() as conn:
            cur = conn.cursor()
            cur.execute(
                "SELECT username, role FROM users WHERE username=? AND password=?",
                (username, password),
            )
            user = cur.fetchone()

        if user:
            session["user"] = user[0]
            session["role"] = user[1]
            flash(f"Welcome back, {user[0]}!", "success")
            return redirect("/dashboard")
        else:
            flash("Invalid username or password", "danger")

    return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """Signup page"""
    if "user" in session:
        return redirect("/dashboard")

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if not username or not password:
            flash("Username and password are required", "danger")
            return render_template("signup.html")

        if password != confirm_password:
            flash("Passwords do not match", "danger")
            return render_template("signup.html")

        if len(password) < 6:
            flash("Password must be at least 6 characters", "danger")
            return render_template("signup.html")

        try:
            with get_db() as conn:
                cur = conn.cursor()
                # Check if username exists
                cur.execute(
                    "SELECT username FROM users WHERE username=?", (username,))
                if cur.fetchone():
                    flash("Username already exists", "danger")
                    return render_template("signup.html")

                # Insert new user
                cur.execute(
                    "INSERT INTO users (username, password, role) VALUES (?, ?, 'student')",
                    (username, password),
                )
                conn.commit()

            flash("Account created successfully! Please login.", "success")
            return redirect("/")
        except sqlite3.Error as e:
            flash(f"Database error: {str(e)}", "danger")

    return render_template("signup.html")

# -------------------
# Main Routes
# -------------------


@app.route("/dashboard")
@login_required
def dashboard():
    """Dashboard page"""
    user = session.get("user", "Guest")
    role = session.get("role", "student")

    # Get stats for dashboard
    with get_db() as conn:
        cur = conn.cursor()

        if role == "teacher":
            # Get teacher's class info
            cur.execute("""
                SELECT t.class_id, c.name, COUNT(s.id) as student_count
                FROM teachers t 
                LEFT JOIN classes c ON t.class_id = c.id
                LEFT JOIN students s ON t.class_id = s.class_id
                WHERE t.name=?
                GROUP BY t.class_id, c.name
            """, (user,))
            teacher_info = cur.fetchone()

            if teacher_info:
                class_id, class_name, student_count = teacher_info
            else:
                class_name = "No Class Assigned"
                student_count = 0
        else:
            # Get student's class info
            cur.execute("""
                SELECT c.name 
                FROM students s 
                JOIN classes c ON s.class_id = c.id 
                WHERE s.name=?
            """, (user,))
            student_info = cur.fetchone()
            class_name = student_info[0] if student_info else "Not Enrolled"
            student_count = 0

        # Get total counts
        cur.execute("SELECT COUNT(*) FROM students")
        total_students = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM teachers")
        total_teachers = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM classes")
        total_classes = cur.fetchone()[0]

    return render_template("dashboard.html",
                           username=user,
                           role=role,
                           class_name=class_name,
                           student_count=student_count,
                           total_students=total_students,
                           total_teachers=total_teachers,
                           total_classes=total_classes)


@app.route("/students")
@login_required
def students():
    """Students list page"""
    role = session.get("role")
    user = session.get("user")

    with get_db() as conn:
        cur = conn.cursor()

        if role == "teacher":
            # Teachers see only their class students
            cur.execute("SELECT class_id FROM teachers WHERE name=?", (user,))
            teacher_class = cur.fetchone()

            if teacher_class:
                cur.execute("""
                    SELECT s.id, s.name, c.name
                    FROM students s
                    JOIN classes c ON s.class_id = c.id
                    WHERE s.class_id=?
                    ORDER BY s.name
                """, (teacher_class[0],))
            else:
                data = []
        else:
            # Students and others see all students
            cur.execute("""
                SELECT s.id, s.name, c.name
                FROM students s
                JOIN classes c ON s.class_id = c.id
                ORDER BY s.name
            """)

        data = cur.fetchall()

    return render_template("students.html", students=data, role=role)


@app.route("/teachers")
@login_required
def teachers():
    """Teachers list page"""
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT t.id, t.name, t.subject, c.name
            FROM teachers t
            LEFT JOIN classes c ON t.class_id = c.id
            ORDER BY t.name
        """)
        data = cur.fetchall()
    return render_template("teachers.html", teachers=data)


@app.route("/timetable")
@login_required
def timetable_page():
    """Timetable page"""
    role = session.get("role")
    user = session.get("user")

    # Get user's class for default selection
    default_class_id = None
    with get_db() as conn:
        cur = conn.cursor()

        if role == "teacher":
            cur.execute("SELECT class_id FROM teachers WHERE name=?", (user,))
            result = cur.fetchone()
            default_class_id = result[0] if result else None
        elif role == "student":
            cur.execute("SELECT class_id FROM students WHERE name=?", (user,))
            result = cur.fetchone()
            default_class_id = result[0] if result else None

    return render_template("timetable.html",
                           default_class_id=default_class_id,
                           role=role)


@app.route("/my_class")
@teacher_required
def my_class():
    """Teacher's class management page"""
    teacher_name = session.get("user")

    with get_db() as conn:
        cur = conn.cursor()

        # Get teacher's class
        cur.execute("""
            SELECT t.class_id, c.name, t.subject 
            FROM teachers t 
            JOIN classes c ON t.class_id = c.id 
            WHERE t.name=?
        """, (teacher_name,))
        teacher_info = cur.fetchone()

        if not teacher_info:
            flash("No class assigned to you", "warning")
            return redirect("/dashboard")

        class_id, class_name, subject = teacher_info

        # Get students in this class
        cur.execute("""
            SELECT id, name 
            FROM students 
            WHERE class_id=? 
            ORDER BY name
        """, (class_id,))
        students = cur.fetchall()

    return render_template("my_class.html",
                           class_name=class_name,
                           subject=subject,
                           students=students)

# -------------------
# API Routes
# -------------------


@app.route("/api/classes")
def api_classes():
    """API to get all classes"""
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, name FROM classes ORDER BY name")
        classes = cur.fetchall()
    return jsonify([{"id": c[0], "name": c[1]} for c in classes])


@app.route("/api/timetable/<int:class_id>")
def api_timetable(class_id):
    """API to get timetable for a class (normalized structure)"""
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT day, period, subject, start_time, end_time
            FROM timetable 
            WHERE class_id=? 
            ORDER BY 
                CASE day
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    ELSE 6
                END,
                period
        """, (class_id,))
        rows = cur.fetchall()

    # Convert normalized data to frontend format (6 periods per day)
    timetable_dict = {}
    for day, period, subject, start_time, end_time in rows:
        if day not in timetable_dict:
            timetable_dict[day] = [""] * 6  # 6 empty periods

        # Period is 1-indexed, array is 0-indexed
        if 1 <= period <= 6:
            timetable_dict[day][period-1] = subject

    # Convert to list format expected by frontend
    timetable = []
    for day, periods in sorted(timetable_dict.items()):
        timetable.append({"day": day, "periods": periods})

    return jsonify(timetable)


@app.route("/api/students")
def api_students():
    """API to get all students"""
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT s.id, s.name, c.name as class_name
            FROM students s
            JOIN classes c ON s.class_id = c.id
            ORDER BY s.name
        """)
        students = cur.fetchall()

    result = []
    for s in students:
        result.append({
            "id": s[0],
            "name": s[1],
            "class": s[2]
        })
    return jsonify(result)


@app.route("/api/my_class/students")
@teacher_required
def api_my_class_students():
    """API to get students in teacher's class"""
    teacher_name = session.get("user")

    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT class_id FROM teachers WHERE name=?",
                    (teacher_name,))
        result = cur.fetchone()

        if not result:
            return jsonify([])

        cur.execute("""
            SELECT id, name 
            FROM students 
            WHERE class_id=? 
            ORDER BY name
        """, (result[0],))
        students = cur.fetchall()

    return jsonify([{"id": s[0], "name": s[1]} for s in students])

# -------------------
# Utility Routes
# -------------------


@app.route("/logout")
def logout():
    """Logout user"""
    session.pop("user", None)
    session.pop("role", None)
    flash("Logged out successfully", "info")
    return redirect("/")


@app.errorhandler(404)
def page_not_found(e):
    """404 error handler"""
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_error(e):
    """500 error handler"""
    return render_template('500.html'), 500


# -------------------
# Application Entry Point
# -------------------
if __name__ == "__main__":
    # Create database if it doesn't exist
    try:
        with get_db() as conn:
            conn.execute("SELECT 1 FROM users LIMIT 1")
    except sqlite3.OperationalError:
        print("Database not found. Initializing...")
        import init_db
        init_db.init_database()

    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000)
